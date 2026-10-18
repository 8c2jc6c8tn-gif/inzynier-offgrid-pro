/**
 * Narzędzie AI (9.3) dla Modułu 12 "Szybki kalkulator/tryb mobilny" — "Dobór regulatora ładowania
 * PWM vs MPPT do małej instalacji". `operationType: 'read'`. Moc paneli, klasa napięciowa paneli i
 * napięcie systemowe akumulatora MUSZĄ pochodzić od usera (karta katalogowa / konfiguracja
 * instalacji) — model nigdy ich nie zgaduje.
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateReguRatorPwmMppt } from "@/lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const DoborRegulatoraPwmMpptToolInput = z.object({
  mocPaneliW: z.number().describe("Moc paneli [W] — od usera, nie zgaduj"),
  napiecieNominalnePaneluV: z
    .number()
    .describe("Klasa napięciowa paneli (12/24/36/48V, NIE Voc) [V] — od usera, z karty katalogowej"),
  napiecieAkumulatoraV: z.number().describe("Napięcie systemowe akumulatora (12/24/48V) [V] — od usera"),
})
export type DoborRegulatoraPwmMpptToolInputT = z.infer<typeof DoborRegulatoraPwmMpptToolInput>

export const DoborRegulatoraPwmMpptToolOutput = z.object({
  status: z.enum(STATUSY),
  regulator: z.enum(["PWM", "MPPT"]).describe("Rekomendowany typ regulatora"),
  niezgodnoscNapiec: z
    .boolean()
    .describe("true = klasa napięciowa paneli wyższa niż akumulatora — PWM fizycznie nie zadziała, MPPT wymagany"),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type DoborRegulatoraPwmMpptToolOutputT = z.infer<typeof DoborRegulatoraPwmMpptToolOutput>

export const doborRegulatoraPwmMpptTool: AiToolDefinition<
  DoborRegulatoraPwmMpptToolInputT,
  DoborRegulatoraPwmMpptToolOutputT
> = {
  name: "dobierz_regulator_pwm_mppt",
  description:
    "Dobiera typ regulatora ładowania (PWM vs MPPT) do małej instalacji (Moduł 12) na podstawie mocy paneli, " +
    "klasy napięciowej paneli i napięcia systemowego akumulatora. Gdy klasa napięciowa paneli jest wyższa niż " +
    "akumulatora, PWM fizycznie nie obniża napięcia — MPPT jest wtedy WYMAGANY, nie tylko zalecany. Przy " +
    "zgodnych napięciach MPPT jest opłacalny powyżej progu mocy (próg dopowiedziany ze środka zakresu źródła " +
    "200-300W). Użyj, gdy user pyta, czy do jego małej instalacji wystarczy tańszy PWM czy potrzebuje MPPT.",
  inputSchema: DoborRegulatoraPwmMpptToolInput,
  outputSchema: DoborRegulatoraPwmMpptToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "kalkulator-mobilny/dobor-regulatora-pwm-mppt",
  handler: async (input) => {
    const wynik = calculateReguRatorPwmMppt(input)
    return {
      status: wynik.status,
      regulator: wynik.value.regulator,
      niezgodnoscNapiec: wynik.value.niezgodnoscNapiec,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
