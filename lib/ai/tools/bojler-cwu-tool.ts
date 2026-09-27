/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 2 "Inteligentny bojler C.W.U.". `operationType: 'read'`.
 * Wolumen C.W.U., wzrost temperatury (ΔT — źródło nie podaje wartości, nie zgaduj), moc grzałki
 * i pojemność bojlera pochodzą WYŁĄCZNIE od usera.
 */
import { z } from "zod"
import { calculateBojlerCwu } from "@/lib/core/modules/zapotrzebowanie/bojler-cwu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BojlerCwuToolInput = z.object({
  wolumenCwuLDoba: z.number().describe("Dobowe zapotrzebowanie na C.W.U. [l/dobę] — od usera (docelowo z Ekranu 4)"),
  deltaTK: z.number().describe("Wzrost temperatury wody (zimna → C.W.U.) [K] — od usera, źródło nie podaje wartości, nie zgaduj"),
  mocGrzalkiKw: z.number().describe("Moc grzałki bojlera [kW] — od usera"),
  pojemnoscBojleraL: z.number().describe("Pojemność zbiornika bojlera [l] — od usera"),
})
export type BojlerCwuToolInputT = z.infer<typeof BojlerCwuToolInput>

export const BojlerCwuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  energiaDobowaKwh: z.number(),
  czasLadowaniaH: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BojlerCwuToolOutputT = z.infer<typeof BojlerCwuToolOutput>

export const bojlerCwuTool: AiToolDefinition<BojlerCwuToolInputT, BojlerCwuToolOutputT> = {
  name: "policz_energie_bojlera_cwu",
  description:
    "Liczy dobową energię [kWh/dobę] potrzebną do podgrzania C.W.U. (Q = V×ΔT×0,001163) i czas ładowania bojlera " +
    "[h] — Moduł 2, Ekran 2. Wolumen C.W.U., ΔT, moc grzałki i pojemność bojlera podaje user — ΔT nie ma " +
    "domyślnej wartości w źródle, nie zgaduj. Użyj, gdy user pyta o zużycie energii na podgrzanie ciepłej wody.",
  inputSchema: BojlerCwuToolInput,
  outputSchema: BojlerCwuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/bojler-cwu",
  handler: async (input) => {
    const wynik = calculateBojlerCwu({
      wolumenCwuLDoba: input.wolumenCwuLDoba,
      deltaTK: input.deltaTK,
      mocGrzalkiKw: input.mocGrzalkiKw,
      pojemnoscBojleraL: input.pojemnoscBojleraL,
    })
    return {
      status: wynik.status,
      energiaDobowaKwh: wynik.value.energiaDobowaKwh,
      czasLadowaniaH: wynik.value.czasLadowaniaH,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
