import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PozycjonowanieOgniwInput } from "./input"
import { validateInput } from "./validation"
import { brakLuzuNaPeczenie, dociskOk, dociskZaDuzy, dociskZaMaly } from "./warnings"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PozycjonowanieOgniwResult = {
  dociskKgf: number
  wZakresie: boolean
  luzNaPeczenie: boolean
}

/**
 * Ekran 21, Moduł 4 "Magazyn energii / baterie" — "Pozycjonowanie ogniw (kompresja/spuchnięcie)"
 * (dawne 3.23, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Sprawdzenie docisku
 * względem zalecanego zakresu 300-400 kgf 1:1 ze źródła, plus potwierdzenie zostawionego luzu
 * na dylatację (ogniwa rosną 1-2% podczas ładowania).
 */
export function calculatePozycjonowanieOgniw(
  input: PozycjonowanieOgniwInput,
): CalcResult<PozycjonowanieOgniwResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PozycjonowanieOgniwResult = { dociskKgf: 0, wZakresie: false, luzNaPeczenie: false }
  const inputs = { dociskKgf: input.dociskKgf }

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

  const wZakresie = input.dociskKgf >= DOCISK_MIN_KGF && input.dociskKgf <= DOCISK_MAX_KGF

  const warnings: Warning[] = []
  if (input.dociskKgf < DOCISK_MIN_KGF) warnings.push(dociskZaMaly(input.dociskKgf))
  else if (input.dociskKgf > DOCISK_MAX_KGF) warnings.push(dociskZaDuzy(input.dociskKgf))
  if (!input.luzNaPeczenie) warnings.push(brakLuzuNaPeczenie())
  if (wZakresie && input.luzNaPeczenie) warnings.push(dociskOk(input.dociskKgf))

  const kompletne = wZakresie && input.luzNaPeczenie

  return {
    value: { dociskKgf: input.dociskKgf, wZakresie, luzNaPeczenie: input.luzNaPeczenie },
    unit: "kgf",
    status: kompletne ? "VALID" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
