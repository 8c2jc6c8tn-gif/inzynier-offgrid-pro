import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { MikropeknieciaTermiczneInput } from "./input"
import { validateInput } from "./validation"
import { brakPodkladekEpdm, montazElastyczny, odstepZaMaly } from "./warnings"
import { ODSTEP_DYLATACYJNY_MIN_MM } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MikropeknieciaTermiczneResult = {
  /** Montaż sztywny = brak podkładek EPDM lub odstęp dylatacyjny poniżej minimum źródła. */
  montazSztywny: boolean
}

const FORMULA = `s_{dyl} \\ge ${ODSTEP_DYLATACYJNY_MIN_MM}\\,\\text{mm} \\;\\wedge\\; \\text{podkładki EPDM}`

/**
 * Ekran 7, Moduł 3 — "Mikropęknięcia termiczne" (dawne 2.13). Reguła progowa 1:1 ze źródła:
 * montaż jest elastyczny tylko wtedy, gdy są JEDNOCZEŚNIE podkładki EPDM i odstęp dylatacyjny
 * ≥ 5 mm ("system wymusza użycie podkładek EPDM i pozostawienie szczelin dylatacyjnych").
 * Poziom `warning`, nie `critical` — źródło nie zalicza tego do twardych stopów modułu
 * (podsumowanie `Tresc_Modul_3_PV_Ekrany.md`), skutek to degradacja w ~2 lata, nie natychmiastowa szkoda.
 */
export function calculateMikropeknieciaTermiczne(
  input: MikropeknieciaTermiczneInput,
): CalcResult<MikropeknieciaTermiczneResult> {
  const { errors } = validateInput(input)
  const inputs: Record<string, number> =
    input.odstepDylatacyjnyMm === null ? {} : { odstepDylatacyjnyMm: input.odstepDylatacyjnyMm }
  const pustyWynik: MikropeknieciaTermiczneResult = { montazSztywny: false }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.odstepDylatacyjnyMm === null) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const odstep = input.odstepDylatacyjnyMm
  const warnings: Warning[] = []
  if (odstep < ODSTEP_DYLATACYJNY_MIN_MM) warnings.push(odstepZaMaly(odstep))
  if (!input.podkladkiEpdm) warnings.push(brakPodkladekEpdm())
  const montazSztywny = warnings.length > 0
  if (!montazSztywny) warnings.push(montazElastyczny(odstep))

  return {
    value: { montazSztywny },
    unit: "",
    status: montazSztywny ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "MIKROPEKNIECIA-DANE-ZE-ZRODLA" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
