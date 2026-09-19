import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { UpsKrytycznyInput } from "./input"
import { validateInput } from "./validation"
import { czasPodtrzymaniaInfo } from "./warnings"
import { EFFICIENCY_DEFAULT } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/constants"

// 🔎 TD6 (dlug-techniczny.md): buduje TYLKO dobór sprzętowy (11.54). Zarządzanie priorytetami AI
// przy zbliżającym się rozładowaniu (12.54 — odcinanie obwodów wg kolejności ważności) NIE
// zbudowane — logika sterowania bez progu liczbowego podanego w źródle.
export const CALCULATOR_VERSION = "1.0.0"

export type UpsKrytycznyResult = {
  laczonyPoborW: number
  czasPodtrzymaniaH: number
}

const FORMULA =
  "P_{bazowe} = \\sum_{i \\in zaznaczone} P_i \\;\\; ; \\;\\; t = (C_{Ah} \\times V \\times \\eta) / P_{bazowe}"

/**
 * Ekran 6, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "UPS krytyczny — sprzęt i zarządzanie
 * AI" (scala dawne 11.54, 12.54, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md). Wzorzec
 * echo trybu "runtime" z `kalkulatory-pomocnicze` (M2/E16): `t=(C_Ah×V×η)/P`, tu zastosowany do
 * sumy poboru mocy urządzeń krytycznych zamiast pojedynczego odbiornika. Sprawność domyślna
 * (0,92) importowana z `kalkulatory-pomocnicze/constants.ts`, ta sama założona wartość robocza,
 * nie zduplikowana liczba.
 */
export function calculateUpsKrytyczny(input: UpsKrytycznyInput): CalcResult<UpsKrytycznyResult> {
  const { errors, warnings: walidacyjneOstrzezenia } = validateInput(input)
  const zaznaczone = input.urzadzenia.filter((u) => u.selected)
  const pustyWynik: UpsKrytycznyResult = { laczonyPoborW: 0, czasPodtrzymaniaH: 0 }
  const inputs = {
    ...Object.fromEntries(zaznaczone.map((u) => [u.id, u.powerW])),
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const laczonyPoborW = zaznaczone.reduce((sum, u) => sum + u.powerW, 0)
  const niekompletne =
    zaznaczone.length === 0 || laczonyPoborW === 0 || input.pojemnoscAh === 0 || input.napiecieV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "h",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: walidacyjneOstrzezenia,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const efficiency = input.efficiency ?? EFFICIENCY_DEFAULT
  const czasPodtrzymaniaH = (input.pojemnoscAh * input.napiecieV * efficiency) / laczonyPoborW

  const assumptions: Assumption[] =
    input.efficiency === undefined ? [{ kod: "SPRAWNOSC-DOMYSLNA", params: { efficiency } }] : []

  const warnings = [...walidacyjneOstrzezenia, czasPodtrzymaniaInfo(czasPodtrzymaniaH)]

  return {
    value: { laczonyPoborW, czasPodtrzymaniaH },
    unit: "h",
    status: "VALID",
    formula: FORMULA,
    inputs: { ...inputs, efficiency },
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
