/**
 * Narzędzie AI (9.3) dla Modułu 6 — Ekran 18 "Grzałki elektryczne do C.W.U." (dawne 5.22, Biblia §6.22).
 * `operationType: 'read'`. Moce grzałki, nadwyżki PV i falownika MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateGrzalkaCwu } from "@/lib/core/modules/ogrzewanie/grzalka-cwu/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const GrzalkaCwuToolInput = z.object({
  pojemnoscL: z.number().describe("Pojemność zasobnika [l]"),
  tStartC: z.number().describe("Temperatura wody na starcie [°C]"),
  tKoniecC: z.number().describe("Temperatura docelowa [°C]"),
  mocGrzalkiKw: z.number().describe("Moc grzałki [kW]"),
  mocPvKw: z.number().describe("Nadwyżka PV w czasie grzania [kW]; 0 = nie liczymy udziału PV"),
  sterowanie: z.enum(["stala", "regulator-pv"]).nullable().describe("stala = pełna moc z termostatu; regulator-pv = moc dopasowana do nadwyżki; null bez PV"),
  mocFalownikaKw: z.number().describe("Moc ciągła falownika [kW]; 0 = bez sprawdzenia"),
})
export type GrzalkaCwuToolInputT = z.infer<typeof GrzalkaCwuToolInput>

export const GrzalkaCwuToolOutput = z.object({
  status: z.enum(STATUSY),
  cieploKwh: z.number(),
  czasH: z.number(),
  energiaZPvKwh: z.number().nullable(),
  energiaZBateriiKwh: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type GrzalkaCwuToolOutputT = z.infer<typeof GrzalkaCwuToolOutput>

export const grzalkaCwuTool: AiToolDefinition<GrzalkaCwuToolInputT, GrzalkaCwuToolOutputT> = {
  name: "policz_grzalke_cwu",
  description:
    "Grzałka elektryczna w zasobniku C.W.U.: energia Q = V·ΔT·c i czas grzania t = Q/P, udział nadwyżki PV i baterii " +
    "(stała moc vs regulator nadwyżki PV) oraz sprawdzenie mocy falownika. Użyj, gdy user pyta, jak długo grzałka " +
    "zagrzeje bojler, ile prądu zużyje, czy da się grzać wodę z nadwyżki słońca albo czy falownik udźwignie grzałkę.",
  inputSchema: GrzalkaCwuToolInput,
  outputSchema: GrzalkaCwuToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/grzalka-cwu",
  handler: async (input) => {
    const wynik = calculateGrzalkaCwu(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
