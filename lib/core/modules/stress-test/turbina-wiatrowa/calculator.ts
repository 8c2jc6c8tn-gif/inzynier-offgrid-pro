import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { GODZIN_W_DOBIE, KROK_CALKOWANIA_MS } from "./constants"
import type { PunktKrzywejMocy, TurbinaWiatrowaInput } from "./input"
import { validateInput } from "./validation"
import { sredniaBezRozkladu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type TurbinaWiatrowaResult = {
  /** Energy per day: 24 · A · ∫P(v)f(v)dv [kWh/day]. */
  energiaDobaKwh: number
  /** Mean electrical power over time, with the availability factor: energy / 24 [kW]. */
  sredniaMocKw: number
  /** The integral ∫P(v)f(v)dv — mean power before the availability and loss factor [kW]. */
  calkaKw: number
}

const PUSTY: TurbinaWiatrowaResult = { energiaDobaKwh: 0, sredniaMocKw: 0, calkaKw: 0 }

const FORMULA =
  "E = 24 \\cdot A \\cdot \\int_0^{v_{off}} P(v) f(v)\\,dv;\\ f(v) = \\frac{\\pi}{2}\\frac{v}{\\bar{v}^2} e^{-\\pi v^2 / (4 \\bar{v}^2)}"

/** Power [kW] at speed v: 0 below the first point, linear between points, the last power up to the cut-out, 0 from it. */
export function mocPrzyPredkosci(krzywa: PunktKrzywejMocy[], v: number, wylaczenie: number): number {
  if (v >= wylaczenie || v < krzywa[0]!.predkoscMs) return 0
  const ostatni = krzywa[krzywa.length - 1]!
  if (v >= ostatni.predkoscMs) return ostatni.mocKw
  for (let i = 0; i < krzywa.length - 1; i++) {
    const a = krzywa[i]!
    const b = krzywa[i + 1]!
    if (v >= a.predkoscMs && v <= b.predkoscMs) return a.mocKw + ((v - a.predkoscMs) / (b.predkoscMs - a.predkoscMs)) * (b.mocKw - a.mocKw)
  }
  return 0
}

/** Rayleigh density of the wind speed with the mean `srednia`: f(v) = (π/2)(v/v̄²)·exp(−π v²/(4 v̄²)). */
export function gestoscRayleigha(v: number, srednia: number): number {
  return (Math.PI / 2) * (v / (srednia * srednia)) * Math.exp((-Math.PI * v * v) / (4 * srednia * srednia))
}

/**
 * Module 7 — Screen 16 „Turbina wiatrowa jako wsparcie zimowe” (dawne 6.24→7.23).
 *
 * The energy of a day is the integral of the power curve weighted by the Rayleigh wind-speed distribution, computed
 * with the midpoint rule with a step of at most 0.1 m/s from 0 to the cut-out speed. The curve, the cut-out speed and
 * the availability/loss factor come only from the user. The source example (1 kW at 6 m/s → 3 kWh/day) is not
 * reproduced — it states no curve — and is kept in the screen's description only.
 */
export function calculateTurbinaWiatrowa(input: TurbinaWiatrowaInput): CalcResult<TurbinaWiatrowaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    sredniaPredkoscMs: input.sredniaPredkoscMs,
    predkoscWylaczeniaMs: input.predkoscWylaczeniaMs,
    punktowKrzywej: input.krzywa.length,
    ...(input.wspolczynnikDostepnosciStrat !== null ? { wspolczynnikDostepnosciStrat: input.wspolczynnikDostepnosciStrat } : {}),
  }
  const baza = { unit: "kWh/dobę", formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-TURBINA-WIATROWA", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.sredniaPredkoscMs === 0 ||
    input.predkoscWylaczeniaMs === 0 ||
    input.krzywa.length < 3 ||
    input.wspolczynnikDostepnosciStrat === null
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const vOff = input.predkoscWylaczeniaMs
  const n = Math.max(1, Math.ceil(vOff / KROK_CALKOWANIA_MS - 1e-9))
  const h = vOff / n
  let calka = 0
  for (let i = 0; i < n; i++) {
    const v = (i + 0.5) * h
    calka += mocPrzyPredkosci(input.krzywa, v, vOff) * gestoscRayleigha(v, input.sredniaPredkoscMs) * h
  }
  const energia = GODZIN_W_DOBIE * input.wspolczynnikDostepnosciStrat * calka
  const assumptions: Assumption[] = [{ kod: "TURBW-ZALOZENIE-RAYLEIGH" }, { kod: "TURBW-ZALOZENIE-KRZYWA-PRODUCENTA" }]

  return {
    ...baza,
    value: { energiaDobaKwh: energia, sredniaMocKw: energia / GODZIN_W_DOBIE, calkaKw: calka },
    status: "VALID_WITH_WARNINGS",
    assumptions,
    warnings: [sredniaBezRozkladu(input.sredniaPredkoscMs)],
  }
}
