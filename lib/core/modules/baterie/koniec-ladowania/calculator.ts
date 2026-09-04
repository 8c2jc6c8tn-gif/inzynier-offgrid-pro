import type { CalcResult } from "@/lib/core/calc-result"
import type { KoniecLadowaniaInput } from "./input"
import { validateInput } from "./validation"
import { fazaCc, fazaCvKoncowka, ladowanieZakonczone } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type FazaLadowania = "CC" | "CV-koncowka" | "zakonczone"

export type KoniecLadowaniaResult = {
  pradKoncowyA: number
  faza: FazaLadowania
}

const FORMULA = "I_{koncowy} = C_{prog} \\times C_{Ah}"

/**
 * Ekran 13, Moduł 4 "Magazyn energii / baterie" — "Algorytm końca ładowania (Tail Current /
 * Absorption)" (dawne 3.15, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Próg prądu
 * końcowego 1:1 ze źródła (`I_koncowy = próg_C × pojemność`), zweryfikowany niezależnie na
 * przykładzie źródła (280Ah × 0,05C = 14A, dokładnie jak w Sekcji C). Faza CC/CV/zakończone —
 * proste drzewo decyzyjne z tej samej Sekcji B.
 */
export function calculateKoniecLadowania(input: KoniecLadowaniaInput): CalcResult<KoniecLadowaniaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: KoniecLadowaniaResult = { pradKoncowyA: 0, faza: "CC" }
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieAbsorpcjiV: input.napiecieAbsorpcjiV,
    progKoncowyC: input.progKoncowyC,
    aktualnyPradA: input.aktualnyPradA ?? 0,
    aktualneNapiecieV: input.aktualneNapiecieV ?? 0,
  }

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

  if (
    input.pojemnoscAh === 0 ||
    input.napiecieAbsorpcjiV === 0 ||
    input.progKoncowyC === 0 ||
    input.aktualnyPradA === null ||
    input.aktualneNapiecieV === null
  ) {
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

  const pradKoncowyA = input.progKoncowyC * input.pojemnoscAh
  const aktualnyPradA = input.aktualnyPradA
  const aktualneNapiecieV = input.aktualneNapiecieV

  let faza: FazaLadowania
  if (aktualneNapiecieV < input.napiecieAbsorpcjiV) {
    faza = "CC"
  } else if (aktualnyPradA > pradKoncowyA) {
    faza = "CV-koncowka"
  } else {
    faza = "zakonczone"
  }

  const warning =
    faza === "CC" ? fazaCc(input.napiecieAbsorpcjiV) : faza === "CV-koncowka" ? fazaCvKoncowka(pradKoncowyA, aktualnyPradA) : ladowanieZakonczone(pradKoncowyA)

  return {
    value: { pradKoncowyA, faza },
    unit: "A",
    status: warning.level === "info" ? "VALID" : "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [warning],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
