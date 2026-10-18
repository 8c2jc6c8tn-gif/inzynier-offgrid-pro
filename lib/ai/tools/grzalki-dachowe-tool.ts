/**
 * Narzędzie AI (9.3) dla Ekranu 11, Moduł 7 "Stress-test zimowy" — "Obciążenie grzałek dachowych
 * i rynnowych". `operationType: 'read'`. Moc kabla na metr i czas pracy pochodzą od usera —
 * model ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateGrzalkiDachowe } from "@/lib/core/modules/stress-test/grzalki-dachowe/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GrzalkiDachoweToolInput = z.object({
  dlugoscKablaM: z.number().describe("Łączna długość kabla grzewczego (rynny, kosze) [m]"),
  mocNaMetrW: z.number().describe("Moc jednostkowa kabla z karty [W/m] — od usera, nie zgaduj"),
  godzinyPracyNaDobe: z.number().describe("Czas pracy grzałek na dobę [h]"),
  mocPompyCieplaW: z.number().nullable().describe("Moc elektryczna pompy ciepła [W]; null gdy brak"),
  zapasMocyW: z.number().nullable().describe("Wolny zapas mocy falownika [W]; null gdy user nie zna"),
})
export type GrzalkiDachoweToolInputT = z.infer<typeof GrzalkiDachoweToolInput>

export const GrzalkiDachoweToolOutput = z.object({
  status: z.enum(STATUSY),
  mocW: z.number(),
  energiaKwhDoba: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GrzalkiDachoweToolOutputT = z.infer<typeof GrzalkiDachoweToolOutput>

export const grzalkiDachoweTool: AiToolDefinition<GrzalkiDachoweToolInputT, GrzalkiDachoweToolOutputT> = {
  name: "policz_grzalki_dachowe",
  description:
    "Liczy moc i dobowe zużycie energii kabli grzewczych w rynnach i koszach dachowych (P = L × W/m, E = P × h) " +
    "i sprawdza, czy nie przekraczają mocy pompy ciepła i wolnego zapasu mocy (Moduł 7, Ekran 11). " +
    "Użyj, gdy user pyta, ile prądu zjedzą grzałki przeciw zatorom lodowym.",
  inputSchema: GrzalkiDachoweToolInput,
  outputSchema: GrzalkiDachoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/grzalki-dachowe",
  handler: async (input) => {
    const wynik = calculateGrzalkiDachowe(input)
    return {
      status: wynik.status,
      mocW: wynik.value.mocW,
      energiaKwhDoba: wynik.value.energiaKwhDoba,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
