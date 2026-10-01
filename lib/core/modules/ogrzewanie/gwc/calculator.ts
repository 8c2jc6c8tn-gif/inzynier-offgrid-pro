import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { obliczStrumienCieplaPowietrzaW } from "../wentylacja-odzysk-ciepla/calculator"
import type { GwcInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\Phi_{GWC} = \\dot V \\rho c_p \\Delta T_{GWC},\\quad Q_{doba} = \\Phi_{GWC} (1 - \\eta_{rek}) \\cdot h,\\quad udział = \\dfrac{Q_{doba}}{Q_{zap}},\\quad E_{el} = \\dfrac{Q_{doba}}{COP}"

export type GwcResult = {
  /** Heat the ground adds to the air [W]. */
  mocCieplnaW: number
  /** Heat the building actually saves per day after heat recovery [kWh/day]. */
  oszczednoscDobaKwh: number
  /** Share of the daily heating demand [%]; null = no demand entered. */
  udzialPct: number | null
  /** Electricity saved per day [kWh/day]; null = no COP. */
  oszczednoscPraduKwh: number | null
}

const PUSTY: GwcResult = { mocCieplnaW: 0, oszczednoscDobaKwh: 0, udzialPct: null, oszczednoscPraduKwh: null }

/**
 * Ekran 4, Moduł 6 — "Gruntowy wymiennik ciepła (GWC)" (dawne 5.4, Biblia §6.4). The source gives no ground heat
 * exchange model (length, depth, soil → temperature rise), only the example, so the rise ΔT_GWC is entered and the
 * screen values it with the air heat flow of Screens 3/12 (`obliczStrumienCieplaPowietrzaW`). Behind a heat
 * recovery unit the GWC gain is worth only (1 − η) of the raw heat: the recuperator would have recovered the rest
 * from the exhaust air anyway (physics of a series pre-heater; ✅🤖 — the source does not mention recovery here).
 *
 * Source example „GWC 50 m podnosi temperaturę o 4 °C — zmniejsza zapotrzebowanie na ogrzewanie o 5%” gives no
 * air flow or demand, so it is not reproducible by itself; the test shows one consistent set (150 m³/h, 24 h,
 * no recovery → 4.82 kWh/day = 5% of 96.5 kWh/day). Summer cooling (Biblia „chłodzi latem”) is not computed.
 */
export function calculateGwc(input: GwcInput): CalcResult<GwcResult> {
  const { errors } = validateInput(input)
  const inputs = {
    strumienM3H: input.strumienM3H,
    przyrostTempK: input.przyrostTempK,
    godzinyPracyH: input.godzinyPracyH,
    sprawnoscRekuperatoraPct: input.sprawnoscRekuperatoraPct,
    zapotrzebowanieDobaKwh: input.zapotrzebowanieDobaKwh,
    cop: input.cop,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.strumienM3H === 0 || input.przyrostTempK === 0 || input.godzinyPracyH === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const mocCieplnaW = obliczStrumienCieplaPowietrzaW(input.strumienM3H, input.przyrostTempK)
  const oszczednoscDobaKwh = (mocCieplnaW * (1 - input.sprawnoscRekuperatoraPct / 100) * input.godzinyPracyH) / 1000
  const value: GwcResult = {
    mocCieplnaW,
    oszczednoscDobaKwh,
    udzialPct: input.zapotrzebowanieDobaKwh > 0 ? (oszczednoscDobaKwh / input.zapotrzebowanieDobaKwh) * 100 : null,
    oszczednoscPraduKwh: input.cop > 0 ? oszczednoscDobaKwh / input.cop : null,
  }
  const assumptions: Assumption[] = [{ kod: "GWC-ZALOZENIE-PRZYROST" }]
  if (input.sprawnoscRekuperatoraPct > 0) assumptions.push({ kod: "GWC-ZALOZENIE-REKUPERATOR" })
  return { ...baza, value, status: "VALID", assumptions, warnings: [] }
}
