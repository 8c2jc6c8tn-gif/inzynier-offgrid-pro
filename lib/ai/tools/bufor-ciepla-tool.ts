/**
 * Narzędzie AI (9.3) dla Modułu 6, Ekran 14 "Bufor ciepła — dobór pojemności" (dawne 5.14).
 * `operationType: 'read'`. Moc pompy ciepła i posiadana/planowana pojemność bufora pochodzą
 * WYŁĄCZNIE od usera (karta katalogowa / stan faktyczny instalacji).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateBuforCiepla } from "@/lib/core/modules/ogrzewanie/bufor-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const BuforCieplaToolInput = z.object({
  mocPompyKw: z.number().describe("Moc pompy ciepła [kW] — od usera (karta katalogowa)"),
  pojemnoscBuforaL: z.number().describe("Posiadana/planowana pojemność bufora [l] — od usera, do sprawdzenia czy wystarcza"),
})
export type BuforCieplaToolInputT = z.infer<typeof BuforCieplaToolInput>

export const BuforCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  zalecanaPojemnoscL: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type BuforCieplaToolOutputT = z.infer<typeof BuforCieplaToolOutput>

export const buforCieplaTool: AiToolDefinition<BuforCieplaToolInputT, BuforCieplaToolOutputT> = {
  name: "policz_bufor_ciepla",
  description:
    "Zalecana pojemność bufora ciepła dla pompy ciepła: V_bufora = P_pompy × 50 l/kW. Ostrzega, gdy posiadany/" +
    "planowany bufor jest za mały wobec zalecenia. Moc pompy i pojemność bufora podaje user. Użyj, gdy user pyta " +
    "o dobór/wielkość bufora ciepła (zbiornika buforowego) do pompy ciepła.",
  inputSchema: BuforCieplaToolInput,
  outputSchema: BuforCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/bufor-ciepla",
  handler: async (input) => {
    const wynik = calculateBuforCiepla({
      mocPompyKw: input.mocPompyKw,
      pojemnoscBuforaL: input.pojemnoscBuforaL,
    })
    return {
      status: wynik.status,
      zalecanaPojemnoscL: wynik.value.zalecanaPojemnoscL,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
