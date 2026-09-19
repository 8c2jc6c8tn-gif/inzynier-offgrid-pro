import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { WylacznikiNadpradoweDcInput } from "./input"
import { validateInput } from "./validation"
import { aicPonizejPraduZwarciowego, dobranyPoprawnie, wylacznikNieCertyfikowanyDoDc } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type WylacznikiNadpradoweDcResult = Record<string, never>

/**
 * Ekran 14, Moduł 5 "Okablowanie i zabezpieczenia" — "Wyłączniki nadprądowe DC" (dawne 4.13,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Twardy stop 1:1 ze źródła: wyłącznik AC w
 * obwodzie DC (nie gasi łuku stałoprądowego). Zdolność wyłączania (AIC) sprawdzana wobec prądu
 * zwarciowego tym samym wzorcem opcjonalnego sprawdzenia co Ekran 6 (`dobor-bezpiecznika-rozlacznika`)
 * — 0 = pole niepodane, sprawdzenie pomijane, nie fałszywy pass.
 */
export function calculateWylacznikiNadpradoweDc(
  input: WylacznikiNadpradoweDcInput,
): CalcResult<WylacznikiNadpradoweDcResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    liczbaBiegunow: input.liczbaBiegunow,
    aicA: input.aicA,
    pradZwarciowyA: input.pradZwarciowyA,
  }

  if (errors.length > 0) {
    return {
      value: {},
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pradA === 0 || input.napiecieV === 0) {
    return {
      value: {},
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const warnings: Warning[] = []

  if (!input.certyfikowanyDoDc) {
    warnings.push(wylacznikNieCertyfikowanyDoDc())
  }

  const sprawdzanoAic = input.aicA > 0 && input.pradZwarciowyA > 0
  if (sprawdzanoAic && input.aicA < input.pradZwarciowyA) {
    warnings.push(aicPonizejPraduZwarciowego(input.aicA, input.pradZwarciowyA))
  }

  if (warnings.length === 0) {
    warnings.push(dobranyPoprawnie())
  }

  const assumptions: Assumption[] = []
  if (!sprawdzanoAic) {
    assumptions.push({ kod: "AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA" })
  }

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: {},
    unit: "",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
