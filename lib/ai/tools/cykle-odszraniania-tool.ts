/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 6 "Cykle odszraniania (defrost)" (dawne 5.6 + 1.14 + 6.8).
 * `operationType: 'read'`. Cykl defrostu i pobory MUSZĄ pochodzić od usera (karta albo pomiar, Dyrektywa #1).
 */
import { z } from "zod"
import { calculateCykleOdszraniania } from "@/lib/core/modules/ogrzewanie/cykle-odszraniania/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const CykleOdszranianiaToolInput = z.object({
  tZewnC: z.number().describe("Temperatura zewnętrzna [°C]"),
  wilgotnoscPct: z.number().describe("Wilgotność względna powietrza [%]; 0 = nie wpisano (tylko informacja)"),
  odstepMin: z.number().describe("Odstęp między początkami kolejnych defrostów [min] — karta albo obserwacja"),
  czasDefrostuMin: z.number().describe("Czas jednego defrostu [min]"),
  mocDefrostuKw: z.number().describe("Pobór prądu w czasie defrostu [kW]"),
  mocBazowaKw: z.number().describe("Pobór prądu pompy przy normalnym grzaniu [kW]"),
  godzinySzronieniaH: z.number().describe("Godziny w dobie z warunkami szronienia [h]; 0 = bez wyniku dobowego"),
  copKatalogowy: z.number().describe("COP katalogowy w tej temperaturze; 0 = bez realnego COP"),
  tMinPracyC: z.number().nullable().describe("Minimalna temperatura pracy pompy z karty [°C]; null = nie sprawdzaj"),
})
export type CykleOdszranianiaToolInputT = z.infer<typeof CykleOdszranianiaToolInput>

export const CykleOdszranianiaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  udzialCzasuPct: z.number(),
  energiaNaGodzineKwh: z.number(),
  narzutPct: z.number(),
  energiaDobaKwh: z.number().nullable(),
  copEfektywny: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CykleOdszranianiaToolOutputT = z.infer<typeof CykleOdszranianiaToolOutput>

export const cykleOdszranianiaTool: AiToolDefinition<CykleOdszranianiaToolInputT, CykleOdszranianiaToolOutputT> = {
  name: "policz_koszt_defrostu_pompy",
  description:
    "Koszt odszraniania (defrostu) pompy ciepła z cyklu podanego przez usera: udział czasu defrostu, dodatkowa " +
    "energia na godzinę i dobę szronienia, narzut procentowy na zużycie prądu i realny COP z defrostem; ostrzeżenie, " +
    "gdy temperatura jest poniżej minimalnej temperatury pracy pompy. Użyj, gdy user pyta, ile prądu zjada defrost, " +
    "dlaczego pompa zużywa więcej niż wynika z katalogowego COP, jaki jest realny COP w wilgotny mróz albo co się " +
    "dzieje poniżej minimalnej temperatury pracy pompy.",
  inputSchema: CykleOdszranianiaToolInput,
  outputSchema: CykleOdszranianiaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/cykle-odszraniania",
  handler: async (input) => {
    const wynik = calculateCykleOdszraniania(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
