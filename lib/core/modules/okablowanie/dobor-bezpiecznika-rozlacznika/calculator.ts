import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DoborBezpiecznikaRozlacznikaInput } from "./input"
import { validateInput } from "./validation"
import { aicPonizejPraduZwarciowego } from "./warnings"
import { obliczPradBezpiecznikaA } from "@/lib/core/modules/pv/ochrona-stringow/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type DoborBezpiecznikaRozlacznikaResult = {
  pradBezpiecznikaZalecanyA: number
  /** null = AIC lub prąd zwarciowy jeszcze nie podane, sprawdzenie nie wykonane. */
  aicWystarczajace: boolean | null
}

const FORMULA = "I_{bezpiecznik} = 1{,}25 \\times I"

/**
 * Ekran 6, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór bezpieczników i rozłączników"
 * (dawne 4.2, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec "echo": wzór
 * `I_bezpiecznik = 1,25 × I` jest tu tym samym wzorem co Ekran 22, Moduł 3
 * (`ochrona-stringow`, `obliczPradBezpiecznikaA`) — reużyty, nie zduplikowany, mimo że tam
 * prądem odniesienia jest Isc stringu, a tu prąd znamionowy obwodu.
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

  const pradBezpiecznikaZalecanyA = obliczPradBezpiecznikaA(input.pradZnamionowyA)
  const sprawdzanoAic = input.aicBezpiecznikaA > 0 && input.pradZwarciowyA > 0
  const aicWystarczajace = sprawdzanoAic ? input.aicBezpiecznikaA >= input.pradZwarciowyA : null

  const warnings: Warning[] = []
  if (sprawdzanoAic && !aicWystarczajace) {
    warnings.push(aicPonizejPraduZwarciowego(input.aicBezpiecznikaA, input.pradZwarciowyA))
  }

  const assumptions = [
    "Koordynacja selektywności z Ekranem 13 (Selektywność zabezpieczeń) nie sprawdzona — ten ekran jeszcze nie istnieje.",
  ]
  if (!sprawdzanoAic) {
    assumptions.push(
      "Zdolność łączeniowa (AIC) nie sprawdzona wobec prądu zwarciowego — wpisz oba pola, docelowo prąd zwarciowy z Ekranu 12 (Analiza zwarciowa).",
    )
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
