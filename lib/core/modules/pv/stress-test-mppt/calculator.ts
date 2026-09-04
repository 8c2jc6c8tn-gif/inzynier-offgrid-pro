import type { CalcResult } from "@/lib/core/calc-result"
import type { StressTestMpptInput } from "./input"
import { validateInput } from "./validation"
import { bezpiecznyMargines, bliskoLimituMppt, przekroczonyLimitMppt } from "./warnings"
import { PROG_OSTRZEGAWCZY_UDZIAL_LIMITU, TEMPERATURA_REFERENCYJNA_STC_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type StressTestMpptResult = {
  vMaxV: number
  vStringV: number
}

const FORMULA =
  "V_{max} = V_{oc} \\times (1 + \\beta \\times (T_{min} - 25)) \\;\\; ; \\;\\; V_{string} = V_{max} \\times n_{paneli}"

/**
 * Napięcie stringu w najzimniejszych warunkach — wzorzec echo, reużywane m.in. przez
 * `dopasowanie-tablicy-falownika` (Ekran 14) zamiast duplikowania tego samego wzoru.
 */
export function obliczNapiecieStringuZimowego(
  vocStcV: number,
  betaPctNaC: number,
  tminC: number,
  liczbaPaneliWStringu: number,
): number {
  const beta = betaPctNaC / 100
  const vMaxV = vocStcV * (1 + beta * (tminC - TEMPERATURA_REFERENCYJNA_STC_C))
  return vMaxV * liczbaPaneliWStringu
}

/**
 * Ekran 5, Moduł 3 "Instalacja PV" — "Zimowy stress-test napięciowy MPPT (Voc max)" (dawne 2.11,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła. Przykład źródła (Voc
 * 56,5V, β=-0,3%/°C, Tmin=-25°C, 8 paneli → 520V, limit 450V → 🔴) odtworzony dokładnie,
 * zweryfikowany niezależnie w Pythonie przed implementacją. Progi werdyktu (>limit → 🔴,
 * >95%×limit → 🟡, inaczej 🟢) 1:1 ze źródła.
 */
export function calculateStressTestMppt(input: StressTestMpptInput): CalcResult<StressTestMpptResult> {
  const { errors } = validateInput(input)
  const pustyWynik: StressTestMpptResult = { vMaxV: 0, vStringV: 0 }
  const inputs = {
    vocStcV: input.vocStcV,
    betaPctNaC: input.betaPctNaC,
    tminC: input.tminC ?? 0,
    liczbaPaneliWStringu: input.liczbaPaneliWStringu,
    limitMpptV: input.limitMpptV,
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
    input.vocStcV === 0 ||
    input.betaPctNaC === 0 ||
    input.tminC === null ||
    input.liczbaPaneliWStringu === 0 ||
    input.limitMpptV === 0

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

  const tminC: number = input.tminC ?? 0
  const vStringV = obliczNapiecieStringuZimowego(
    input.vocStcV,
    input.betaPctNaC,
    tminC,
    input.liczbaPaneliWStringu,
  )
  const vMaxV = vStringV / input.liczbaPaneliWStringu
  const progOstrzegawczyV = PROG_OSTRZEGAWCZY_UDZIAL_LIMITU * input.limitMpptV

  const warnings =
    vStringV > input.limitMpptV
      ? [przekroczonyLimitMppt(vStringV, input.limitMpptV)]
      : vStringV > progOstrzegawczyV
        ? [bliskoLimituMppt(vStringV, input.limitMpptV, progOstrzegawczyV)]
        : [bezpiecznyMargines(vStringV, input.limitMpptV)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { vMaxV, vStringV },
    unit: "V",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
