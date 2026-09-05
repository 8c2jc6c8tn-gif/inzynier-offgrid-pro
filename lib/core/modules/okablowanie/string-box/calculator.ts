import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { StringBoxInput } from "./input"
import { validateInput } from "./validation"
import { bezpiecznikPozaZakresem, brakSkrzynkiIp66, zaMaloWejsc } from "./warnings"
import { BEZPIECZNIK_STRINGOWY_MAX_A, BEZPIECZNIK_STRINGOWY_MIN_A } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type StringBoxResult = {
  /** null = liczba wejść jeszcze niepodana, sprawdzenie pominięte. */
  wejscWystarczajaco: boolean | null
  /** null = bezpiecznik stringowy jeszcze niewybrany, sprawdzenie pominięte. */
  bezpiecznikWZakresie: boolean | null
  maSkrzynkeIp66: boolean
}

/**
 * Ekran 22, Moduł 5 "Okablowanie i zabezpieczenia" — "String Box / Array Box" (dawne 4.28,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Twardy stop 1:1 ze źródła: łączenie stringów
 * bezpośrednio na wolnym powietrzu bez skrzynki IP66. SPD Typ 2 (cross-ref Ekran 2) i rozłącznik
 * izolacyjny DC (bez podanych parametrów w źródle) NIE liczone — jawnie w `assumptions`.
 */
export function calculateStringBox(input: StringBoxInput): CalcResult<StringBoxResult> {
  const { errors } = validateInput(input)
  const inputs = {
    liczbaStringow: input.liczbaStringow,
    liczbaWejscSkrzynki: input.liczbaWejscSkrzynki,
    bezpiecznikStringowyA: input.bezpiecznikStringowyA,
  }
  const pustyWynik: StringBoxResult = { wejscWystarczajaco: null, bezpiecznikWZakresie: null, maSkrzynkeIp66: false }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.liczbaStringow === 0) {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wejscSprawdzono = input.liczbaWejscSkrzynki > 0
  const wejscWystarczajaco = wejscSprawdzono ? input.liczbaWejscSkrzynki >= input.liczbaStringow : null

  const bezpiecznikSprawdzono = input.bezpiecznikStringowyA > 0
  const bezpiecznikWZakresie = bezpiecznikSprawdzono
    ? input.bezpiecznikStringowyA >= BEZPIECZNIK_STRINGOWY_MIN_A &&
      input.bezpiecznikStringowyA <= BEZPIECZNIK_STRINGOWY_MAX_A
    : null

  const warnings: Warning[] = []
  if (!input.maSkrzynkeIp66) warnings.push(brakSkrzynkiIp66())
  if (wejscSprawdzono && !wejscWystarczajaco) {
    warnings.push(zaMaloWejsc(input.liczbaWejscSkrzynki, input.liczbaStringow))
  }
  if (bezpiecznikSprawdzono && !bezpiecznikWZakresie) {
    warnings.push(bezpiecznikPozaZakresem(input.bezpiecznikStringowyA))
  }

  const assumptions = [
    "SPD Typ 2 (cross-ref Ekran 2) i rozłącznik izolacyjny DC nie sprawdzone — brak podanych parametrów w źródle.",
  ]
  if (!wejscSprawdzono) assumptions.push("Liczba wejść skrzynki niepodana — sprawdzenie pominięte.")
  if (!bezpiecznikSprawdzono) assumptions.push("Bezpiecznik stringowy niewybrany — sprawdzenie zakresu pominięte.")

  const value: StringBoxResult = {
    wejscWystarczajaco,
    bezpiecznikWZakresie,
    maSkrzynkeIp66: input.maSkrzynkeIp66,
  }

  return {
    value,
    unit: "",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
