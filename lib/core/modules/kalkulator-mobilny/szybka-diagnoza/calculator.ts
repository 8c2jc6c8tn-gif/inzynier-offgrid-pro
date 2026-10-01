import type { CalcResult, Warning } from "@/lib/core/calc-result"
import { DRZEWO_DIAGNOZY, type KrokDiagnozy } from "./constants"
import type { SzybkaDiagnozaInput } from "./input"
import { bezpieczenstwoPomiarow, nieZnaleziono, odlaczZasilanie } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type SzybkaDiagnozaResult = {
  /** Kroki do pokazania: sprawdzone + bieżący (dalsze ukryte, dopóki nie dojdziesz). */
  kroki: KrokDiagnozy[]
  /** Krok do sprawdzenia teraz; null = diagnoza zakończona albo nie wybrano objawu. */
  aktualnyKrok: string | null
  /** Krok, na którym znaleziono przyczynę; null = jeszcze nie / nie znaleziono. */
  przyczyna: string | null
}

const PUSTY_WYNIK: SzybkaDiagnozaResult = { kroki: [], aktualnyKrok: null, przyczyna: null }

/**
 * Ekran 25, Moduł 12 — "Szybka diagnoza problemów" (dawne 8.50, Biblia §12.38). Przewodnik krok po kroku:
 * kroki objawu sprawdzane w kolejności od najczęstszej/najprostszej przyczyny; pierwszy krok z odpowiedzią
 * "problem" to przyczyna (kolejne nie są potrzebne). Spalenizna/stopiona izolacja przy przegrzewaniu → 🔴.
 * Wszystkie kroki "ok" → ℹ️ przyczyna poza prostym drzewem (elektryk).
 */
export function calculateSzybkaDiagnoza(input: SzybkaDiagnozaInput): CalcResult<SzybkaDiagnozaResult> {
  const baza = { unit: "", formula: "", inputs: {}, calculatorVersion: CALCULATOR_VERSION }
  if (input.objaw === null) return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const drzewo = DRZEWO_DIAGNOZY[input.objaw]
  const warnings: Warning[] = []
  const kroki: KrokDiagnozy[] = []
  let aktualnyKrok: string | null = null
  let przyczyna: string | null = null
  for (const krok of drzewo) {
    kroki.push(krok)
    const odp = input.odpowiedzi[krok.id]
    if (odp === "problem") {
      przyczyna = krok.id
      if (krok.odlaczNatychmiast) warnings.push(odlaczZasilanie(krok.id))
      break
    }
    if (odp === undefined) {
      aktualnyKrok = krok.id
      break
    }
  }
  warnings.push(bezpieczenstwoPomiarow())
  const zakonczona = aktualnyKrok === null
  if (zakonczona && przyczyna === null) warnings.push(nieZnaleziono())

  return {
    ...baza,
    value: { kroki, aktualnyKrok, przyczyna },
    status: !zakonczona ? "INCOMPLETE" : warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "DG-ZALOZENIE-KROKI-EKSPERCKIE" }],
    warnings,
  }
}
