import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { WentylacjaOdzyskCieplaInput } from "./input"
import { validateInput } from "./validation"
import { odzyskInfo } from "./warnings"
import { GESTOSC_POWIETRZA_KG_M3, CIEPLO_WLASCIWE_POWIETRZA_J_KG_K } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WentylacjaOdzyskCieplaResult = {
  odzyskaneCieploKw: number
}

const FORMULA = "\\dot{Q}_{odzysk} = \\frac{\\dot{V} \\times \\eta \\times \\rho \\times c_p \\times \\Delta T}{3600}"

/**
 * Heat flow carried by an air stream: `V̇ × η × ρ × cp × ΔT / 3600` [W]. With η = 100% it is the full ventilation
 * heat flow. Extracted as an echo for M7/E20 (frozen recuperation: loss without recovery, pre-heater power).
 */
export function obliczStrumienCieplaPowietrzaW(strumienM3H: number, deltaTK: number, sprawnoscPct = 100): number {
  return (strumienM3H * (sprawnoscPct / 100) * GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K * deltaTK) / 3600
}

/**
 * Ekran 3, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "System wentylacji z odzyskiem
 * ciepła" (scala dawne 5.3, 5.23, 5.24, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B
 * punkt 1). Wzorzec echo `infiltracja-powietrza` (M6/E12) — ten sam wzór strumienia ciepła
 * powietrza, tu pomnożony przez sprawność rekuperatora zamiast liczony jako czysta strata.
 *
 * Przykład źródła (centrala 250 m³/h, sprawność 85%, −10°C → odzysk 2,1 kW) odtworzony
 * PRZYBLIŻONYM dopasowaniem przy ΔT=30K (20°C wewnątrz − (−10°C) na zewnątrz): wzór daje 2,14 kW,
 * zaokrąglone w źródle do 2,1 kW — mała rozbieżność zaokrąglenia, nie wzoru, zweryfikowana
 * niezależnie w Pythonie.
 */
export function calculateWentylacjaOdzyskCiepla(
  input: WentylacjaOdzyskCieplaInput,
): CalcResult<WentylacjaOdzyskCieplaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: WentylacjaOdzyskCieplaResult = { odzyskaneCieploKw: 0 }
  const inputs = {
    wydajnoscCentraliM3H: input.wydajnoscCentraliM3H,
    sprawnoscRekuperatoraPct: input.sprawnoscRekuperatoraPct,
    deltaTK: input.deltaTK ?? 0,
    poborWentylatorowW: input.poborWentylatorowW,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kW",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.wydajnoscCentraliM3H === 0 ||
    input.sprawnoscRekuperatoraPct === 0 ||
    input.deltaTK === null ||
    input.poborWentylatorowW === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "kW",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const deltaTK: number = input.deltaTK ?? 0
  const odzyskaneCieploW = obliczStrumienCieplaPowietrzaW(input.wydajnoscCentraliM3H, deltaTK, input.sprawnoscRekuperatoraPct)
  const odzyskaneCieploKw = odzyskaneCieploW / 1000

  const warnings = [odzyskInfo(odzyskaneCieploKw, input.poborWentylatorowW)]

  return {
    value: { odzyskaneCieploKw },
    unit: "kW",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      { kod: "STALE-FIZYCZNE-POWIETRZA-WENTYLACJA" },
      { kod: "POBOR-WENTYLATOROW-OSOBNO-BILANS" },
      { kod: "PROJEKT-STRUMIENI-BYPASS-NIE-LICZONE" },
    ] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
