import type { CalcResult } from "@/lib/core/calc-result"
import type { OcenaZuzyciaInput } from "./input"
import { widoczneWybrzuszenie } from "./warnings"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type OcenaZuzyciaResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran A8, Moduł 11 — "Ocena zużycia ogniwa po demontażu" (dawne 9.16,
 * docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md). Puchnięcie obudowy wygrywa natychmiast,
 * niezależnie od tego, ile pomiarów z checklisty już wykonano.
 */
export function calculateOcenaZuzycia(input: OcenaZuzyciaInput): CalcResult<OcenaZuzyciaResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzone = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id))).size
  const razem = CHECKLIST_ITEMS.length
  const value = { potwierdzone, razem }

  if (input.widocznePuchniecie === true) {
    return {
      value,
      unit: "pomiarów wykonanych",
      status: "VALID_WITH_WARNINGS",
      formula: "",
      inputs: { potwierdzone, razem, widocznePuchniecie: 1 },
      assumptions: [],
      warnings: [widoczneWybrzuszenie()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.widocznePuchniecie === null) {
    return {
      value,
      unit: "pomiarów wykonanych",
      status: "INCOMPLETE",
      formula: "",
      inputs: { potwierdzone, razem },
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  return {
    value,
    unit: "pomiarów wykonanych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem, widocznePuchniecie: 0 },
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
