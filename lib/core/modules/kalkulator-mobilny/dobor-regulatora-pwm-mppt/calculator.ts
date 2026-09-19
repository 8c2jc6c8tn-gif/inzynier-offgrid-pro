import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { ReguRatorPwmMpptInput } from "./input"
import { validateInput } from "./validation"
import { mpptOplacalnyPrzyMocy, niezgodnoscNapiecPwm, pwmWystarczy } from "./warnings"
import { PROG_MOC_MPPT_OPLACALNY_W } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type Regulator = "PWM" | "MPPT"

export type ReguRatorPwmMpptResult = {
  regulator: Regulator
  niezgodnoscNapiec: boolean
}

/**
 * Moduł 12 — "Dobór regulatora ładowania PWM vs MPPT do małej instalacji" (dawne 8.8/12.8,
 * docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md, linie 12578-12590). Dwie reguły
 * 1:1 ze źródła: (1) PWM fizycznie nie obniża napięcia panelu do akumulatora — jeśli klasa
 * napięciowa paneli jest wyższa niż napięcie akumulatora, MPPT jest wymagany, nie tylko
 * zalecany; (2) przy zgodnych napięciach MPPT jest "opłacalny" (nie wymagany) powyżej progu
 * mocy ze świadomie dopowiedzianego środka zakresu źródła (200-300W → 250W).
 */
export function calculateReguRatorPwmMppt(input: ReguRatorPwmMpptInput): CalcResult<ReguRatorPwmMpptResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ReguRatorPwmMpptResult = { regulator: "PWM", niezgodnoscNapiec: false }
  const inputs = {
    mocPaneliW: input.mocPaneliW,
    napiecieNominalnePaneluV: input.napiecieNominalnePaneluV,
    napiecieAkumulatoraV: input.napiecieAkumulatoraV,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.mocPaneliW === 0 || input.napiecieNominalnePaneluV === 0 || input.napiecieAkumulatoraV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niezgodnoscNapiec = input.napiecieNominalnePaneluV > input.napiecieAkumulatoraV

  if (niezgodnoscNapiec) {
    return {
      value: { regulator: "MPPT", niezgodnoscNapiec: true },
      unit: "",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs,
      assumptions: [{ kod: "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY" }] satisfies Assumption[],
      warnings: [niezgodnoscNapiecPwm(input.napiecieNominalnePaneluV, input.napiecieAkumulatoraV)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const regulator: Regulator = input.mocPaneliW >= PROG_MOC_MPPT_OPLACALNY_W ? "MPPT" : "PWM"

  return {
    value: { regulator, niezgodnoscNapiec: false },
    unit: "",
    status: "VALID",
    formula: "",
    inputs,
    assumptions: [{ kod: "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY" }] satisfies Assumption[],
    warnings: [regulator === "MPPT" ? mpptOplacalnyPrzyMocy(input.mocPaneliW) : pwmWystarczy(input.mocPaneliW)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
