/**
 * Narzędzie AI (9.3) dla Modułu 7 — Ekran 2 "Deficyty miesięczne i agregat" (dawne 6.2).
 * `operationType: 'read'`. Deficyty, moc, zużycie i cena paliwa MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateDeficytyMiesieczne } from "@/lib/core/modules/stress-test/deficyty-miesieczne/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DeficytyMiesieczneToolInput = z.object({
  deficytyKwh: z
    .array(z.number())
    .length(12)
    .describe("Deficyt energii w każdym miesiącu, styczeń..grudzień [kWh]; 0 = miesiąc bez deficytu (dokładnie 12 liczb)"),
  mocAgregatuKw: z.number().describe("Moc znamionowa (ciągła) agregatu [kW]"),
  zuzyciePaliwaLH: z.number().describe("Zużycie paliwa przy typowym obciążeniu z karty [l/h]"),
  cenaPaliwaZlL: z.number().describe("Cena paliwa [zł/l]"),
  kosztSerwisuZlH: z.number().describe("Koszt serwisu i oleju na motogodzinę [zł/h]; 0 = nie liczony"),
  zapasPaliwaL: z.number().describe("Zapas paliwa na miejscu [l]; 0 = nie wpisany"),
})
export type DeficytyMiesieczneToolInputT = z.infer<typeof DeficytyMiesieczneToolInput>

export const DeficytyMiesieczneToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  miesiace: z.array(
    z.object({
      miesiac: z.number(),
      deficytKwh: z.number(),
      godzinyPracy: z.number(),
      paliwoL: z.number(),
      kosztPaliwaZl: z.number(),
      kosztSerwisuZl: z.number(),
      kosztZl: z.number(),
    }),
  ),
  sumaDeficytKwh: z.number(),
  sumaGodzin: z.number(),
  sumaPaliwaL: z.number(),
  sumaKosztZl: z.number(),
  miesiacNajdluzszy: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DeficytyMiesieczneToolOutputT = z.infer<typeof DeficytyMiesieczneToolOutput>

export const deficytyMiesieczneTool: AiToolDefinition<DeficytyMiesieczneToolInputT, DeficytyMiesieczneToolOutputT> = {
  name: "policz_deficyty_miesieczne_agregat",
  description:
    "Zimowe deficyty energii miesiąc po miesiącu przeliczone na pracę agregatu: godziny pracy przy optymalnym " +
    "obciążeniu 80% mocy, litry paliwa, koszt paliwa i serwisu, sumy sezonu oraz porównanie z zapasem paliwa. " +
    "Użyj, gdy user pyta, ile godzin agregat przepracuje w grudniu/styczniu/lutym, ile paliwa kupić na zimę, ile " +
    "zima kosztuje w paliwie albo czy zapas paliwa wystarczy na najgorszy miesiąc.",
  inputSchema: DeficytyMiesieczneToolInput,
  outputSchema: DeficytyMiesieczneToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/deficyty-miesieczne",
  handler: async (input) => {
    const wynik = calculateDeficytyMiesieczne(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
