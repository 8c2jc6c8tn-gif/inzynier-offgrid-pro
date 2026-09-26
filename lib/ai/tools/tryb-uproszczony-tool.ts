/**
 * Narzędzie AI (9.3) dla Ekranu 1, Modułu 12 "Szybki kalkulator/tryb mobilny" — "Tryb
 * uproszczony — dobór akumulatora i odbiorników". `operationType: 'read'`. Pojemność
 * akumulatora, napięcie i moc odbiornika MUSZĄ pochodzić od usera — model nigdy ich nie zgaduje.
 * Wynik to teoretyczny czas pracy (bez sprawności/DoD/temperatury — Wzorzec D-lite, szybka
 * odpowiedź na jedno pytanie, nie pełny proces projektowy).
 */
import { z } from "zod"
import { calculateTrybUproszczony } from "@/lib/core/modules/kalkulator-mobilny/tryb-uproszczony/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TrybUproszczonyToolInput = z.object({
  pojemnoscAh: z.number().describe("Pojemność akumulatora [Ah] — od usera, nie zgaduj"),
  napiecieV: z.number().describe("Napięcie nominalne akumulatora [V] — od usera"),
  mocOdbiornikaW: z.number().describe("Moc odbiornika [W] — od usera"),
})
export type TrybUproszczonyToolInputT = z.infer<typeof TrybUproszczonyToolInput>

export const TrybUproszczonyToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  czasPracyH: z.number().describe("Teoretyczny czas pracy odbiornika [h] = C_Ah × V / P"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TrybUproszczonyToolOutputT = z.infer<typeof TrybUproszczonyToolOutput>

export const trybUproszczonyTool: AiToolDefinition<TrybUproszczonyToolInputT, TrybUproszczonyToolOutputT> = {
  name: "oblicz_czas_pracy_tryb_uproszczony",
  description:
    "Liczy teoretyczny czas pracy odbiornika z akumulatora (Moduł 12, Ekran 1, tryb uproszczony/mobilny) " +
    "ze wzoru t = C_Ah × V / P. To wartość TEORETYCZNA — bez sprawności falownika, głębokości rozładowania " +
    "(DoD) ani wpływu temperatury (szybka orientacyjna odpowiedź, nie pełny proces projektowy z pozostałych " +
    "modułów). Użyj, gdy user pyta szybko/w terenie, jak długo dany odbiornik pociągnie z danego akumulatora.",
  inputSchema: TrybUproszczonyToolInput,
  outputSchema: TrybUproszczonyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/tryb-uproszczony",
  handler: async (input) => {
    const wynik = calculateTrybUproszczony(input)
    return {
      status: wynik.status,
      czasPracyH: wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
