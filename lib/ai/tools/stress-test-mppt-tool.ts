/**
 * Narzędzie AI (9.3) dla Ekranu 5, Moduł 3 "Instalacja PV" — "Zimowy stress-test napięciowy MPPT
 * (Voc max)". `operationType: 'read'`. Voc, β, Tmin, liczba paneli w stringu i limit MPPT MUSZĄ
 * pochodzić z karty katalogowej panelu/falownika i danych lokalizacji użytkownika — model nigdy
 * ich nie zgaduje. Jeden z najważniejszych twardych stopów w aplikacji (przekroczenie limitu MPPT
 * = gwarantowane uszkodzenie sprzętu).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateStressTestMppt } from "@/lib/core/modules/pv/stress-test-mppt/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const StressTestMpptToolInput = z.object({
  vocStcV: z.number().describe("Voc panelu w warunkach STC (25°C) [V], z karty katalogowej"),
  betaPctNaC: z.number().describe("Współczynnik temperaturowy Voc (β) [%/°C], ujemny, typowo -0,29 do -0,32"),
  tminC: z.number().describe("Minimalna temperatura w lokalizacji (Tmin) [°C] — dana usera, nie zgaduj"),
  liczbaPaneliWStringu: z.number().describe("Liczba paneli w stringu"),
  limitMpptV: z.number().describe("Maksymalne napięcie wejściowe MPPT/falownika [V], z karty katalogowej"),
})
export type StressTestMpptToolInputT = z.infer<typeof StressTestMpptToolInput>

export const StressTestMpptToolOutput = z.object({
  status: z.enum(STATUSY),
  vMaxV: z.number().describe("Voc panelu w najzimniejszych warunkach [V]"),
  vStringV: z.number().describe("Napięcie całego stringu w najzimniejszych warunkach [V]"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type StressTestMpptToolOutputT = z.infer<typeof StressTestMpptToolOutput>

export const stressTestMpptTool: AiToolDefinition<StressTestMpptToolInputT, StressTestMpptToolOutputT> = {
  name: "sprawdz_zimowy_stress_test_mppt",
  description:
    "Liczy napięcie stringu PV w najzimniejszych warunkach (Voc max przy Tmin) i porównuje z limitem MPPT " +
    "falownika (Moduł 3, Ekran 5) — przekroczenie limitu grozi trwałym uszkodzeniem falownika. Voc, β, Tmin, " +
    "liczbę paneli i limit MPPT podaje user z karty katalogowej i danych lokalizacji — nie zgaduj. Użyj, gdy " +
    "user pyta, ile paneli maksymalnie może dać w jednym stringu zimą albo czy przekroczy limit napięcia " +
    "falownika.",
  inputSchema: StressTestMpptToolInput,
  outputSchema: StressTestMpptToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "pv/stress-test-mppt",
  handler: async (input) => {
    const wynik = calculateStressTestMppt(input)
    return {
      status: wynik.status,
      vMaxV: wynik.value.vMaxV,
      vStringV: wynik.value.vStringV,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
