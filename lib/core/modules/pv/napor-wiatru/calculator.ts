import type { CalcResult } from "@/lib/core/calc-result"
import type { NaporWiatruInput } from "./input"
import { validateInput } from "./validation"
import { silaNaporu } from "./warnings"
import { GESTOSC_POWIETRZA_KG_M3 } from "./constants"

// 🔎 TD9 (dlug-techniczny.md): tylko siła naporu wiatru z przodu. Siła ssania od spodu, moment
// wywracający i wymagany balast NIE liczone — wymagają geometrii montażu nieobecnej w źródle.
export const CALCULATOR_VERSION = "1.0.0"

export type NaporWiatruResult = {
  silaNaporuN: number
}

const FORMULA = "F_{napór} = 0{,}5 \\times \\rho \\times v^2 \\times A \\times C_d"

/**
 * Ekran 6, Moduł 3 "Instalacja PV" — "Aerodynamika — napór wiatru i ssanie" (dawne 2.12,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła — siła oporu
 * aerodynamicznego, ρ powietrza jako uniwersalna stała fizyczna.
 */
export function calculateNaporWiatru(input: NaporWiatruInput): CalcResult<NaporWiatruResult> {
  const { errors } = validateInput(input)
  const pustyWynik: NaporWiatruResult = { silaNaporuN: 0 }
  const inputs = {
    predkoscWiatruMS: input.predkoscWiatruMS,
    powierzchniaM2: input.powierzchniaM2,
    cd: input.cd,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "N",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.predkoscWiatruMS === 0 || input.powierzchniaM2 === 0 || input.cd === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "N",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const silaNaporuN =
    0.5 * GESTOSC_POWIETRZA_KG_M3 * input.predkoscWiatruMS * input.predkoscWiatruMS * input.powierzchniaM2 * input.cd

  return {
    value: { silaNaporuN },
    unit: "N",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Tylko siła naporu (parcie na przód panelu) — siła ssania od spodu, moment wywracający i wymagany balast NIE liczone (wymagają geometrii montażu, której źródło nie podaje jako liczb).",
    ],
    warnings: [silaNaporu(silaNaporuN)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
