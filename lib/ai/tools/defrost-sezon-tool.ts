/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — defrost w sezonie w scenariuszach pogody (dawne 5.56), dokładka do
 * Ekranu 6. `operationType: 'read'`. Cykl każdego scenariusza (odstęp, czas) — karta / sterownik / obserwacja.
 */
import { z } from "zod"
import { calculateDefrostSezon } from "@/lib/core/modules/ogrzewanie/defrost-sezon/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const Scenariusz = z.object({
  odstepMin: z.number().describe("Odstęp między startami defrostów w tej pogodzie [min]"),
  czasDefrostuMin: z.number().describe("Czas jednego defrostu [min]"),
  godzinyDobaH: z.number().describe("Godziny na dobę w tej pogodzie [h, 0–24]"),
  dni: z.number().describe("Dni w sezonie z tą pogodą"),
})

export const DefrostSezonToolInput = z.object({
  mocDefrostuKw: z.number().describe("Moc elektryczna pompy w czasie defrostu [kW]"),
  scenariusze: z.array(Scenariusz).describe("Scenariusze pogody, np. mgła −2 °C, lekki mróz, sucho"),
  zuzyciePompySezonKwh: z.number().describe("Zużycie prądu przez pompę w sezonie [kWh]; 0 = bez udziału"),
})
export type DefrostSezonToolInputT = z.infer<typeof DefrostSezonToolInput>

const WynikScenariusza = z
  .object({ udzialCzasuPct: z.number(), defrostowDoba: z.number(), energiaDobaKwh: z.number(), energiaSezonKwh: z.number() })
  .nullable()

export const DefrostSezonToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  scenariusze: z.array(WynikScenariusza),
  sumaKwh: z.number(),
  udzialPct: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DefrostSezonToolOutputT = z.infer<typeof DefrostSezonToolOutput>

export const defrostSezonTool: AiToolDefinition<DefrostSezonToolInputT, DefrostSezonToolOutputT> = {
  name: "policz_defrost_pompy_w_sezonie",
  description:
    "Energia odszraniania (defrostu) pompy ciepła w sezonie, sumowana z kilku scenariuszy pogody — każdy z własnym " +
    "cyklem (odstęp, czas), godzinami na dobę i dniami; udział w zużyciu pompy. Użyj, gdy user pyta, ile prądu zje " +
    "defrost w sezonie, przy jakiej pogodzie defrost kosztuje najwięcej albo czy ustawienia defrostu są rozsądne.",
  inputSchema: DefrostSezonToolInput,
  outputSchema: DefrostSezonToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/defrost-sezon",
  handler: async (input) => {
    const wynik = calculateDefrostSezon(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
