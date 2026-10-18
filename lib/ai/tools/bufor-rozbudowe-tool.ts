/**
 * Narzędzie AI (9.3) dla Modułu 2, Ekran 13 "Bufor na rozbudowę". `operationType: 'read'`.
 * Całkowite zapotrzebowanie i wybrany bufor % (suwak 0/10/20/30 ze źródła) pochodzą WYŁĄCZNIE
 * od usera.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBuforRozbudowy } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BuforRozbudowyToolInput = z.object({
  zapotrzebowanieCalkowiteKwh: z.number().describe("Całkowite zapotrzebowanie dobowe bez bufora [kWh] — od usera"),
  buforPct: z.union([z.literal(0), z.literal(10), z.literal(20), z.literal(30)]).describe("Bufor na rozbudowę [%] — suwak 0/10/20/30 wg źródła, od usera"),
})
export type BuforRozbudowyToolInputT = z.infer<typeof BuforRozbudowyToolInput>

export const BuforRozbudowyToolOutput = z.object({
  status: z.enum(STATUSY),
  zapotrzebowanieZBuforemKwh: z.number(),
  dodatekKwh: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BuforRozbudowyToolOutputT = z.infer<typeof BuforRozbudowyToolOutput>

export const buforRozbudowyTool: AiToolDefinition<BuforRozbudowyToolInputT, BuforRozbudowyToolOutputT> = {
  name: "policz_zapotrzebowanie_z_buforem_rozbudowy",
  description:
    "Liczy zapotrzebowanie dobowe [kWh] powiększone o bufor na rozbudowę (0/10/20/30%) — Moduł 2, Ekran 13. " +
    "Zapotrzebowanie i procent bufora podaje user — nie zgaduj. Użyj, gdy user pyta o zapas mocy/energii na " +
    "przyszłą rozbudowę systemu off-grid.",
  inputSchema: BuforRozbudowyToolInput,
  outputSchema: BuforRozbudowyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "zapotrzebowanie/bufor-rozbudowe",
  handler: async (input) => {
    const wynik = calculateBuforRozbudowy({
      zapotrzebowanieCalkowiteKwh: input.zapotrzebowanieCalkowiteKwh,
      buforPct: input.buforPct,
    })
    return {
      status: wynik.status,
      zapotrzebowanieZBuforemKwh: wynik.value.zapotrzebowanieZBuforemKwh,
      dodatekKwh: wynik.value.dodatekKwh,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
