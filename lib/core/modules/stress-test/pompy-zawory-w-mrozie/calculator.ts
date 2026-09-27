import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { PompyZaworyWMrozieInput, TypArmatury } from "./input"
import { brakMinTemp, elementPonizejMin, zaworZewnetrznyNieoprozniony } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "T_{min,miejsca} \\ge T_{min,pracy}"

export type OcenaElementu = {
  id: string
  nazwa: string
  typ: TypArmatury
  /** T miejsca − T min pracy [K]; null = brak danych z karty. Ujemny = poniżej zakresu pracy. */
  zapasK: number | null
}

export type PompyZaworyWMrozieResult = {
  oceny: OcenaElementu[]
  liczbaPonizejMin: number
}

/**
 * Ekran 21, Moduł 7 — "Wydajność pomp i zaworów w niskich temperaturach" (dawne 6.32). Porównanie
 * temperatury miejsca z minimalną temperaturą pracy z karty każdego elementu + przypomnienie o
 * opróżnieniu zaworu zewnętrznego. Źródło nie wpisuje tu twardego stopu — wszystko 🟡.
 * Spadek ciśnienia (sekcja B) nie jest liczony — źródło nie podaje zależności (Dyrektywa #1).
 */
export function calculatePompyZaworyWMrozie(input: PompyZaworyWMrozieInput): CalcResult<PompyZaworyWMrozieResult> {
  const inputs = {
    temperaturaMiejscaC: input.temperaturaMiejscaC ?? 0,
    liczbaElementow: input.elementy.length,
    maZaworZewnetrzny: input.maZaworZewnetrzny ? 1 : 0,
    zaworZewnetrznyOprozniony: input.zaworZewnetrznyOprozniony ? 1 : 0,
  }
  const warnings: Warning[] = []
  if (input.maZaworZewnetrzny && !input.zaworZewnetrznyOprozniony) warnings.push(zaworZewnetrznyNieoprozniony())

  const t = input.temperaturaMiejscaC
  const oceny: OcenaElementu[] =
    t === null
      ? []
      : input.elementy.map((e, i) => {
          const nazwa = e.nazwa.trim() === "" ? `element ${i + 1}` : e.nazwa.trim()
          if (e.minTempPracyC === null) {
            warnings.push(brakMinTemp(nazwa))
            return { id: e.id, nazwa, typ: e.typ, zapasK: null }
          }
          const zapasK = t - e.minTempPracyC
          if (zapasK < 0) warnings.push(elementPonizejMin(e.typ, nazwa, t, e.minTempPracyC))
          return { id: e.id, nazwa, typ: e.typ, zapasK }
        })

  const maOceny = oceny.length > 0
  if (!maOceny && !input.maZaworZewnetrzny) {
    return {
      value: { oceny: [], liczbaPonizejMin: 0 },
      unit: "K",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const assumptions: Assumption[] = maOceny ? [{ kod: "POMPY-ZALOZENIE-TEMP-MIEJSCA" }] : []

  return {
    value: { oceny, liczbaPonizejMin: oceny.filter((o) => o.zapasK !== null && o.zapasK < 0).length },
    unit: "K",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
