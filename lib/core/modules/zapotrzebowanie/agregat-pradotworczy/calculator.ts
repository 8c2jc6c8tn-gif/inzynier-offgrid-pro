import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import type { AgregatPradotworczyInput } from "./input"
import { validateInput } from "./validation"
import { brakWyjsciaSterujacego, maWyjscieSterujace } from "./warnings"
import { OPTYMALNE_OBCIAZENIE_PCT } from "./constants"
import { maOdpowiedzBezpieczenstwa, ocenBezpieczenstwoAgregatu } from "./bezpieczenstwo"

export const CALCULATOR_VERSION = "1.1.1"

export type AgregatPradotworczyResult = {
  godzinyPracy: number
  zuzyciePaliwaLitry: number
  kosztZl: number
}

const FORMULA =
  `t_{h} = deficyt / (P_{agregat} \\times ${latexLiczba(OPTYMALNE_OBCIAZENIE_PCT / 100)}); \\ paliwo = t_{h} \\times zużycie_{l/h}; \\ koszt = paliwo \\times cena_{zł/l}`

/**
 * Ekran 17, Moduł 2 "Zapotrzebowanie energetyczne" — "Agregat prądotwórczy – definicja i logika
 * pracy" (Biblia, funkcja 1.19/2.19). Godziny pracy przy optymalnym obciążeniu (górna granica
 * zakresu 70-80% ze źródła — patrz `constants.ts`), zużycie paliwa i koszt — cały łańcuch
 * zweryfikowany niezależnie w Pythonie i odtwarza dokładnie własny przykład źródła (deficyt
 * 80 kWh, agregat 5 kW → 20 godzin, 25 l, 200 zł).
 * 1.1.0 (D48): generator safety block (CO, hot parts, fuel vapour, separate fuel store,
 * extinguisher, changeover switch) — shared with M7/E8. Safety answers alone still get their
 * warnings while the numbers are incomplete, so a hard stop is never hidden behind INCOMPLETE.
 */
export function calculateAgregatPradotworczy(
  input: AgregatPradotworczyInput,
): CalcResult<AgregatPradotworczyResult> {
  const { errors } = validateInput(input)
  const pustyWynik: AgregatPradotworczyResult = { godzinyPracy: 0, zuzyciePaliwaLitry: 0, kosztZl: 0 }
  const inputs = {
    deficytKwh: input.deficytKwh,
    mocAgregatuKw: input.mocAgregatuKw,
    sredniZuzycieLH: input.sredniZuzycieLH,
    cenaZaLitrZl: input.cenaZaLitrZl,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "zł",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (
    input.deficytKwh === 0 ||
    input.mocAgregatuKw === 0 ||
    input.sredniZuzycieLH === 0 ||
    input.cenaZaLitrZl === 0
  ) {
    return {
      value: pustyWynik,
      unit: "zł",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: maOdpowiedzBezpieczenstwa(input) ? ocenBezpieczenstwoAgregatu(input) : [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const mocEfektywnaKw = input.mocAgregatuKw * (OPTYMALNE_OBCIAZENIE_PCT / 100)
  const godzinyPracy = input.deficytKwh / mocEfektywnaKw
  const zuzyciePaliwaLitry = godzinyPracy * input.sredniZuzycieLH
  const kosztZl = zuzyciePaliwaLitry * input.cenaZaLitrZl

  const warnings = [
    input.maWyjscieSterujaceBms ? maWyjscieSterujace() : brakWyjsciaSterujacego(),
    ...ocenBezpieczenstwoAgregatu(input),
  ]

  return {
    value: { godzinyPracy, zuzyciePaliwaLitry, kosztZl },
    unit: "zł",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "OPTYMALNE-OBCIAZENIE-AGREGATU", params: { procent: OPTYMALNE_OBCIAZENIE_PCT } },
    ] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
