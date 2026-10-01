import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import type { DoborBezpiecznikaRozlacznikaInput } from "./input"
import { validateInput } from "./validation"
import { aicPonizejPraduZwarciowego } from "./warnings"
import { WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA } from "./constants"

export const CALCULATOR_VERSION = "1.0.2"

export type DoborBezpiecznikaRozlacznikaResult = {
  pradBezpiecznikaZalecanyA: number
  /** null = AIC lub prąd zwarciowy jeszcze nie podane, sprawdzenie nie wykonane. */
  aicWystarczajace: boolean | null
}

const FORMULA = `I_{bezpiecznik} = ${latexLiczba(WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA)} \\times I`

/**
 * Margines doboru bezpieczników/rozłączników ogólnych obwodów instalacji względem prądu
 * znamionowego obwodu — reguła produktowa (Sekcja B, `Tresc_Modul_5_Okablowanie_Ekrany.md`),
 * niezależna od normy PV HD 60364-7-712.
 */
function obliczPradBezpiecznikaOgolnegoA(pradZnamionowyA: number): number {
  return WSPOLCZYNNIK_MARGINESU_BEZPIECZNIKA * pradZnamionowyA
}

/**
 * Ekran 6, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór bezpieczników i rozłączników"
 * (dawne 4.2, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md).
 *
 * Wcześniej wzorzec "echo" z Ekranu 22, Moduł 3 (`ochrona-stringow`, `obliczPradBezpiecznikaA`) —
 * ROZDZIELONE (2026-09-06, patrz docs/memory.md): norma HD 60364-7-712 pokazała, że dobór
 * bezpiecznika stringu PV (§712.431.102: przedział 1,1×Isc_max ≤ In ≤ I_MOD_MAX_OCPR z karty
 * katalogowej panelu) to zupełnie inna reguła niż ten ogólny margines 1,25× na prąd znamionowy
 * obwodu — współdzielona liczba 1,25 była przypadkowa, nie tym samym prawem fizycznym. Ten
 * ekran zachowuje dotychczasową, niezmienioną regułę produktową lokalnie (nie dotyczy go norma
 * PV) — zachowanie i testy bez zmian.
 *
 * Sprawdzenie koordynacji selektywności z Ekranem 13 (Selektywność zabezpieczeń) NIE zbudowane —
 * ten ekran jeszcze nie istnieje. Prąd zwarciowy docelowo z Ekranu 12 (Analiza zwarciowa),
 * dziś ręczny wpis — oba jawnie oznaczone w `assumptions`.
 */
export function calculateDoborBezpiecznikaRozlacznika(
  input: DoborBezpiecznikaRozlacznikaInput,
): CalcResult<DoborBezpiecznikaRozlacznikaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pradZnamionowyA: input.pradZnamionowyA,
    pradZwarciowyA: input.pradZwarciowyA,
    aicBezpiecznikaA: input.aicBezpiecznikaA,
  }
  const pustyWynik: DoborBezpiecznikaRozlacznikaResult = { pradBezpiecznikaZalecanyA: 0, aicWystarczajace: null }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pradZnamionowyA === 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradBezpiecznikaZalecanyA = obliczPradBezpiecznikaOgolnegoA(input.pradZnamionowyA)
  const sprawdzanoAic = input.aicBezpiecznikaA > 0 && input.pradZwarciowyA > 0
  const aicWystarczajace = sprawdzanoAic ? input.aicBezpiecznikaA >= input.pradZwarciowyA : null

  const warnings: Warning[] = []
  if (sprawdzanoAic && !aicWystarczajace) {
    warnings.push(aicPonizejPraduZwarciowego(input.aicBezpiecznikaA, input.pradZwarciowyA))
  }

  const assumptions: Assumption[] = [{ kod: "SELEKTYWNOSC-NIE-SPRAWDZONA" }]
  if (!sprawdzanoAic) {
    assumptions.push({ kod: "AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA" })
  }

  const value: DoborBezpiecznikaRozlacznikaResult = { pradBezpiecznikaZalecanyA, aicWystarczajace }

  return {
    value,
    unit: "A",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
