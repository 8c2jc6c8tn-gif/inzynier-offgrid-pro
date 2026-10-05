import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { AlbedoSniegInput } from "./input"
import { validateInput } from "./validation"
import { dachMaloAlbedo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type AlbedoSniegResult = {
  /** Extra production from the snow albedo: E · z / 100 [kWh]. */
  zyskKwh: number
  /** Production with the gain: E + zysk [kWh]. */
  produkcjaZZyskiemKwh: number
}

const PUSTY: AlbedoSniegResult = { zyskKwh: 0, produkcjaZZyskiemKwh: 0 }

const FORMULA = "E_{alb} = E \\cdot \\frac{z}{100};\\ E_{tot} = E + E_{alb}"

/**
 * Module 7 — Screen 9 „Analiza albedo i wydajność bifacjalna w śniegu” (dawne 6.10, 6.21).
 *
 * The source states the physics (snow reflects 70–90% of light; vertical/steep and bifacial panels gain the most, the
 * bifacial rear-side gain grows with mounting height and tilt) but no formula, and gives only example gains (+25%
 * vertical on a fence, +20% bifacial at 30 cm of snow, +30% bifacial vertical). So the gain is the user's own
 * percentage (D16), the examples are hints on the screen only, and the result is that percentage of the production
 * entered. The rooftop 🟡 is the source's sentence. Mounting height and tilt are not modelled (no formula in the
 * source). The bifacial model for other surfaces is M3/E16 `panele-bifacjalne`.
 */
export function calculateAlbedoSnieg(input: AlbedoSniegInput): CalcResult<AlbedoSniegResult> {
  const { errors } = validateInput(input)
  const inputs = {
    produkcjaOkresKwh: input.produkcjaOkresKwh,
    ...(input.zyskPct !== null ? { zyskPct: input.zyskPct } : {}),
  }
  const baza = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-ALBEDO-SNIEG", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.produkcjaOkresKwh === 0 || input.typMontazu === null || input.zyskPct === null) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zyskKwh = (input.produkcjaOkresKwh * input.zyskPct) / 100
  const warnings: Warning[] = input.typMontazu === "dach" ? [dachMaloAlbedo()] : []
  const assumptions: Assumption[] = [{ kod: "ALBS-ZAL-PROCENT-USERA" }, { kod: "ALBS-ZAL-OKRES-ZE-SNIEGIEM" }]

  return {
    ...baza,
    value: { zyskKwh, produkcjaZZyskiemKwh: input.produkcjaOkresKwh + zyskKwh },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
