/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 8 — "Wejścia dla centrali sygnalizacji pożaru" (dawne 11.53).
 * `operationType: 'read'`. Stan centrali i odbierane sygnały — WYŁĄCZNIE od usera; model nie zakłada "tak".
 */
import { z } from "zod"
import { calculateCentralaSsp } from "@/lib/core/modules/bezpieczenstwo/centrala-ssp/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const CentralaSspToolInput = z.object({
  interfejs: z.enum(["styki", "rs485"]).nullable().describe("Styki bezpotencjałowe albo RS485"),
  stanCentrali: z.enum(["dozor", "awaria"]).nullable().describe("Stan centrali zgłaszany przez usera"),
  odbieraAlarm: z.boolean().describe("Sterownik odbiera sygnał alarmu — deklaracja usera"),
  odbieraAwarie: z.boolean().describe("Sterownik odbiera sygnał awarii centrali — deklaracja usera"),
  odbieraRozbrojenie: z.boolean().describe("Sterownik odbiera sygnał rozbrojenia — deklaracja usera"),
  logujeZdarzenia: z.boolean().describe("Zdarzenia są logowane — deklaracja usera"),
})
export type CentralaSspToolInputT = z.infer<typeof CentralaSspToolInput>

export const CentralaSspToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  liczbaBrakow: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CentralaSspToolOutputT = z.infer<typeof CentralaSspToolOutput>

export const centralaSspTool: AiToolDefinition<CentralaSspToolInputT, CentralaSspToolOutputT> = {
  name: "sprawdz_integracje_centrali_pozarowej",
  description:
    "Sprawdza integrację sterownika z centralą sygnalizacji pożaru: czy odbiera sygnały alarmu, awarii i rozbrojenia, czy " +
    "loguje zdarzenia; awaria centrali to twardy stop (Moduł 8, Ekran 5).",
  inputSchema: CentralaSspToolInput,
  outputSchema: CentralaSspToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "bezpieczenstwo/centrala-ssp",
  handler: async (input) => {
    const wynik = calculateCentralaSsp(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
