/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2C — odzysk ciepła ze ścieków (dawne 5.41). `operationType: 'read'`. Ilość
 * wody, temperatury i sprawność wymiennika pochodzą od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateOdzyskCieplaSciekow } from "@/lib/core/modules/ogrzewanie/odzysk-ciepla-sciekow/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const OdzyskCieplaSciekowToolInput = z.object({
  litryDoba: z.number().describe("Woda z prysznica spływająca w czasie poboru zimnej wody [l/dobę]"),
  tSciekowC: z.number().nullable().describe("Temperatura wody do odpływu [°C]; null = nie podano"),
  tZimnejC: z.number().nullable().describe("Temperatura zimnej wody [°C]; null = nie podano"),
  sprawnoscPct: z.number().describe("Sprawność wymiennika z karty [%]"),
  dniRok: z.number().describe("Dni użytkowania w roku; 0 = bez wyniku rocznego"),
  cwuKwhRok: z.number().describe("Roczne zapotrzebowanie na ciepło C.W.U. [kWh]; 0 = nie podano"),
  copPodgrzewacza: z.number().describe("COP pompy C.W.U. albo 1 dla grzałki; 0 = nie podano"),
})
export type OdzyskCieplaSciekowToolInputT = z.infer<typeof OdzyskCieplaSciekowToolInput>

export const OdzyskCieplaSciekowToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  cieploDobaKwh: z.number(),
  cieploRokKwh: z.number().nullable(),
  udzialCwuPct: z.number().nullable(),
  pradDobaKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type OdzyskCieplaSciekowToolOutputT = z.infer<typeof OdzyskCieplaSciekowToolOutput>

export const odzyskCieplaSciekowTool: AiToolDefinition<OdzyskCieplaSciekowToolInputT, OdzyskCieplaSciekowToolOutputT> = {
  name: "policz_odzysk_ciepla_ze_sciekow",
  description:
    "Ciepło odzyskane przez wymiennik na pionie kanalizacyjnym (DWHR) z wody spływającej spod prysznica: kWh na dobę " +
    "i w roku, udział w C.W.U. i zaoszczędzony prąd podgrzewacza. Użyj, gdy user pyta, czy opłaca się odzysk ciepła " +
    "ze ścieków, ile da wymiennik typu PowerPipe albo ile ciepła ucieka z prysznicem do kanalizacji.",
  inputSchema: OdzyskCieplaSciekowToolInput,
  outputSchema: OdzyskCieplaSciekowToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/odzysk-ciepla-sciekow",
  handler: async (input) => {
    const wynik = calculateOdzyskCieplaSciekow(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
