import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { OswietlenieAwaryjneInput } from "./input"
import { brakOswietleniaZewnetrznego, lampaNiesprawna, lampaNietestowana } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "gotowosc = \\forall\\ lampa:\\ stan = sprawna"

export type OswietlenieAwaryjneResult = {
  sprawne: number
  niesprawne: number
  nietestowane: number
}

/**
 * Ekran 7, Moduł 8 — "Oświetlenie awaryjne" (dawne 11.55; część AI 12.52 poza zakresem). 🔴 lampa niesprawna
 * (sekcja C: „awaria elementu na trasie ewakuacji musi być widoczna zanim będzie potrzebna”); lampa bez testu 🟡 —
 * jej sprawność jest nieznana (B.1: okresowe testy); brak oświetlenia zewnętrznego dla służb — info (B.1).
 */
export function calculateOswietlenieAwaryjne(input: OswietlenieAwaryjneInput): CalcResult<OswietlenieAwaryjneResult> {
  const value: OswietlenieAwaryjneResult = { sprawne: 0, niesprawne: 0, nietestowane: 0 }
  const inputs = { liczbaLamp: input.lampy.length, oswietlenieZewnetrzne: input.oswietlenieZewnetrzne ? 1 : 0 }
  const wynik = (status: Status, warnings: Warning[]): CalcResult<OswietlenieAwaryjneResult> => ({
    value,
    unit: "szt.",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (input.zasilanie === null || input.lampy.length === 0) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  input.lampy.forEach((lampa, i) => {
    const nazwa = lampa.nazwa.trim() || `#${i + 1}`
    if (lampa.stan === "sprawna") value.sprawne++
    else if (lampa.stan === "niesprawna") {
      value.niesprawne++
      warnings.push(lampaNiesprawna(nazwa, i))
    } else {
      value.nietestowane++
      warnings.push(lampaNietestowana(nazwa, i))
    }
  })
  if (!input.oswietlenieZewnetrzne) warnings.push(brakOswietleniaZewnetrznego())

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", warnings)
}
