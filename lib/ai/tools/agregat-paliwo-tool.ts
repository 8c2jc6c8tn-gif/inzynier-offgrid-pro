/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 35 "Agregat przenośny — ile paliwa na dobę".
 * `operationType: 'read'`. Zużycie paliwa [l/h] MUSI pochodzić z karty agregatu przy danym obciążeniu
 * (Dyrektywa #1 — w repo nie ma krzywej zużycia). Blok bezpieczeństwa D48 jak w M2/E17.
 */
import { z } from "zod"
import { calculateAgregatPaliwo } from "@/lib/core/modules/kalkulator-mobilny/agregat-paliwo/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AgregatPaliwoToolInput = z.object({
  mocAgregatuKw: z.number().describe("Moc znamionowa (ciągła) agregatu [kW] — od usera"),
  obciazeniePct: z.number().describe("Średnie obciążenie agregatu w czasie pracy [%] — od usera"),
  zuzycieLH: z.number().describe("Zużycie paliwa przy tym obciążeniu [l/h] — z karty agregatu, nie zgaduj"),
  godzinNaDobe: z.number().describe("Godziny pracy agregatu na dobę [h], 0–24"),
  cenaZlL: z.number().describe("Cena paliwa [zł/l] — od usera"),
  kosztPorownawczyZlKwh: z.number().describe("Koszt 1 kWh z innego źródła do porównania [zł/kWh]; 0 = bez porównania"),
  miejsceAgregatu: z
    .enum(["na-zewnatrz", "pomieszczenie-wydzielone", "wewnatrz-budynku"])
    .nullable()
    .describe("Gdzie pracuje agregat; null gdy user nie podał"),
  podlaczenieAgregatu: z
    .enum(["przez-przelacznik", "bez-przelacznika", "wejscie-ac-falownika", "tylko-odbiorniki"])
    .nullable()
    .describe("Jak agregat zasila odbiorniki; null gdy user nie podał"),
})
export type AgregatPaliwoToolInputT = z.infer<typeof AgregatPaliwoToolInput>

export const AgregatPaliwoToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  litrowNaDobe: z.number().describe("Paliwo na dobę [l]"),
  kosztNaDobeZl: z.number().describe("Koszt paliwa na dobę [zł]"),
  energiaNaDobeKwh: z.number().describe("Energia oddana przez agregat na dobę [kWh]"),
  kosztKwhZl: z.number().describe("Koszt 1 kWh z agregatu [zł/kWh]"),
  krotnoscPorownania: z.number().describe("Ile razy drożej niż źródło porównawcze; 0 = bez porównania"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AgregatPaliwoToolOutputT = z.infer<typeof AgregatPaliwoToolOutput>

export const agregatPaliwoTool: AiToolDefinition<AgregatPaliwoToolInputT, AgregatPaliwoToolOutputT> = {
  name: "policz_paliwo_agregatu_przenosnego",
  description:
    "Liczy dobowe zużycie paliwa małego agregatu przenośnego (l/h × godziny), koszt na dobę, oddaną " +
    "energię i koszt 1 kWh z agregatu, opcjonalnie w porównaniu z innym źródłem. Ocenia bezpieczeństwo " +
    "(agregat w budynku, podłączenie bez przełącznika — twardy stop). Użyj, gdy user pyta, ile paliwa " +
    "spali agregat na kempingu, działce albo w czasie awarii i ile to kosztuje.",
  inputSchema: AgregatPaliwoToolInput,
  outputSchema: AgregatPaliwoToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/agregat-paliwo",
  handler: async (input) => {
    const wynik = calculateAgregatPaliwo(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
