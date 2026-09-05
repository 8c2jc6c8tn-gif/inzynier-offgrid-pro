import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { MontazMechanicznyInput } from "./input"
import { validateInput } from "./validation"
import { CHECKLIST_ITEMS } from "./constants"
import { dociskZaDuzy, dociskZaMaly } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/warnings"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "@/lib/core/modules/baterie/pozycjonowanie-ogniw/constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MontazMechanicznyResult = {
  dociskKgf: number
  dociskWZakresie: boolean
  potwierdzone: number
  razem: number
}

/**
 * Ekran A2, Moduł 11 — "Montaż mechaniczny + separacja ogniw" (dawne 9.2, 9.10). Wzorzec "echo":
 * próg docisku (300-400 kgf) i jego komunikaty reużyte z Modułu 4/Ekran 21
 * (pozycjonowanie-ogniw), nie zduplikowane — źródło wprost każe użyć tego samego progu
 * ("cross-ref Moduł 4, Ekran 21").
 */
export function calculateMontazMechaniczny(
  input: MontazMechanicznyInput,
): CalcResult<MontazMechanicznyResult> {
  const { errors } = validateInput(input)
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzone = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id))).size
  const razem = CHECKLIST_ITEMS.length
  const inputs = { dociskKgf: input.dociskKgf, potwierdzone, razem }
  const pustyWynik: MontazMechanicznyResult = { dociskKgf: 0, dociskWZakresie: false, potwierdzone, razem }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kgf",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.dociskKgf === 0) {
    return {
      value: pustyWynik,
      unit: "kgf",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const dociskWZakresie = input.dociskKgf >= DOCISK_MIN_KGF && input.dociskKgf <= DOCISK_MAX_KGF
  const warnings: Warning[] = []
  if (input.dociskKgf < DOCISK_MIN_KGF) warnings.push(dociskZaMaly(input.dociskKgf))
  else if (input.dociskKgf > DOCISK_MAX_KGF) warnings.push(dociskZaDuzy(input.dociskKgf))

  const value: MontazMechanicznyResult = { dociskKgf: input.dociskKgf, dociskWZakresie, potwierdzone, razem }

  if (warnings.length > 0) {
    return {
      value,
      unit: "kgf",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs,
      assumptions: [],
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const checklistPelny = potwierdzone === razem

  return {
    value,
    unit: "kgf",
    status: dociskWZakresie && checklistPelny ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
