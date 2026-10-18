/**
 * Narzędzie AI (9.3) dla Ekranu 7, Moduł 3 — "Mikropęknięcia termiczne". `operationType: 'read'`.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateMikropeknieciaTermiczne } from "@/lib/core/modules/pv/mikropekniecia-termiczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const MikropeknieciaTermiczneToolInput = z.object({
  odstepDylatacyjnyMm: z
    .number()
    .describe("Odstęp dylatacyjny (luz) między sąsiednimi panelami PV w rzędzie, w milimetrach; 0 = montaż na styk"),
  podkladkiEpdm: z.boolean().describe("Czy w mocowaniach paneli zastosowano elastyczne podkładki EPDM (gumowe)"),
})

export type MikropeknieciaTermiczneToolInputT = z.infer<typeof MikropeknieciaTermiczneToolInput>

export const MikropeknieciaTermiczneToolOutput = z.object({
  montazSztywny: z.boolean(),
  status: z.enum(STATUSY),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type MikropeknieciaTermiczneToolOutputT = z.infer<typeof MikropeknieciaTermiczneToolOutput>

export const mikropeknieciaTermiczneTool: AiToolDefinition<
  MikropeknieciaTermiczneToolInputT,
  MikropeknieciaTermiczneToolOutputT
> = {
  name: "ocen_ryzyko_mikropekniec_termicznych",
  description:
    "Ocenia, czy montaż paneli PV jest zbyt sztywny i grozi mikropęknięciami ogniw od cyklicznych " +
    "zmian temperatury (brak podkładek EPDM lub odstęp dylatacyjny poniżej 5 mm). Użyj, gdy user " +
    "pyta o mocowanie paneli, luz między panelami, podkładki gumowe albo mikropęknięcia.",
  inputSchema: MikropeknieciaTermiczneToolInput,
  outputSchema: MikropeknieciaTermiczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/mikropekniecia-termiczne",
  handler: async (input) => {
    const wynik = calculateMikropeknieciaTermiczne(input)
    return {
      montazSztywny: wynik.value.montazSztywny,
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
