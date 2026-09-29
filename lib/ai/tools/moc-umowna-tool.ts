/**
 * Narzędzie AI (9.3) dla M14 — F4 „Moc umowna — przekroczenia i optymalny poziom”.
 * `operationType: 'read'`. Echo silnika `siec/moc-umowna`: opłata = stawka stała sieciowa × suma 10
 * największych nadwyżek (albo 10 × największa, gdy licznik nie umie pierwszego). Moce 15-min z licznika
 * podaje user — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculateMocUmowna } from "@/lib/core/modules/siec/moc-umowna/calculator"
import type { AiToolDefinition } from "../types"
import { SiecGrupaSchema, SiecOsdSchema } from "./siec-schematy"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MocUmownaToolInput = z.object({
  osd: SiecOsdSchema,
  grupa: SiecGrupaSchema,
  dataRozliczenia: z.string().describe("Data rozliczenia RRRR-MM-DD (wybiera okres ważności stawek)"),
  mocUmownaKw: z.number().describe("Obecna moc umowna [kW] z umowy"),
  stalaZlKwMiesWlasna: z
    .number()
    .optional()
    .describe("Stawka stała sieciowa [zł/kW/mies.] z faktury; pomiń, żeby użyć stawki z danych OSD 2026"),
  wariantPomiaru: z
    .enum(["suma10", "10xmax"])
    .describe("suma10 = licznik rejestruje 10 największych nadwyżek 15-min; 10xmax = tylko największą (×10) — zapytaj usera"),
  miesiace: z
    .array(
      z.object({
        maksKw: z.number().nullable().describe("Największa moc 15-min w miesiącu [kW] z licznika/faktury; null = miesiąc nie podany"),
        dziesiecNajwiekszychKw: z
          .array(z.number())
          .nullable()
          .describe("Opcjonalnie 10 największych mocy 15-min w miesiącu [kW] (wariant suma10); null gdy brak"),
      }),
    )
    .length(12)
    .describe("12 miesięcy, od stycznia"),
})
export type MocUmownaToolInputT = z.infer<typeof MocUmownaToolInput>

export const MocUmownaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  stalaZlKwMies: z.number(),
  oplatyMiesieczneZl: z.array(z.number()),
  oplataPrzekroczenRokZl: z.number(),
  kosztStalyRokZl: z.number(),
  kosztRazemRokZl: z.number(),
  optymalnaMocKw: z.number(),
  kosztOptymalnyRokZl: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type MocUmownaToolOutputT = z.infer<typeof MocUmownaToolOutput>

export const mocUmownaTool: AiToolDefinition<MocUmownaToolInputT, MocUmownaToolOutputT> = {
  name: "dobierz_moc_umowna",
  description:
    "Liczy roczny koszt mocy umownej firmy (M14, F4): opłatę stałą i opłaty za przekroczenia w każdym miesiącu " +
    "(stawka stała × suma 10 największych nadwyżek 15-min albo 10 × największa) oraz optymalną moc umowną, przy której " +
    "koszt stały + przekroczenia jest najniższy w zakresie grupy taryfowej. Moce 15-min z licznika podaje user — nie " +
    "zgaduj. Użyj, gdy firma pyta, czy ma dobrze dobraną moc umowną, ile płaci za przekroczenia albo o ile ją zmienić.",
  inputSchema: MocUmownaToolInput,
  outputSchema: MocUmownaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/moc-umowna",
  handler: async (input) => {
    const wynik = calculateMocUmowna(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
