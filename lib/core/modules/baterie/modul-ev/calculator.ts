import type { CalcResult } from "@/lib/core/calc-result"
import type { ModulEvInput } from "./input"
import { validateInput } from "./validation"
import { brakujeEnergii, pokryteWCalosci } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type ModulEvResult = {
  brakLatemKwh: number
  brakZimaKwh: number
  pokryteLatem: boolean
  pokryteZima: boolean
}

const FORMULA = "brak_{sezon} = \\max(0,\\; E_{EV} - nadwyżka_{PV,\\ sezon})"

/**
 * Ekran 4, Moduł 4 "Magazyn energii / baterie" — "Moduł EV — ładowanie samochodu elektrycznego"
 * (dawne 3.4, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Sprawdza, czy nadwyżka
 * produkcji PV (latem/zimą, wpisana ręcznie — docelowo z Modułu 3) pokrywa dobowe zapotrzebowanie
 * EV. Nie wyprowadza zapotrzebowania EV z przebiegu × zużycie/km — zużycie energii na km różni
 * się mocno między modelami i nie jest podane w źródle jako liczba uniwersalna.
 */
export function calculateModulEv(input: ModulEvInput): CalcResult<ModulEvResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ModulEvResult = {
    brakLatemKwh: 0,
    brakZimaKwh: 0,
    pokryteLatem: false,
    pokryteZima: false,
  }
  const inputs = {
    energiaDobowaEvKwh: input.energiaDobowaEvKwh,
    nadwyzkaPvLatemKwh: input.nadwyzkaPvLatemKwh ?? 0,
    nadwyzkaPvZimaKwh: input.nadwyzkaPvZimaKwh ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-MODUL-EV",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.energiaDobowaEvKwh === 0 || input.nadwyzkaPvLatemKwh === null || input.nadwyzkaPvZimaKwh === null) {
    return {
      value: pustyWynik,
      unit: "kWh/dobę",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-MODUL-EV",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const brakLatemKwh = Math.max(0, input.energiaDobowaEvKwh - input.nadwyzkaPvLatemKwh)
  const brakZimaKwh = Math.max(0, input.energiaDobowaEvKwh - input.nadwyzkaPvZimaKwh)
  const pokryteLatem = brakLatemKwh === 0
  const pokryteZima = brakZimaKwh === 0

  return {
    value: { brakLatemKwh, brakZimaKwh, pokryteLatem, pokryteZima },
    unit: "kWh/dobę",
    status: pokryteLatem && pokryteZima ? "VALID" : "VALID_WITH_WARNINGS",
    formula: FORMULA, formulaKey: "UI-FORMULA-BATERIE-MODUL-EV",
    inputs,
    assumptions: [],
    warnings: [
      pokryteLatem ? pokryteWCalosci("lato") : brakujeEnergii("lato", brakLatemKwh),
      pokryteZima ? pokryteWCalosci("zima") : brakujeEnergii("zima", brakZimaKwh),
    ],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
