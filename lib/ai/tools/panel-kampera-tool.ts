/**
 * Narzędzie AI (9.3) dla Modułu 12 — Ekran 18 "Dobór panelu do kampera (elastyczny vs sztywny)".
 * `operationType: 'read'`. Dane paneli MUSZĄ pochodzić od usera z kart (Dyrektywa #1).
 */
import { z } from "zod"
import { calculatePanelKampera } from "@/lib/core/modules/kalkulator-mobilny/panel-kampera/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PanelKamperaToolInput = z.object({
  elastycznyMocW: z.number().describe("Panel elastyczny: moc [W]"),
  elastycznyMasaKg: z.number().describe("Panel elastyczny: masa [kg]"),
  elastycznyCenaZl: z.number().describe("Panel elastyczny: cena [zł]"),
  elastycznyGwarancjaLat: z.number().describe("Panel elastyczny: gwarancja mocy [lat] — z karty"),
  sztywnyMocW: z.number().describe("Panel sztywny: moc [W]"),
  sztywnyMasaKg: z.number().describe("Panel sztywny: masa [kg]"),
  sztywnyCenaZl: z.number().describe("Panel sztywny: cena [zł]"),
  sztywnyGwarancjaLat: z.number().describe("Panel sztywny: gwarancja mocy [lat] — z karty"),
  elastycznyBezSzczeliny: z.boolean().nullable().describe("Czy elastyczny będzie przyklejony płasko bez szczeliny; null = nie wiadomo"),
})
export type PanelKamperaToolInputT = z.infer<typeof PanelKamperaToolInput>

const Wariant = z.object({ wNaKg: z.number(), zlNaW: z.number(), zlNaWRok: z.number() })

export const PanelKamperaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  elastyczny: Wariant,
  sztywny: Wariant,
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PanelKamperaToolOutputT = z.infer<typeof PanelKamperaToolOutput>

export const panelKamperaTool: AiToolDefinition<PanelKamperaToolInputT, PanelKamperaToolOutputT> = {
  name: "porownaj_panel_elastyczny_i_sztywny_do_kampera",
  description:
    "Porównuje panel elastyczny i sztywny do kampera dla wpisanych modeli: moc na kilogram, cena za wat " +
    "i za wat-rok gwarancji; ostrzega przed elastycznym przyklejonym bez szczeliny wentylacyjnej. Użyj, " +
    "gdy user wybiera między panelem elastycznym a sztywnym na dach kampera, łodzi albo przyczepy.",
  inputSchema: PanelKamperaToolInput,
  outputSchema: PanelKamperaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/panel-kampera",
  handler: async (input) => {
    const wynik = calculatePanelKampera(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
