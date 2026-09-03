import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DoborBezpiecznikaInput } from "./input"
import { validateInput } from "./validation"
import { aicPonizejPraduZwarciowego, aicPonizejZalecanegoMinimum } from "./warnings"
import { MIN_AIC_LIFEPO4_A } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborBezpiecznikaResult = {
  pradZwarciowyA: number
}

const FORMULA = "I_{zw} = V / R_{wewn}"

/**
 * Ekran 24, Moduł 4 — "Dobór bezpiecznika DC (AIC/Class T/NH)" (dawne 3.27,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Bezpiecznik musi umieć ugasić pożar
 * elektryczny, a nie tylko się przepalić — źle dobrany pod względem AIC sam staje się
 * źródłem łuku elektrycznego.
 */
export function calculateDoborBezpiecznika(
  input: DoborBezpiecznikaInput,
): CalcResult<DoborBezpiecznikaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    napiecieBateriiV: input.napiecieBateriiV,
    rezystancjaWewnetrznaOhm: input.rezystancjaWewnetrznaOhm,
    aicBezpiecznikaA: input.aicBezpiecznikaA,
  }

  if (errors.length > 0) {
    return {
      value: { pradZwarciowyA: 0 },
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradZwarciowyA = input.napiecieBateriiV / input.rezystancjaWewnetrznaOhm
  const warnings: Warning[] = []

  if (input.aicBezpiecznikaA < pradZwarciowyA) {
    warnings.push(aicPonizejPraduZwarciowego(input.aicBezpiecznikaA, pradZwarciowyA))
  } else if (input.aicBezpiecznikaA < MIN_AIC_LIFEPO4_A) {
    warnings.push(aicPonizejZalecanegoMinimum(input.aicBezpiecznikaA))
  }

  return {
    value: { pradZwarciowyA },
    unit: "A",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Model prostego zwarcia pełnego (rezystancja przewodów i połączeń pominięta) — " +
        "rzeczywisty prąd zwarciowy w instalacji może być nieco niższy.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
