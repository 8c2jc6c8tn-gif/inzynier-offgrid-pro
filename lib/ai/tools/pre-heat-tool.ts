/**
 * Narzędzie AI (9.3) dla Modułu 7 "Stress-test zimowy" — Ekran 18 „Pre-Heat”. `operationType: 'read'`.
 * Dane wejściowe WYŁĄCZNIE od usera (karty urządzeń, Moduły 3/6); model nie zgaduje — null, gdy nieznane.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculatePreHeat } from "@/lib/core/modules/stress-test/pre-heat/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const n = (opis: string) => z.number().nullable().describe(opis)

export const PreHeatToolInput = z.object({
  pojemnoscCieplnaKwhK: n("Pojemność cieplna budynku [kWh/K] z M6"),
  podniesienieTempDomuK: n("O ile podnieść temperaturę w domu [K]"),
  stratyCieplaKw: n("Straty ciepła przy prognozowanym mrozie [kW]"),
  pojemnoscBojleraL: n("Pojemność bojlera [l]; null = bez bojlera"),
  podniesienieTempBojleraK: n("O ile podnieść temperaturę bojlera [K]"),
  cop: n("COP ogrzewania; 1 dla grzałki"),
  zrodloEnergii: z.enum(["pv-dzien", "bateria-noc", "agregat"]).nullable(),
  nadwyzkaPvKwh: n("Nadwyżka PV w dniu przed frontem [kWh]"),
})
export type PreHeatToolInputT = z.infer<typeof PreHeatToolInput>

export const PreHeatToolOutput = z.object({
  status: z.enum(STATUSY),
  cieploDomuKwh: z.number().nullable(),
  cieploBojleraKwh: z.number().nullable(),
  energiaElektrycznaKwh: z.number().nullable(),
  buforGodzin: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PreHeatToolOutputT = z.infer<typeof PreHeatToolOutput>

export const preHeatTool: AiToolDefinition<PreHeatToolInputT, PreHeatToolOutputT> = {
  name: "policz_przegrzanie_przed_mrozem",
  description: "Liczy, ile ciepła zmagazynuje przegrzanie domu i bojlera przed frontem mrozu, ile to kosztuje prądu i na ile godzin wystarczy; grzanie nocą z baterii to twardy stop (Moduł 7, Ekran 18). Użyj, gdy user pyta, czy i jak przegrzać dom i bojler przed nadchodzącym mrozem.",
  inputSchema: PreHeatToolInput,
  outputSchema: PreHeatToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "stress-test/pre-heat",
  handler: async (input) => {
    const wynik = calculatePreHeat(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
