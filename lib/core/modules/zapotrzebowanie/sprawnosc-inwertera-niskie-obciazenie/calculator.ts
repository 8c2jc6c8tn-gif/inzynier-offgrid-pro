import type { CalcResult } from "@/lib/core/calc-result"
import type { SprawnoscInwerteraInput } from "./input"
import { validateInput } from "./validation"
import { niskieObciazenie, obciazenieOptymalne } from "./warnings"
import {
  PROG_NISKIEGO_OBCIAZENIA_PCT,
  ZAKRES_OPTYMALNY_MAX_PCT,
  ZAKRES_OPTYMALNY_MIN_PCT,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type SprawnoscInwerteraResult = {
  realneZuzycieW: number
  obciazenieFalownikaPct: number
  strataPct: number
}

const FORMULA = "P_{realne} = \\dfrac{P_{zapotrzebowanie}}{\\eta}"

/**
 * Moduł 2 — Ekran 10 "Sprawność inwertera przy niskim obciążeniu" (dawne 1.13). Sprawność
 * WPISYWANA ręcznie przez użytkownika (z karty katalogowej/krzywej producenta) — źródło opisuje
 * krzywą tylko dwoma punktami narracyjnymi (max ~95% przy 40-80%, spadek do 70-80% przy <10%),
 * bez pełnego wzoru interpolacji, więc kalkulator nie zgaduje sprawności z obciążenia, tylko
 * liczy konsekwencję wpisanej sprawności (rzeczywiste zużycie, strata).
 *
 * **Znaleziona i udokumentowana niespójność przykładu źródła** (Sekcja C): "sprawność spada do
 * ok. 75%, więc realnie zużywasz o 25% więcej energii" — matematycznie niespójne (sprawność 75%
 * daje +33,3% zużycia, nie +25%; +25% odpowiadałoby sprawności 80%). Wzór wdrożony poprawnie
 * fizycznie (realne = zapotrzebowanie / sprawność), przykład źródła NIE odtworzony dosłownie —
 * ten sam rodzaj rozbieżności co w `dobor-pojemnosci`/Sekcja C (05,06.09.2026).
 */
export function calculateSprawnoscInwertera(input: SprawnoscInwerteraInput): CalcResult<SprawnoscInwerteraResult> {
  const { errors } = validateInput(input)
  const pustyWynik: SprawnoscInwerteraResult = { realneZuzycieW: 0, obciazenieFalownikaPct: 0, strataPct: 0 }
  const inputs = {
    zapotrzebowanieW: input.zapotrzebowanieW,
    mocFalownikaW: input.mocFalownikaW,
    sprawnoscPct: input.sprawnoscPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.zapotrzebowanieW === 0 || input.mocFalownikaW === 0 || input.sprawnoscPct === 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const sprawnosc = input.sprawnoscPct / 100
  const realneZuzycieW = input.zapotrzebowanieW / sprawnosc
  const obciazenieFalownikaPct = (input.zapotrzebowanieW / input.mocFalownikaW) * 100
  const strataPct = (realneZuzycieW / input.zapotrzebowanieW - 1) * 100

  const warnings =
    obciazenieFalownikaPct < PROG_NISKIEGO_OBCIAZENIA_PCT
      ? [niskieObciazenie(obciazenieFalownikaPct)]
      : obciazenieFalownikaPct >= ZAKRES_OPTYMALNY_MIN_PCT && obciazenieFalownikaPct <= ZAKRES_OPTYMALNY_MAX_PCT
        ? [obciazenieOptymalne(obciazenieFalownikaPct)]
        : []

  return {
    value: { realneZuzycieW, obciazenieFalownikaPct, strataPct },
    unit: "W",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
