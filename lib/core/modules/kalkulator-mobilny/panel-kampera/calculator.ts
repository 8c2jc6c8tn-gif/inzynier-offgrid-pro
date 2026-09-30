import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { PanelKamperaInput } from "./input"
import { validateInput } from "./validation"
import { elastycznyBezWentylacji, sprawdzTemperature } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "\\dfrac{P}{m}, \\quad \\dfrac{cena}{P}, \\quad \\dfrac{cena}{P \\times lata}"

export type WariantPanelu = {
  /** Moc na kilogram [W/kg]. */
  wNaKg: number
  /** Cena za wat [zł/W]. */
  zlNaW: number
  /** Cena za wat na rok gwarancji [zł/(W·rok)]. */
  zlNaWRok: number
}

export type PanelKamperaResult = { elastyczny: WariantPanelu; sztywny: WariantPanelu }

const PUSTY_WARIANT: WariantPanelu = { wNaKg: 0, zlNaW: 0, zlNaWRok: 0 }
const PUSTY_WYNIK: PanelKamperaResult = { elastyczny: PUSTY_WARIANT, sztywny: PUSTY_WARIANT }

const wariant = (moc: number, masa: number, cena: number, lata: number): WariantPanelu => ({
  wNaKg: moc / masa,
  zlNaW: cena / moc,
  zlNaWRok: cena / (moc * lata),
})

/**
 * Ekran 18, Moduł 12 — "Dobór panelu do kampera (elastyczny vs sztywny)" (dawne 8.38, Biblia §12.26).
 * Dla wpisanych modeli: moc na kilogram (masa na dachu), cena za wat i za wat-rok gwarancji (trwałość).
 * "Stracisz 10% mocy" ze źródła to przykład bez wzoru — stratę z nagrzewania liczy M3 `wplyw-temperatury`
 * ze współczynnika temperaturowego karty. Brak szczeliny wentylacyjnej pod elastycznym — 🟡 (Biblia).
 */
export function calculatePanelKampera(input: PanelKamperaInput): CalcResult<PanelKamperaResult> {
  const { errors } = validateInput(input)
  const { elastycznyBezSzczeliny, ...liczby } = input
  const baza = { unit: "zł/W", formula: FORMULA, inputs: liczby, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  if (Object.values(liczby).some((v) => v === 0) || elastycznyBezSzczeliny === null) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const warnings: Warning[] = []
  if (elastycznyBezSzczeliny) warnings.push(elastycznyBezWentylacji())
  warnings.push(sprawdzTemperature())

  return {
    ...baza,
    value: {
      elastyczny: wariant(input.elastycznyMocW, input.elastycznyMasaKg, input.elastycznyCenaZl, input.elastycznyGwarancjaLat),
      sztywny: wariant(input.sztywnyMocW, input.sztywnyMasaKg, input.sztywnyCenaZl, input.sztywnyGwarancjaLat),
    },
    status: elastycznyBezSzczeliny ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "PK-ZALOZENIE-GWARANCJA-TRWALOSC" }],
    warnings,
  }
}
