/**
 * Narzędzie AI (9.3) dla Ekranu 21, Moduł 7 "Stress-test zimowy" — "Wydajność pomp i zaworów w
 * niskich temperaturach". `operationType: 'read'`. Minimalne temperatury pracy pochodzą z kart
 * katalogowych podanych przez usera — model ich nie zgaduje.
 */
import { z } from "zod"
import { calculatePompyZaworyWMrozie } from "@/lib/core/modules/stress-test/pompy-zawory-w-mrozie/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Typ = z.enum(["pompa", "zawor", "silownik", "inne"])

export const PompyZaworyWMrozieToolInput = z.object({
  temperaturaMiejscaC: z.number().nullable().describe("Minimalna spodziewana temperatura w miejscu montażu [°C] — od usera"),
  elementy: z
    .array(
      z.object({
        nazwa: z.string(),
        typ: Typ,
        minTempPracyC: z.number().nullable().describe("Minimalna temperatura pracy z karty [°C]; null gdy user nie zna — nie zgaduj"),
      }),
    )
    .describe("Pompy (ciepła, obiegowe, głębinowe), zawory i siłowniki w tym miejscu"),
  maZaworZewnetrzny: z.boolean().describe("Czy jest zawór zewnętrzny do wody ogrodowej"),
  zaworZewnetrznyOprozniony: z.boolean().describe("Czy zawór zewnętrzny opróżniono przed zimą"),
})
export type PompyZaworyWMrozieToolInputT = z.infer<typeof PompyZaworyWMrozieToolInput>

export const PompyZaworyWMrozieToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  oceny: z.array(z.object({ nazwa: z.string(), typ: Typ, zapasK: z.number().nullable() })),
  liczbaPonizejMin: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PompyZaworyWMrozieToolOutputT = z.infer<typeof PompyZaworyWMrozieToolOutput>

export const pompyZaworyWMrozieTool: AiToolDefinition<PompyZaworyWMrozieToolInputT, PompyZaworyWMrozieToolOutputT> = {
  name: "sprawdz_pompy_i_zawory_w_mrozie",
  description:
    "Sprawdza, które pompy, zawory i siłowniki pracują poniżej swojej minimalnej temperatury pracy z karty " +
    "katalogowej przy najniższej temperaturze miejsca montażu, oraz czy zawór zewnętrzny opróżniono przed zimą " +
    "(Moduł 7, Ekran 21). Użyj, gdy user pyta, czy pompa w garażu/studni albo zawór na zewnątrz przetrwa mróz.",
  inputSchema: PompyZaworyWMrozieToolInput,
  outputSchema: PompyZaworyWMrozieToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/pompy-zawory-w-mrozie",
  handler: async (input) => {
    const wynik = calculatePompyZaworyWMrozie({
      ...input,
      elementy: input.elementy.map((e, i) => ({ ...e, id: String(i + 1) })),
    })
    return {
      status: wynik.status,
      oceny: wynik.value.oceny.map(({ nazwa, typ, zapasK }) => ({ nazwa, typ, zapasK })),
      liczbaPonizejMin: wynik.value.liczbaPonizejMin,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
