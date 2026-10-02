/**
 * Narzędzie AI (9.3) dla Modułu 6, Część 2B — pompa ciepła w grzaniu C.W.U. i zyski z nadwyżki PV (dawne 5.30,
 * 5.58), dokładka do Ekranu 18. `operationType: 'read'`. Temperatura maksymalna, COP i moc w trybie C.W.U. — z karty.
 */
import { z } from "zod"
import { calculateCwuPompaCiepla } from "@/lib/core/modules/ogrzewanie/cwu-pompa-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const CwuPompaCieplaToolInput = z.object({
  pojemnoscL: z.number().describe("Pojemność zasobnika C.W.U. [l]"),
  tStartC: z.number().nullable().describe("Temperatura wody na starcie [°C]"),
  tKoniecC: z.number().nullable().describe("Temperatura docelowa [°C]"),
  tMaxPompyC: z.number().nullable().describe("Najwyższa temperatura C.W.U. z pompy ciepła wg karty [°C] (źródło: zwykle 55–60)"),
  copCwu: z.number().describe("COP pompy w trybie C.W.U. z karty (średni dla tej temperatury wody)"),
  mocCieplnaPompyKw: z.number().describe("Moc grzewcza pompy w trybie C.W.U. [kW] z karty"),
  mocGrzalkiKw: z.number().describe("Moc grzałki dogrzewającej [kW]; 0 = bez czasu dogrzewu"),
  mocPvKw: z.number().describe("Nadwyżka PV w czasie grzania [kW]; 0 = nie liczymy udziału PV"),
})
export type CwuPompaCieplaToolInputT = z.infer<typeof CwuPompaCieplaToolInput>

export const CwuPompaCieplaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  cieploPompaKwh: z.number(),
  cieploGrzalkaKwh: z.number(),
  energiaPompaKwh: z.number(),
  energiaRazemKwh: z.number(),
  energiaSamaGrzalkaKwh: z.number(),
  oszczednoscKwh: z.number(),
  czasPompaH: z.number(),
  czasGrzalkaH: z.number().nullable(),
  mocElektrycznaPompyKw: z.number(),
  energiaZPvKwh: z.number().nullable(),
  energiaZBateriiKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type CwuPompaCieplaToolOutputT = z.infer<typeof CwuPompaCieplaToolOutput>

export const cwuPompaCieplaTool: AiToolDefinition<CwuPompaCieplaToolInputT, CwuPompaCieplaToolOutputT> = {
  name: "policz_grzanie_cwu_pompa_ciepla",
  description:
    "Podgrzew zasobnika C.W.U. pompą ciepła do jej temperatury maksymalnej, reszta grzałką: ciepło, prąd (Q/COP), " +
    "czas, porównanie z samą grzałką i udział nadwyżki PV vs bateria. Użyj, gdy user pyta, ile prądu i czasu zużyje " +
    "pompa ciepła na ciepłą wodę, czy grzać wodę pompą czy grzałką z nadwyżki PV albo do jakiej temperatury grzać pompą.",
  inputSchema: CwuPompaCieplaToolInput,
  outputSchema: CwuPompaCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/cwu-pompa-ciepla",
  handler: async (input) => {
    const wynik = calculateCwuPompaCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
