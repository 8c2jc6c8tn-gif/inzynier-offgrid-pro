import type { CalcResult } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie/bojler-cwu/constants"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { BasenInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const L_NA_M3 = 1000

const FORMULA = "Q = V c_w \\Delta T,\\quad t = Q / P,\\quad E = Q / COP"

export type BasenResult = {
  /** Heat to raise the water by the entered rise [kWh]. */
  cieploKwh: number
  /** Pump running time for it, losses not counted [h]. */
  czasH: number
  /** Electricity [kWh]; null = no COP. */
  pradKwh: number | null
  /** Heat to make up the overnight drop [kWh]; null = no drop entered. */
  cieploNocKwh: number | null
  /** Electricity for the overnight make-up [kWh]; null = no drop or no COP. */
  pradNocKwh: number | null
}

const PUSTY: BasenResult = { cieploKwh: 0, czasH: 0, pradKwh: null, cieploNocKwh: null, pradNocKwh: null }

/**
 * Moduł 6, Część 2C — basen (dawne 5.48, Biblia §6.27.22). Q = V·c_w·ΔT with the water heat capacity of M2
 * `bojler-cwu` (echo), t = Q/P, E = Q/COP. An electric heater would use E = Q (COP 1) — shown for the source's
 * comparison; solar collectors are not compared (no collector model in the source).
 *
 * Source example (Dyrektywa #5): „Pompa 8 kW podniesie temperaturę basenu 40 m³ o 1 °C w 5 godzin, zużywając 10 kWh”
 * — 40 m³ × 1,163 kWh/(m³·K) = 46,5 kWh → 5,8 h at 8 kW without losses (not 5 h); 10 kWh means COP 4,65.
 * „Basen bez przykrycia traci 3 °C na noc” is a measured drop, not a model — the user enters their own.
 */
export function calculateBasen(input: BasenInput): CalcResult<BasenResult> {
  const errors = [
    ...ujemneWartosci({
      objetoscM3: input.objetoscM3,
      przyrostK: input.przyrostK,
      mocPompyKw: input.mocPompyKw,
      spadekNocK: input.spadekNocK,
    }),
    ...copPonizejJednosci("cop", input.cop),
  ]
  const inputs = { ...input }
  const baza = { unit: "kWh", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.objetoscM3 === 0 || input.przyrostK === 0 || input.mocPompyKw === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const kwhNaK = input.objetoscM3 * L_NA_M3 * WSPOLCZYNNIK_KWH_NA_L_K
  const cieploKwh = kwhNaK * input.przyrostK
  const prad = (q: number) => (input.cop > 0 ? q / input.cop : null)
  const cieploNocKwh = input.spadekNocK > 0 ? kwhNaK * input.spadekNocK : null
  return {
    ...baza,
    value: {
      cieploKwh,
      czasH: cieploKwh / input.mocPompyKw,
      pradKwh: prad(cieploKwh),
      cieploNocKwh,
      pradNocKwh: cieploNocKwh === null ? null : prad(cieploNocKwh),
    },
    status: "VALID",
    assumptions: [{ kod: "BAS-ZAL-BEZ-STRAT" }],
    warnings: [],
  }
}
