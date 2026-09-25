/**
 * Narzędzie AI (9.3) dla Ekranu 21, Moduł 3 — "Mikroinwertery vs inwerter centralny". `operationType: 'read'`.
 */
import { z } from "zod"
import { calculateMikroinwerteryVsCentralny } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/calculator"
import { KRYTERIA_POROWNANIA } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen } from "./teksty-wyniku"

export const MikroinwerteryVsCentralnyToolInput = z.object({
  regularneZacienienie: z
    .boolean()
    .describe("Czy panele będą częściowo lub regularnie zacienione (drzewa, komin, sąsiedni budynek). Dopytaj usera, nie zgaduj."),
})

export type MikroinwerteryVsCentralnyToolInputT = z.infer<typeof MikroinwerteryVsCentralnyToolInput>

export const MikroinwerteryVsCentralnyToolOutput = z.object({
  rekomendacja: z.enum(["mikroinwertery", "centralny"]).nullable(),
  porownanie: z.array(z.object({ kryterium: z.string(), mikroinwerter: z.string(), centralny: z.string() })),
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type MikroinwerteryVsCentralnyToolOutputT = z.infer<typeof MikroinwerteryVsCentralnyToolOutput>

export const mikroinwerteryVsCentralnyTool: AiToolDefinition<
  MikroinwerteryVsCentralnyToolInputT,
  MikroinwerteryVsCentralnyToolOutputT
> = {
  name: "porownaj_mikroinwertery_i_inwerter_centralny",
  description:
    "Porównuje mikroinwertery z inwerterem centralnym (zacienienie, monitoring, koszt, niezawodność) i " +
    "rekomenduje rozwiązanie na podstawie tego, czy panele są regularnie zacienione. Zwraca też " +
    "ostrzeżenie o wymaganiach mikroinwerterów w instalacji off-grid. Użyj, gdy user waha się między " +
    "mikroinwerterami a jednym falownikiem.",
  inputSchema: MikroinwerteryVsCentralnyToolInput,
  outputSchema: MikroinwerteryVsCentralnyToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/mikroinwertery-vs-centralny",
  handler: async (input) => {
    const wynik = calculateMikroinwerteryVsCentralny(input)
    return {
      rekomendacja: wynik.value.rekomendacja,
      porownanie: KRYTERIA_POROWNANIA.map(({ kryterium, mikroinwerter, centralny }) => ({ kryterium, mikroinwerter, centralny })),
      status: wynik.status,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
