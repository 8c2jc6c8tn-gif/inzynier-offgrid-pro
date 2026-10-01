/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 17 "System C.W.U. — zasobnik i cyrkulacja" (dawne 5.19, 5.20, 5.21).
 * `operationType: 'read'`. UA zasobnika, strata rury, moc pompy MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { calculateZasobnikCwu } from "@/lib/core/modules/ogrzewanie/zasobnik-cwu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const ZasobnikCwuToolInput = z.object({
  osoby: z.number(),
  litrowNaOsobe: z.number().describe("Zużycie C.W.U. na osobę [l/dobę] (źródło: ok. 50)"),
  tZimnaC: z.number().describe("Temperatura zimnej wody [°C]"),
  tCwuC: z.number().describe("Temperatura C.W.U. w zasobniku [°C]"),
  pojemnoscL: z.number().describe("Pojemność zasobnika [l]"),
  uaWK: z.number().describe("Strata postojowa zasobnika UA z karty [W/K]"),
  uaPorownawczyWK: z.number().describe("UA innego zasobnika do porównania [W/K]; 0 = bez porównania"),
  tOtoczeniaC: z.number().describe("Temperatura otoczenia zasobnika [°C]"),
  nieogrzewane: z.boolean().describe("Zasobnik w nieogrzewanym pomieszczeniu (garaż, piwnica)"),
  dlugoscCyrkulacjiM: z.number().describe("Długość rur cyrkulacji [m]; 0 = bez cyrkulacji"),
  strataRuryWmK: z.number().describe("Strata liniowa izolowanej rury [W/(m·K)]"),
  tOtoczeniaRurC: z.number().nullable().describe("Temperatura otoczenia rur [°C]; null przy braku cyrkulacji"),
  godzinCyrkulacji: z.number().describe("Godziny pracy cyrkulacji na dobę [h]; ciągła = 24"),
  mocPompyW: z.number().describe("Moc pompy cyrkulacyjnej [W]"),
})
export type ZasobnikCwuToolInputT = z.infer<typeof ZasobnikCwuToolInput>

export const ZasobnikCwuToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  zapotrzebowanieL: z.number(),
  cieploWodyKwh: z.number(),
  strataPostojowaKwh: z.number(),
  strataPorownawczaKwh: z.number().nullable(),
  oszczednoscRocznaKwh: z.number().nullable(),
  cyrkulacjaCieploKwh: z.number(),
  cyrkulacjaPradKwh: z.number(),
  cyrkulacjaCiaglaKwh: z.number(),
  cieploRazemKwh: z.number(),
  udzialStratPct: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type ZasobnikCwuToolOutputT = z.infer<typeof ZasobnikCwuToolOutput>

export const zasobnikCwuTool: AiToolDefinition<ZasobnikCwuToolInputT, ZasobnikCwuToolOutputT> = {
  name: "policz_zasobnik_i_cyrkulacje_cwu",
  description:
    "System ciepłej wody: dobowe ciepło na podgrzanie wody, strata postojowa zasobnika UA·ΔT·24 h (z porównaniem " +
    "z innym zasobnikiem w kWh/rok) i koszt cyrkulacji (straty rur + prąd pompy, tryb użytkownika vs ciągły). " +
    "Użyj, gdy user pyta, ile traci jego bojler/zasobnik, czy wymienić go na lepiej izolowany, czy opłaca się " +
    "cyrkulacja ciągła, czasowa czy na żądanie, albo jaki udział mają straty w energii na ciepłą wodę.",
  inputSchema: ZasobnikCwuToolInput,
  outputSchema: ZasobnikCwuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/zasobnik-cwu",
  handler: async (input) => {
    const wynik = calculateZasobnikCwu(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
