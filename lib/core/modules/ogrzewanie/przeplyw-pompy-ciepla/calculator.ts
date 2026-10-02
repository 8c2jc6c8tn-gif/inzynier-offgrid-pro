import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie/bojler-cwu/constants"
import { przeplywWodyLH } from "../wspolne/hydraulika"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { PrzeplywPompyCieplaInput } from "./input"

export const CALCULATOR_VERSION = "1.1.0"

/** Source example range (Biblia §6.27.39): „optymalną różnicę temperatur (np. 5–7°C)” — info only, not a limit. */
export const DT_ZRODLO_K = { min: 5, max: 7 } as const

const L_NA_M3 = 1000
const MIN_NA_H = 60
const r2 = (x: number) => Math.round(x * 100) / 100

const FORMULA = "\\dot V = \\dfrac{P}{c_w \\Delta T},\\quad \\Delta T_{rz} = \\dfrac{P}{c_w \\dot V_{pompy}}"

export type PrzeplywPompyCieplaResult = {
  /** Required water flow [m³/h]. */
  wymaganyM3H: number
  /** The same in l/min. */
  wymaganyLMin: number
  /** ΔT the heat pump will really see at the circulation pump's flow [K]; null = pump flow not entered. */
  rzeczywistyDTK: number | null
}

const PUSTY: PrzeplywPompyCieplaResult = { wymaganyM3H: 0, wymaganyLMin: 0, rzeczywistyDTK: null }

function zaMalyPrzeplyw(pompa: number, wymagany: number, dT: number): Warning {
  return {
    code: "PRZ-PRZEPLYW-ZA-MALY",
    level: "critical",
    params: { pompa: r2(pompa), wymagany: r2(wymagany), dt: r2(dT) },
    technicalMessage: `przeplywPompyM3H ${pompa} < wymagany ${wymagany}`,
    field: "przeplywPompyM3H",
  }
}

function ponizejMinimum(przeplyw: number, min: number): Warning {
  return {
    code: "PRZ-PONIZEJ-MINIMUM",
    level: "critical",
    params: { przeplyw: r2(przeplyw), min: r2(min) },
    technicalMessage: `przepływ ${przeplyw} < minimum z karty ${min}`,
    field: "minPrzeplywM3H",
  }
}

function dtSpozaZrodla(dT: number): Warning {
  return {
    code: "PRZ-DT-SPOZA-ZRODLA",
    level: "info",
    params: { dt: dT, min: DT_ZRODLO_K.min, max: DT_ZRODLO_K.max },
    technicalMessage: `dTK = ${dT} poza przykładem źródła ${DT_ZRODLO_K.min}–${DT_ZRODLO_K.max} K`,
    field: "dTK",
  }
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 15: dobór przepływu przez pompę ciepła (dawne 5.65, Biblia §6.27.39). Required
 * flow V̇ = P / (c_w·ΔT) — the same formula as the 2D factor „przeplyw” 5.94 (`przeplywWodyLH`, Dyrektywa #8). The
 * circulation pump's flow at its operating point (read from its curve for the installation's resistance) is compared
 * with it: a smaller flow raises the real ΔT over the heat pump. 🔴 (owner decision D71, 02.10.2026; was 🟡) from the
 * source warning „Za mały przepływ to alarm pompy ciepła i ryzyko zamarznięcia” — risk of freezing the exchanger —
 * below the required flow, or below the datasheet minimum flow.
 *
 * Not computed (Dyrektywa #1): pump head from pipe resistance (the source names „długości rur, opory” but gives no
 * resistance model) and the upper limit „za wysoki (szumy, zużycie)” — no velocity limit in the source.
 *
 * Source example: „Wymagany przepływ to 1,2 m³/h” fits a 7 kW pump at ΔT 5 K (1,204 m³/h, test); „pompa 25/60 w trybie 3
 * zapewni go, zużywając 45 W” is the operating point of a concrete pump (its curve) — its energy is the Screen 15 result.
 */
export function calculatePrzeplywPompyCiepla(input: PrzeplywPompyCieplaInput): CalcResult<PrzeplywPompyCieplaResult> {
  const errors = ujemneWartosci({ ...input })
  const baza = { unit: "m³/h", formula: FORMULA, inputs: { ...input }, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.mocPompyKw === 0 || input.dTK === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const lH = przeplywWodyLH(input.mocPompyKw, input.dTK)
  const wymaganyM3H = lH / L_NA_M3
  const warnings: Warning[] = []
  if (input.dTK < DT_ZRODLO_K.min || input.dTK > DT_ZRODLO_K.max) warnings.push(dtSpozaZrodla(input.dTK))
  let rzeczywistyDTK: number | null = null
  const pompa = input.przeplywPompyM3H
  if (pompa > 0) {
    rzeczywistyDTK = input.mocPompyKw / (WSPOLCZYNNIK_KWH_NA_L_K * pompa * L_NA_M3)
    if (pompa < wymaganyM3H) warnings.push(zaMalyPrzeplyw(pompa, wymaganyM3H, rzeczywistyDTK))
  }
  const przeplyw = pompa > 0 ? pompa : wymaganyM3H
  if (input.minPrzeplywM3H > 0 && przeplyw < input.minPrzeplywM3H) warnings.push(ponizejMinimum(przeplyw, input.minPrzeplywM3H))

  const assumptions: Assumption[] = [{ kod: "PRZ-ZAL-BEZ-OPOROW" }]
  return {
    ...baza,
    value: { wymaganyM3H, wymaganyLMin: lH / MIN_NA_H, rzeczywistyDTK },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
