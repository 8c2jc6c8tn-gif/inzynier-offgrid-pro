/**
 * Narzędzie AI (9.3) dla Ekranu 26, Moduł 4 "Magazyn energii / baterie" — "Topologia BMS
 * (Common Port vs Separate Port)". `operationType: 'read'`. Prąd znamionowy portu Common Port i
 * szczytowy prąd rozruchu falownika MUSZĄ pochodzić z karty katalogowej.
 */
import { z } from "zod"
import { calculateTopologiaBms } from "@/lib/core/modules/baterie/topologia-bms/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const TopologiaBmsToolInput = z.object({
  bmsCommonPortA: z.number().describe("Prąd znamionowy portu Common Port wybranego BMS [A] — z karty katalogowej"),
  falownikPradRozruchuA: z.number().describe("Szczytowy prąd pobierany przez falownik przy rozruchu [A] — z karty katalogowej"),
})
export type TopologiaBmsToolInputT = z.infer<typeof TopologiaBmsToolInput>

export const TopologiaBmsToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  bmsCommonPortA: z.number(),
  falownikPradRozruchuA: z.number(),
  commonPortWystarcza: z.boolean(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type TopologiaBmsToolOutputT = z.infer<typeof TopologiaBmsToolOutput>

export const topologiaBmsTool: AiToolDefinition<TopologiaBmsToolInputT, TopologiaBmsToolOutputT> = {
  name: "sprawdz_topologie_bms_common_port",
  description:
    "Sprawdza, czy prąd znamionowy portu Common Port wybranego BMS wystarcza na szczytowy prąd rozruchu " +
    "falownika, czy trzeba wybrać topologię Separate Port (Moduł 4, Ekran 26). Prąd Common Port i prąd " +
    "rozruchu falownika MUSZĄ pochodzić z karty katalogowej — nie zgaduj. Użyj, gdy user pyta, którą topologię " +
    "BMS wybrać.",
  inputSchema: TopologiaBmsToolInput,
  outputSchema: TopologiaBmsToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/topologia-bms",
  handler: async (input) => {
    const wynik = calculateTopologiaBms({ bmsCommonPortA: input.bmsCommonPortA, falownikPradRozruchuA: input.falownikPradRozruchuA })
    return {
      status: wynik.status,
      bmsCommonPortA: wynik.value.bmsCommonPortA,
      falownikPradRozruchuA: wynik.value.falownikPradRozruchuA,
      commonPortWystarcza: wynik.value.commonPortWystarcza,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
