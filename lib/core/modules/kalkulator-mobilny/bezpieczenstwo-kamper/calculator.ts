import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { CHECKLIST_ITEMS, ID_WENTYLACJI, type PozycjaChecklistyChemii } from "./constants"
import type { ChecklistaChemiiInput } from "./input"
import { brakWentylacjiOlowiowy, lifepo4Info } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

export type ChecklistaChemiiResult = {
  /** Pozycje dotyczące wybranej chemii. */
  pozycje: PozycjaChecklistyChemii[]
  potwierdzone: number
  razem: number
}

/**
 * Shared logic of a chemistry-dependent checklist (M12/E22, reused by M12/E36): only items for the chosen
 * chemistry count; an unconfirmed ventilation item with a lead-acid battery adds a warning (hydrogen) —
 * 🔴 for flooded, 🟡 for AGM (since 1.1.0).
 */
export function ocenChecklisteChemii(
  items: readonly PozycjaChecklistyChemii[],
  input: ChecklistaChemiiInput,
  kody: { brakWentylacji: string; lifepo4: string },
): CalcResult<ChecklistaChemiiResult> {
  if (input.chemia === null) {
    return {
      value: { pozycje: [], potwierdzone: 0, razem: 0 },
      unit: "pozycji potwierdzonych",
      status: "INCOMPLETE",
      formula: "",
      inputs: { potwierdzone: 0, razem: 0 },
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }
  const chemia = input.chemia
  const pozycje = items.filter((i) => i.chemie.includes(chemia))
  const ids = new Set(input.potwierdzoneIds)
  const potwierdzone = pozycje.filter((p) => ids.has(p.id)).length
  const razem = pozycje.length

  const warnings: Warning[] = []
  if (chemia === "LiFePO4") warnings.push(lifepo4Info(kody.lifepo4))
  else if (!ids.has(ID_WENTYLACJI)) warnings.push(brakWentylacjiOlowiowy(kody.brakWentylacji, chemia))

  return {
    value: { pozycje, potwierdzone, razem },
    unit: "pozycji potwierdzonych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}

/** Ekran 22, Moduł 12 — "Bezpieczeństwo w kamperze" (dawne 8.45). Wzorzec E. */
export function calculateBezpieczenstwoKamper(input: ChecklistaChemiiInput): CalcResult<ChecklistaChemiiResult> {
  return ocenChecklisteChemii(CHECKLIST_ITEMS, input, {
    brakWentylacji: "BK-OLOW-BEZ-WENTYLACJI",
    lifepo4: "BK-LIFEPO4-WEWNATRZ",
  })
}
