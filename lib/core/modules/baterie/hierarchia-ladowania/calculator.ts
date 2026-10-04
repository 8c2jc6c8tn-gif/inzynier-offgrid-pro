import type { CalcResult } from "@/lib/core/calc-result"
import type { HierarchiaLadowaniaInput } from "./input"
import { validateInput } from "./validation"
import { brakDostepnegoZrodlaLadowania, oczekiwanieNaSlonce } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type ZrodloLadowania = "PV" | "AGREGAT" | "SIEC" | "BRAK"

export type HierarchiaLadowaniaResult = {
  zrodlo: ZrodloLadowania
  pozniejSocPonizejProgu: boolean
}

const FORMULA =
  "1)\\ PV\\ zawsze\\ pierwsze \\quad " +
  "2)\\ Agregat \\iff SoC < SoC_{prog} \\land \\lnot prognoza_{slonce} \\quad " +
  "3)\\ Siec \\iff taryfa_{tania}"

const PUSTY_WYNIK: HierarchiaLadowaniaResult = {
  zrodlo: "BRAK",
  pozniejSocPonizejProgu: false,
}

/**
 * Ekran 32, Moduł 4 — "Hierarchia ładowania (PV > Agregat > Sieć)" (dawne 3.36, Sekcja B).
 * Źródło opisuje logikę jako dyskretne drzewo decyzyjne, nie wzór liczbowy — zaimplementowane
 * 1:1 jako klasyfikator wg priorytetów z Sekcji B, nie wymuszony na sztuczny wzór matematyczny.
 * Brak w projekcie jednej kanonicznej wartości "SoC krytyczny" (sprawdzone grep-em) — pole
 * pozostaje czysto ręczne, bez ukrytego domyślnego wypełnienia (8.6).
 */
function wybierzZrodlo(input: HierarchiaLadowaniaInput): HierarchiaLadowaniaResult {
  const pozniejSocPonizejProgu = input.socAktualnyPct < input.socProguKrytycznegoPct

  if (input.produkcjaPvDostepnaTeraz) {
    return { zrodlo: "PV", pozniejSocPonizejProgu }
  }

  if (pozniejSocPonizejProgu && !input.prognozaSloncaJutro && input.agregatDostepny) {
    return { zrodlo: "AGREGAT", pozniejSocPonizejProgu }
  }

  if (input.taniaTaryfaNocna && input.siecDostepna) {
    return { zrodlo: "SIEC", pozniejSocPonizejProgu }
  }

  return { zrodlo: "BRAK", pozniejSocPonizejProgu }
}

export function calculateHierarchiaLadowania(
  input: HierarchiaLadowaniaInput,
): CalcResult<HierarchiaLadowaniaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    socAktualnyPct: input.socAktualnyPct,
    socProguKrytycznegoPct: input.socProguKrytycznegoPct,
  }

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-HIERARCHIA-LADOWANIA",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.socAktualnyPct === 0 && input.socProguKrytycznegoPct === 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-HIERARCHIA-LADOWANIA",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const value = wybierzZrodlo(input)

  const warnings =
    value.zrodlo === "BRAK" && value.pozniejSocPonizejProgu
      ? [
          input.prognozaSloncaJutro
            ? oczekiwanieNaSlonce(input.socAktualnyPct, input.socProguKrytycznegoPct)
            : brakDostepnegoZrodlaLadowania(input.socAktualnyPct, input.socProguKrytycznegoPct),
        ]
      : []

  return {
    value,
    unit: "",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-HIERARCHIA-LADOWANIA",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
