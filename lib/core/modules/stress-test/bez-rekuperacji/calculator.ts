import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { obliczStrumienCieplaPowietrzaW } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/calculator"
import type { BezRekuperacjiInput } from "./input"
import { ryzykoZamarzniecia, sprawnoscPozaZakresem, wartoscUjemna, wilgotnoscIPlesn } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\Delta P = \\frac{\\dot{V} \\eta \\rho c_p (T_w - T_z)}{3600},\\quad P_{nagrz} = \\frac{\\dot{V} \\rho c_p (T_{nagrz} - T_z)}{3600}"

export type BezRekuperacjiResult = {
  /** Dodatkowa strata ciepła, gdy wentylacja pracuje bez odzysku (bypass / zamarznięty wymiennik) [kW]. */
  dodatkowaStrataKw: number | null
  /** To samo na dobę [kWh]. */
  dodatkowaEnergiaKwhDoba: number | null
  /** Moc nagrzewnicy wstępnej, by podgrzać powietrze do temperatury wymaganej przez producenta [W]. */
  mocNagrzewnicyW: number | null
}

const PUSTY: BezRekuperacjiResult = { dodatkowaStrataKw: null, dodatkowaEnergiaKwhDoba: null, mocNagrzewnicyW: null }

/**
 * Ekran 20, Moduł 7 — "Bez wentylacji (Frozen Recuperation)" (dawne 6.30). Echo M6/E3: strata bez odzysku = ciepło,
 * które rekuperator odzyskiwał (`obliczStrumienCieplaPowietrzaW` z η), nagrzewnica wstępna = pełny strumień ciepła
 * od T_zewn do temperatury wymaganej przez producenta (η = 100%). 🟡 gdy T_zewn poniżej progu zamarzania z
 * instrukcji. Wilgotność/pleśń (sekcja B) — bez wzoru w źródle, tylko info.
 */
export function calculateBezRekuperacji(input: BezRekuperacjiInput): CalcResult<BezRekuperacjiResult> {
  const inputs: Record<string, number> = {
    strumienM3H: input.strumienM3H ?? 0,
    sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct ?? 0,
    tempWewnC: input.tempWewnC ?? 0,
    tempZewnC: input.tempZewnC ?? 0,
  }
  const wynik = (status: Status, value: BezRekuperacjiResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<BezRekuperacjiResult> => ({
    value,
    unit: "kW",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors: Warning[] = []
  if (input.strumienM3H !== null && input.strumienM3H < 0) errors.push(wartoscUjemna("strumienM3H", "Wydajność centrali", input.strumienM3H))
  const eta = input.sprawnoscOdzyskuPct
  if (eta !== null && (eta < 0 || eta > 100)) errors.push(sprawnoscPozaZakresem(eta))
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)

  const { strumienM3H: V, tempWewnC: Tw, tempZewnC: Tz } = input
  if (V === null || V <= 0 || eta === null || Tw === null || Tz === null) return wynik("INCOMPLETE", PUSTY, [])

  const deltaT = Math.max(0, Tw - Tz)
  const dodatkowaStrataKw = obliczStrumienCieplaPowietrzaW(V, deltaT, eta) / 1000
  const value: BezRekuperacjiResult = {
    dodatkowaStrataKw,
    dodatkowaEnergiaKwhDoba: dodatkowaStrataKw * 24,
    mocNagrzewnicyW: null,
  }
  if (input.tempZaNagrzewnicaC !== null && input.tempZaNagrzewnicaC > Tz) {
    value.mocNagrzewnicyW = obliczStrumienCieplaPowietrzaW(V, input.tempZaNagrzewnicaC - Tz)
  }

  const warnings: Warning[] = []
  const graniczna = input.tempZamarzaniaWymiennikaC
  if (graniczna !== null && Tz < graniczna) warnings.push(ryzykoZamarzniecia(Tz, graniczna))
  warnings.push(wilgotnoscIPlesn())

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, [
    { kod: "REKU-ZALOZENIE-STALE-POWIETRZA" },
  ])
}
