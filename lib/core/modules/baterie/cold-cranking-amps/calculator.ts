import type { CalcResult } from "@/lib/core/calc-result"
import type { ColdCrankingAmpsInput } from "./input"
import { validateInput } from "./validation"
import { falownikSieWylaczy, falownikUtrzymaNapiecie } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type ColdCrankingAmpsResult = {
  vSagV: number
  falownikWytrzyma: boolean
}

const FORMULA = "V_{sag} = V_{oc} - I_{rozruch} \\times R_{wewn}"

/**
 * Ekran 15, Moduł 4 — "Cold Cranking Amps" (dawne 3.17,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła.
 */
export function calculateColdCrankingAmps(input: ColdCrankingAmpsInput): CalcResult<ColdCrankingAmpsResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ColdCrankingAmpsResult = { vSagV: 0, falownikWytrzyma: false }
  const inputs = {
    napiecieOtwartegoObwoduV: input.napiecieOtwartegoObwoduV,
    pradRozruchowyA: input.pradRozruchowyA,
    rezystancjaWewnetrznaMOhm: input.rezystancjaWewnetrznaMOhm,
    minimalneNapiecieFalownikaV: input.minimalneNapiecieFalownikaV,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.napiecieOtwartegoObwoduV === 0 ||
    input.pradRozruchowyA === 0 ||
    input.rezystancjaWewnetrznaMOhm === 0 ||
    input.minimalneNapiecieFalownikaV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const rezystancjaOhm = input.rezystancjaWewnetrznaMOhm / 1000
  const vSagV = input.napiecieOtwartegoObwoduV - input.pradRozruchowyA * rezystancjaOhm
  const falownikWytrzyma = vSagV >= input.minimalneNapiecieFalownikaV

  const warnings = [
    falownikWytrzyma
      ? falownikUtrzymaNapiecie(vSagV, input.minimalneNapiecieFalownikaV)
      : falownikSieWylaczy(vSagV, input.minimalneNapiecieFalownikaV),
  ]

  return {
    value: { vSagV, falownikWytrzyma },
    unit: "V",
    status: "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Rezystancja wewnętrzna podana przez użytkownika jest już zmierzona w bieżącej temperaturze ogniw.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
