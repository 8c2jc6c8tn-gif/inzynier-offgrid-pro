import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { GniazdoZapalniczkiInput } from "./input"
import { validateInput } from "./validation"
import { przeciazenieGniazda } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "I = \\dfrac{\\sum P}{U_n} \\le I_{bezp} \\;\\; ; \\;\\; P_{max} = I_{bezp} \\times U_n"

export type GniazdoZapalniczkiResult = {
  /** Suma mocy urządzeń [W]. */
  sumaMocyW: number
  /** Prąd pobierany z gniazda [A]. */
  pradA: number
  /** Największa moc, jaką zniesie bezpiecznik gniazda [W]. */
  mocMaxW: number
  /** Obciążenie bezpiecznika [%]. */
  obciazeniePct: number
}

const PUSTY_WYNIK: GniazdoZapalniczkiResult = { sumaMocyW: 0, pradA: 0, mocMaxW: 0, obciazeniePct: 0 }

/**
 * Ekran 30, Moduł 12 — "Gniazda zapalniczki samochodowej i adaptery" (dawne 8.57). Prąd bezpiecznika
 * wpisuje użytkownik: źródło podaje tylko zakres „typowo 10–15 A” (Biblia: „zwykle 10 A przy 12 V =
 * 120 W”), a wartość zależy od pojazdu — Dyrektywa #1. 🔴 ze źródła: przeciążenie gniazda urządzeniem
 * o zbyt dużym poborze (ryzyko przepalenia bezpiecznika lub przewodów). Prąd liczony z napięcia
 * znamionowego — przy pracującym silniku (13,8–14,4 V) realny prąd jest nieco niższy, więc wynik jest
 * po stronie bezpiecznej.
 */
export function calculateGniazdoZapalniczki(input: GniazdoZapalniczkiInput): CalcResult<GniazdoZapalniczkiResult> {
  const { errors } = validateInput(input)
  const sumaMocyW = input.urzadzenia.reduce((s, u) => s + Math.max(0, u.mocW), 0)
  const inputs = { napiecieV: input.napiecieV, pradBezpiecznikaA: input.pradBezpiecznikaA, sumaMocyW }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.napiecieV === 0 || input.pradBezpiecznikaA === 0 || sumaMocyW === 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradA = sumaMocyW / input.napiecieV
  const mocMaxW = input.pradBezpiecznikaA * input.napiecieV
  const obciazeniePct = (pradA / input.pradBezpiecznikaA) * 100

  const warnings: Warning[] = []
  if (pradA > input.pradBezpiecznikaA) warnings.push(przeciazenieGniazda(pradA, input.pradBezpiecznikaA, mocMaxW))

  const assumptions: Assumption[] = [{ kod: "GZ-ZALOZENIE-NAPIECIE-ZNAMIONOWE" }, { kod: "GZ-ZALOZENIE-ROZRUCH" }]

  return {
    value: { sumaMocyW, pradA, mocMaxW, obciazeniePct },
    unit: "A",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
