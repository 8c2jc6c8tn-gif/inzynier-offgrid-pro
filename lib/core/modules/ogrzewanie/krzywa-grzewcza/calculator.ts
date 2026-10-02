import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { COP_NA_STOPIEN_ZASILANIA } from "../wplyw-czynnika/constants"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { KrzywaGrzewczaInput } from "./input"
import { krzywaRosnie, ocenaPozaPunktami, punktyWTejSamejTemperaturze } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\theta_z(\\theta_e) = \\theta_{z1} + \\dfrac{\\theta_{z2} - \\theta_{z1}}{\\theta_{e2} - \\theta_{e1}}(\\theta_e - \\theta_{e1}),\\quad " +
  "COP' = COP (1 + k \\Delta\\theta_z),\\; k = 2\\text{–}3\\%/K,\\quad E = Q / COP"

export type KrzywaGrzewczaResult = {
  /** Slope of the current curve: supply-temperature change per 1 K of outdoor temperature [K/K], positive = normal. */
  nachylenie: number
  /** Current supply temperature at the reading temperature [°C]. */
  zasilanieC: number
  /** Proposed curve — null when not entered. */
  nachylenieNowe: number | null
  zasilanieNoweC: number | null
  /** Current minus proposed supply temperature at the reading temperature [K]; null = no proposal. */
  obnizenieK: number | null
  /** COP range after the change from the source's 2–3 %/°C rule; null = no COP or no proposal. */
  copNowyMin: number | null
  copNowyMax: number | null
  /** Electricity saved per season [kWh] at the two ends of the rule; null = no heat entered. */
  oszczednoscMinKwh: number | null
  oszczednoscMaxKwh: number | null
}

const PUSTY: KrzywaGrzewczaResult = {
  nachylenie: 0,
  zasilanieC: 0,
  nachylenieNowe: null,
  zasilanieNoweC: null,
  obnizenieK: null,
  copNowyMin: null,
  copNowyMax: null,
  oszczednoscMinKwh: null,
  oszczednoscMaxKwh: null,
}

/** Supply temperature of a straight curve through two points, read at `t`. */
function odczyt(t1: number, z1: number, t2: number, z2: number, t: number): number {
  return z1 + ((z2 - z1) / (t2 - t1)) * (t - t1)
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 5: krzywa grzewcza (dawne 5.71, Biblia §6.27.45). The source example gives the
 * curve as two points („przy 10°C zasilanie 28°C, przy –10°C 38°C”), so a curve is a straight line through two points
 * (✅🤖 — controllers set slope and parallel shift; real curves can bend slightly). The effect of a lower curve on COP
 * uses the source's own rule from 5.69 (Biblia §6.27.43: „obniżenie temperatury zasilania o 1°C zwykle zwiększa COP
 * o 2–3%”), the same constant as the 2D engine (`COP_NA_STOPIEN_ZASILANIA`, Dyrektywa #8); E = Q / COP as on Screen 5.
 *
 * Not computed (Dyrektywa #1): the "optimal" curve itself — it is the lowest curve at which the emitters still deliver the
 * load, which needs the emitter characteristic (PN-EN 442 exponent, PN-EN 1264 for floor heating — not in the repo). The
 * screen compares the user's current and proposed curves instead and says that the comfort check is the user's.
 *
 * Source example: 28 °C at 10 °C and 38 °C at −10 °C → slope 0,5 K/K, 33 °C at 0 °C (test). „Zła krzywa to 10%
 * niepotrzebnego zużycia” — no input behind it; with the 2–3 %/°C rule 10% less electricity means 1 + k·Δθ = 1/0,9, i.e. a curve about 3,7–5,6 K too high.
 */
export function calculateKrzywaGrzewcza(input: KrzywaGrzewczaInput): CalcResult<KrzywaGrzewczaResult> {
  const errors = [...ujemneWartosci({ cieploSezonKwh: input.cieploSezonKwh }), ...copPonizejJednosci("copObecny", input.copObecny)]
  if (input.tZewn1C !== null && input.tZewn1C === input.tZewn2C) errors.push(punktyWTejSamejTemperaturze(input.tZewn1C))
  const inputs: Record<string, number> = { copObecny: input.copObecny, cieploSezonKwh: input.cieploSezonKwh }
  for (const k of ["tZewn1C", "tZewn2C", "tZasil1C", "tZasil2C", "tZasilNowa1C", "tZasilNowa2C", "tOcenyC"] as const) {
    if (input[k] !== null) inputs[k] = input[k]
  }
  const baza = { unit: "°C", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const { tZewn1C: t1, tZewn2C: t2, tZasil1C: z1, tZasil2C: z2, tOcenyC: t } = input
  if (t1 === null || t2 === null || z1 === null || z2 === null || t === null) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "KRZ-ZAL-LINIOWO" }, { kod: "KRZ-ZAL-BEZ-GRZEJNIKOW" }]
  const nachylenie = (z1 - z2) / (t2 - t1)
  if (nachylenie < 0) warnings.push(krzywaRosnie("tZasil2C"))
  if (t < Math.min(t1, t2) || t > Math.max(t1, t2)) warnings.push(ocenaPozaPunktami())
  const value: KrzywaGrzewczaResult = { ...PUSTY, nachylenie, zasilanieC: odczyt(t1, z1, t2, z2, t) }

  const n1 = input.tZasilNowa1C
  const n2 = input.tZasilNowa2C
  if (n1 !== null && n2 !== null) {
    value.nachylenieNowe = (n1 - n2) / (t2 - t1)
    if (value.nachylenieNowe < 0) warnings.push(krzywaRosnie("tZasilNowa2C"))
    value.zasilanieNoweC = odczyt(t1, n1, t2, n2, t)
    const dT = value.zasilanieC - value.zasilanieNoweC
    value.obnizenieK = dT
    if (input.copObecny > 0) {
      const { min, max } = COP_NA_STOPIEN_ZASILANIA
      value.copNowyMin = input.copObecny * (1 + min * dT)
      value.copNowyMax = input.copObecny * (1 + max * dT)
      assumptions.push({ kod: "KRZ-ZAL-COP-REGULA", params: { min: min * 100, max: max * 100 } })
      const q = input.cieploSezonKwh
      if (q > 0 && value.copNowyMin > 0 && value.copNowyMax > 0) {
        value.oszczednoscMinKwh = q / input.copObecny - q / value.copNowyMin
        value.oszczednoscMaxKwh = q / input.copObecny - q / value.copNowyMax
      }
    }
  }

  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
