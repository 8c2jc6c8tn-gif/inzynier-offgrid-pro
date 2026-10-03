import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { POZYCJE_AUDYTU, type PozycjaAudytu } from "./constants"
import type { AudytZimowyInput, StanPozycji } from "./input"
import { validateInput } from "./validation"
import { brakujePaliwa, pozycjaNiegotowa } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "gotowosc = n_{gotowe} / (n_{wszystkie} - n_{nie\\ dotyczy});\\quad paliwo: zapas \\ge wymagany"

export type PozycjaWyniku = { id: PozycjaAudytu; stan: StanPozycji; zLiczb: boolean }

export type AudytZimowyResult = {
  pozycje: PozycjaWyniku[]
  gotowe: number
  /** Items that apply (all minus „nie dotyczy”). */
  liczbaPozycji: number
  /** Not ready (planned or missing), in checklist order. */
  braki: PozycjaAudytu[]
  /** Fuel missing [l]; null = numbers not entered. */
  brakPaliwaL: number | null
}

const PUSTY: AudytZimowyResult = { pozycje: [], gotowe: 0, liczbaPozycji: 0, braki: [], brakPaliwaL: null }

/**
 * Moduł 10, Ekran 12 — „Generalny audyt zimowy — RAPORT” (dawne 12.36). Wzorzec G: a report over the five checklist
 * items of the source, e.g. „Audyt zimowy 2026: 8/10 punktów gotowych. Braki: test webasto zaplanowany, ale nie
 * wykonany; zapas paliwa poniżej zalecanego minimum.” The fuel item is judged from the numbers when both are entered
 * (stock ≥ needed) — the „recommended minimum” has no number in the source, so the needed amount is the user's.
 * Not the Winter Safety Factor of Moduł 7 Ekran 12 (a weighted risk index, blocked on weights) — the source calls
 * them two different reports. No 🔴 here: the source names no hard stop for this report.
 */
export function calculateAudytZimowy(input: AudytZimowyInput): CalcResult<AudytZimowyResult> {
  const inputs: Record<string, number> = {
    zapasPaliwaL: input.zapasPaliwaL ?? Number.NaN,
    wymaganyZapasL: input.wymaganyZapasL ?? Number.NaN,
  }
  const baza = { unit: "", formula: FORMULA, formulaKey: "UI-FORMULA-AI-AUDYT-ZIMOWY", inputs, calculatorVersion: CALCULATOR_VERSION }
  const errors = validateInput(input)
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const paliwoZLiczb = input.zapasPaliwaL !== null && input.wymaganyZapasL !== null && input.pozycje["zapas-paliwa"] !== "nie-dotyczy"
  const pozycje: PozycjaWyniku[] = []
  for (const id of POZYCJE_AUDYTU) {
    if (id === "zapas-paliwa" && paliwoZLiczb) {
      pozycje.push({ id, stan: input.zapasPaliwaL! >= input.wymaganyZapasL! ? "gotowe" : "brak", zLiczb: true })
      continue
    }
    const stan = input.pozycje[id]
    if (!stan) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
    pozycje.push({ id, stan, zLiczb: false })
  }

  const dotyczy = pozycje.filter((p) => p.stan !== "nie-dotyczy")
  const braki = dotyczy.filter((p) => p.stan !== "gotowe").map((p) => p.id)
  const warnings: Warning[] = []
  let brakPaliwaL: number | null = null
  for (const id of braki) {
    if (id === "zapas-paliwa" && paliwoZLiczb) {
      brakPaliwaL = input.wymaganyZapasL! - input.zapasPaliwaL!
      warnings.push(brakujePaliwa(brakPaliwaL, input.zapasPaliwaL!, input.wymaganyZapasL!))
    } else warnings.push(pozycjaNiegotowa(id))
  }
  if (paliwoZLiczb && brakPaliwaL === null) brakPaliwaL = 0

  const assumptions: Assumption[] = [{ kod: "AZIM-ZAL-LISTA" }]
  return {
    ...baza,
    value: { pozycje, gotowe: dotyczy.length - braki.length, liczbaPozycji: dotyczy.length, braki, brakPaliwaL },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
