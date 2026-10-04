import type { CalcResult } from "@/lib/core/calc-result"
import type { UrzadzeniaZmienneInput } from "./input"
import { KATALOG_URZADZEN_ZMIENNYCH, MNOZNIK_KLASY } from "./constants"
import { validateInput } from "./validation"
import { brakZaznaczonych, sugerowanaWymianaStarych } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type UrzadzeniaZmienneResult = {
  energiaWh: number
  plytaIndukcyjnaEnergiaWh: number
}

const FORMULA = "E = \\sum_{i \\in zaznaczone} P_i \\times t_i \\times mnoznik_{klasy}(i)"

/**
 * Moduł 2 — Ekran 3 "Urządzenia zmienne + płyta indukcyjna + klasa energetyczna" (scala dawne
 * 1.3, 1.4, 1.5). Mnożnik wg klasy energetycznej 1:1 ze źródła (Sekcja B). Płyta indukcyjna
 * traktowana jako osobny rekord bez mnożnika klasy — źródło nie przypisuje jej klasy
 * energetycznej, tylko wysoki priorytet ze względu na obciążenie szczytowe.
 */
export function calculateUrzadzeniaZmienne(input: UrzadzeniaZmienneInput): CalcResult<UrzadzeniaZmienneResult> {
  const { errors } = validateInput(input)
  const pustyWynik: UrzadzeniaZmienneResult = { energiaWh: 0, plytaIndukcyjnaEnergiaWh: 0 }
  const wybrane = input.urzadzenia.filter((u) => u.wybrane)
  const inputs = Object.fromEntries(wybrane.map((u) => [u.id, u.mocW]))
  if (input.plytaIndukcyjnaWybrana) inputs.plytaIndukcyjnaMocW = input.plytaIndukcyjnaMocW

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "Wh",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-URZADZENIA-ZMIENNE",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (wybrane.length === 0 && !input.plytaIndukcyjnaWybrana) {
    return {
      value: pustyWynik,
      unit: "Wh",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-URZADZENIA-ZMIENNE",
      inputs,
      assumptions: [],
      warnings: [brakZaznaczonych()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const energiaWh = wybrane.reduce(
    (suma, u) => suma + (u.mocW * u.czasMin * MNOZNIK_KLASY[u.klasa]) / 60,
    0,
  )
  const plytaIndukcyjnaEnergiaWh = input.plytaIndukcyjnaWybrana
    ? (input.plytaIndukcyjnaMocW * input.plytaIndukcyjnaCzasMin) / 60
    : 0

  const staraKlasaLabels = wybrane
    .filter((u) => u.klasa === "stare")
    .map((u) => KATALOG_URZADZEN_ZMIENNYCH.find((d) => d.id === u.id)?.label ?? u.id)

  const warnings =
    staraKlasaLabels.length > 0 ? [sugerowanaWymianaStarych(staraKlasaLabels.join(", "))] : []

  return {
    value: { energiaWh, plytaIndukcyjnaEnergiaWh },
    unit: "Wh",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-URZADZENIA-ZMIENNE",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
