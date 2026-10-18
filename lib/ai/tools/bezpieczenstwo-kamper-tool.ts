/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — Ekran 22 "Bezpieczeństwo w kamperze".
 * `operationType: 'read'`. Checklista — jedyne fakty wejściowe to chemia i lista ID pozycji faktycznie
 * sprawdzonych przez usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBezpieczenstwoKamper } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BezpieczenstwoKamperToolInput = z.object({
  chemia: z.enum(["AGM", "kwasowy", "LiFePO4"]).describe("Chemia akumulatora — od usera"),
  potwierdzoneIds: z.array(z.string()).describe("ID pozycji checklisty, które user faktycznie sprawdził"),
})
export type BezpieczenstwoKamperToolInputT = z.infer<typeof BezpieczenstwoKamperToolInput>

export const BezpieczenstwoKamperToolOutput = z.object({
  status: z.enum(STATUSY),
  pozycje: z.array(z.object({ id: z.string(), element: z.string() })).describe("Pozycje checklisty dla tej chemii"),
  potwierdzone: z.number(),
  razem: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BezpieczenstwoKamperToolOutputT = z.infer<typeof BezpieczenstwoKamperToolOutput>

export const bezpieczenstwoKamperTool: AiToolDefinition<BezpieczenstwoKamperToolInputT, BezpieczenstwoKamperToolOutputT> = {
  name: "sprawdz_bezpieczenstwo_akumulatora_w_kamperze",
  description: "Sprawdza montaż akumulatora w kamperze (Moduł 12) listą kontrolną zależną od chemii: wentylowana skrzynia na zewnątrz dla ołowiowego (wodór), mocowanie na wibracje, dostęp serwisowy, ochrona przed wilgocią i przegrzaniem, osłona zacisków. Użyj, gdy user pyta, jak bezpiecznie zamontować akumulator w kamperze.",
  inputSchema: BezpieczenstwoKamperToolInput,
  outputSchema: BezpieczenstwoKamperToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/bezpieczenstwo-kamper",
  handler: async (input) => {
    const wynik = calculateBezpieczenstwoKamper(input)
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
