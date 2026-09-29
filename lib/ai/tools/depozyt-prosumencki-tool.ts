/**
 * Narzędzie AI (9.3) dla M14 — D8 „Net-billing, depozyt — co tracę, odchodząc” (mini-kalkulator).
 * `operationType: 'read'`. Echo silnika `siec/depozyt-prosumencki`: ×1,23, zwrot max 20% RCEm / 30% RCE,
 * umorzenie po 12 miesiącach (ustawa o OZE). Tylko net-billing. Cenę rynkową i wykorzystanie podaje user.
 */
import { z } from "zod"
import { calculateDepozyt } from "@/lib/core/modules/siec/depozyt-prosumencki/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DepozytProsumenckiToolInput = z.object({
  dataMiesiaca: z.string().describe("Data w miesiącu oddania energii RRRR-MM-DD (wybiera okres współczynnika ×1,23)"),
  energiaOddanaKwh: z.number().describe("Energia oddana do sieci w tym miesiącu [kWh] — z faktury/aplikacji OSD"),
  cenaRynkowaZlMwh: z
    .number()
    .describe("Średnia cena rynkowa tej energii [zł/MWh] (RCEm albo RCE ważona godzinami) — z faktury/PSE, nie zgaduj"),
  systemCeny: z.enum(["rcem", "rce"]).describe("rcem = cena miesięczna (zwrot max 20%), rce = cena godzinowa (zwrot max 30%)"),
  wykorzystanoZl: z
    .number()
    .nullable()
    .describe("Ile z depozytu tego miesiąca wykorzystano w ciągu 12 miesięcy [zł]; null gdy jeszcze nie wiadomo"),
  pelnyKosztKwhBruttoZl: z
    .number()
    .nullable()
    .describe("Opcjonalnie pełny koszt brutto 1 kWh pobranej [zł/kWh] (np. z rozbicia rachunku) — do współczynnika bilansowania; null gdy brak"),
})
export type DepozytProsumenckiToolInputT = z.infer<typeof DepozytProsumenckiToolInput>

export const DepozytProsumenckiToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  wartoscEnergiiZl: z.number(),
  depozytZl: z.number(),
  maksZwrotZl: z.number(),
  niewykorzystanoZl: z.number().nullable(),
  zwrotZl: z.number().nullable(),
  umorzenieZl: z.number().nullable(),
  wspolczynnikBilansowania: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DepozytProsumenckiToolOutputT = z.infer<typeof DepozytProsumenckiToolOutput>

export const depozytProsumenckiTool: AiToolDefinition<DepozytProsumenckiToolInputT, DepozytProsumenckiToolOutputT> = {
  name: "policz_depozyt_prosumencki",
  description:
    "Liczy depozyt prosumencki net-billingu za jeden miesiąc (M14, D8): wartość oddanej energii × 1,23, maksymalny " +
    "zwrot niewykorzystanej części (20% przy RCEm, 30% przy RCE), zwrot i umorzenie po 12 miesiącach oraz " +
    "współczynnik bilansowania (ile wart jest 1 kWh oddana wobec 1 kWh pobranej). Tylko net-billing — dla " +
    "net-meteringu nie licz. Cenę rynkową i wykorzystanie podaje user — nie zgaduj. Użyj, gdy prosument pyta, ile " +
    "traci na depozycie, ile odzyska przy odejściu z sieci albo ile naprawdę wart jest oddany kWh.",
  inputSchema: DepozytProsumenckiToolInput,
  outputSchema: DepozytProsumenckiToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/depozyt-prosumencki",
  handler: async (input) => {
    const wynik = calculateDepozyt(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
