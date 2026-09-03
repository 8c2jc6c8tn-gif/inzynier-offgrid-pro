import type { CalcResult } from "@/lib/core/calc-result"
import type { StarzenieDegradacjaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type StarzenieDegradacjaResult = {
  pojemnoscPoczatkowaKwh: number
  ulamekPozostalyPoHoryzoncie: number
}

const FORMULA = "C_{poczatkowa} = \\dfrac{C_{uzyteczna\\_dzis}}{1 - r_{degradacji} \\times lata}"

/**
 * Ekran 6, Moduł 4 — "Starzenie i degradacja ogniw (bufor projektowy)" (dawne 3.6,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Prosty model liniowy 1:1 ze źródła —
 * "traci ok. 2-3% pojemności rocznie". Przykład źródła (Sekcja C: 45 kWh dziś -> 56 kWh za 10 lat)
 * odtwarza się dokładnie przy 2%/rok (dolna granica podanego zakresu), zweryfikowane niezależnie
 * w Pythonie przed implementacją.
 *
 * Świadomie NIE domyślony: źródło mówi "zamów akumulator o pojemności 60 kWh" (zaokrąglenie w
 * górę do dostępnego rozmiaru komercyjnego) — ten krok wymagałby wymyślenia siatki dostępnych
 * pojemności produktów, której źródło nie podaje. Kalkulator zwraca dokładną liczbę (56,25 kWh),
 * nie zaokrągloną do nieistniejącej normy.
 */
export function calculateStarzenieDegradacja(
  input: StarzenieDegradacjaInput,
): CalcResult<StarzenieDegradacjaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: StarzenieDegradacjaResult = { pojemnoscPoczatkowaKwh: 0, ulamekPozostalyPoHoryzoncie: 0 }
  const inputs = {
    pojemnoscUzytecznaDzisKwh: input.pojemnoscUzytecznaDzisKwh,
    horyzontLata: input.horyzontLata,
    degradacjaRocznaPct: input.degradacjaRocznaPct,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.pojemnoscUzytecznaDzisKwh === 0 || input.degradacjaRocznaPct === 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const ulamekPozostalyPoHoryzoncie = 1 - (input.degradacjaRocznaPct / 100) * input.horyzontLata
  const pojemnoscPoczatkowaKwh = input.pojemnoscUzytecznaDzisKwh / ulamekPozostalyPoHoryzoncie

  return {
    value: { pojemnoscPoczatkowaKwh, ulamekPozostalyPoHoryzoncie },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Prosty model liniowy degradacji (nie kalendarzowo-cykliczny), zgodnie z Sekcją B źródła.",
      "Wynik to dokładna wymagana pojemność początkowa — w praktyce zaokrągla się w górę do dostępnego rozmiaru komercyjnego (źródło nie podaje siatki rozmiarów).",
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
