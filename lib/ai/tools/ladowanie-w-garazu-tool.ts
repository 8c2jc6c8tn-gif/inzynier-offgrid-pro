/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 36 "Bezpieczne ładowanie w garażu".
 * `operationType: 'read'`. Checklista — jedyne fakty wejściowe to chemia i lista ID pozycji faktycznie
 * sprawdzonych przez usera.
 */
import { z } from "zod"
import { calculateLadowanieWGarazu } from "@/lib/core/modules/kalkulator-mobilny/ladowanie-w-garazu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const LadowanieWGarazuToolInput = z.object({
  chemia: z.enum(["AGM", "kwasowy", "LiFePO4"]).describe("Chemia akumulatora — od usera"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty, które user faktycznie sprawdził"),
})
export type LadowanieWGarazuToolInputT = z.infer<typeof LadowanieWGarazuToolInput>

export const LadowanieWGarazuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  pozycje: z.array(z.object({ id: z.string(), element: z.string() })).describe("Pozycje checklisty dla tej chemii"),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type LadowanieWGarazuToolOutputT = z.infer<typeof LadowanieWGarazuToolOutput>

export const ladowanieWGarazuTool: AiToolDefinition<LadowanieWGarazuToolInputT, LadowanieWGarazuToolOutputT> = {
  name: "sprawdz_ladowanie_w_garazu",
  description: "Sprawdza bezpieczeństwo ładowania akumulatora w garażu (Moduł 12) listą kontrolną zależną od chemii: wentylacja i brak źródeł iskrzenia dla ołowiowego (wodór), ładowarka właściwa dla chemii. LiFePO4 nie wydziela gazów. Użyj, gdy user pyta, czy może ładować akumulator w garażu.",
  inputSchema: LadowanieWGarazuToolInput,
  outputSchema: LadowanieWGarazuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/ladowanie-w-garazu",
  handler: async (input) => {
    const wynik = calculateLadowanieWGarazu(input)
    return {
      status: wynik.status,
      pozycje: wynik.value.pozycje.map(({ id, element }) => ({ id, element })),
      potwierdzone: wynik.value.potwierdzone,
      razem: wynik.value.razem,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
