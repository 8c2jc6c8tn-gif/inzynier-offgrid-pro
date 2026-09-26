import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { balastProjektowyEquKg, GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../eurokod-0/rownowaga"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"
import { balastProjektowyEqu } from "../zloty-srodek/warnings"
import type { NaporWiatruInput } from "./input"
import { validateInput } from "./validation"
import { balastNiewystarczajacy, predkoscMusiBycPorywem, silaNaporu } from "./warnings"
import { GESTOSC_POWIETRZA_KG_M3 } from "./constants"

// 🔎 TD9 (dlug-techniczny.md): siła naporu wiatru z przodu + balast projektowy EQU (PN-EN 1990, cała
// siła jako pionowa). Siła ssania od spodu osobno i moment wywracający NIE liczone — wymagają
// geometrii montażu nieobecnej w źródle.
export const CALCULATOR_VERSION = "1.1.0"

export type NaporWiatruResult = {
  silaNaporuN: number
  /** Design ballast against uplift, PN-EN 1990 EQU: m = γQ·F/(γG,inf·g) [kg]. */
  balastProjektowyKg: number
}

const FORMULA =
  "F_{napór} = 0{,}5 \\times \\rho \\times v^2 \\times A \\times C_d,\\quad " +
  "m = \\frac{\\gamma_Q F_{napór}}{\\gamma_{G,inf}\\, g}"

/**
 * Ekran 6, Moduł 3 "Instalacja PV" — "Aerodynamika — napór wiatru i ssanie" (dawne 2.12,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła — siła oporu
 * aerodynamicznego, ρ powietrza jako uniwersalna stała fizyczna.
 */
export function calculateNaporWiatru(input: NaporWiatruInput): CalcResult<NaporWiatruResult> {
  const { errors } = validateInput(input)
  const pustyWynik: NaporWiatruResult = { silaNaporuN: 0, balastProjektowyKg: 0 }
  const inputs: Record<string, number> = {
    predkoscWiatruMS: input.predkoscWiatruMS,
    powierzchniaM2: input.powierzchniaM2,
    cd: input.cd,
  }
  if (input.balastPlanowanyKg !== null) inputs.balastPlanowanyKg = input.balastPlanowanyKg

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

  const balastProjektowyKg = balastProjektowyEquKg(silaNaporuN, PRZYSPIESZENIE_ZIEMSKIE_M_S2)

  const warnings: Warning[] = [silaNaporu(silaNaporuN)]
  if (input.balastPlanowanyKg !== null && input.balastPlanowanyKg < balastProjektowyKg) {
    warnings.push(balastNiewystarczajacy(input.balastPlanowanyKg, balastProjektowyKg))
  }
  warnings.push(balastProjektowyEqu(), predkoscMusiBycPorywem())

  const assumptions: Assumption[] = [
    { kod: "TYLKO-SILA-NAPORU-NIE-SSANIE" },
    { kod: "ZS-ZALOZENIE-BALAST-PIONOWO", params: { g: PRZYSPIESZENIE_ZIEMSKIE_M_S2 } },
    { kod: "ZS-ZALOZENIE-BALAST-EQU", params: { gammaQ: GAMMA_Q_EQU, gammaG: GAMMA_G_INF_EQU } },
  ]

  return {
    value: { silaNaporuN, balastProjektowyKg },
    unit: "N",
    status: "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
