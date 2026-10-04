import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { AwaryjneZrodloCieplaInput } from "./input"
import { validateInput } from "./validation"
import { bezPlaszczaJednoPomieszczenie, niePokrywaZapotrzebowania, przypomnienieCzujnikCo } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E = P \\cdot t;\\; pokrycie = \\frac{P_w \\cdot t}{Q_d};\\; m = \\frac{P \\cdot t}{\\eta \\cdot W_o}"

export type AwaryjneZrodloCieplaResult = {
  /** Ciepło oddane przez urządzenie w dobie [kWh]. */
  cieploDobaKwh: number | null
  /** Ciepło przekazane do instalacji (płaszcz wodny) w dobie [kWh]. */
  cieploDoInstalacjiKwh: number | null
  /** Pokrycie dobowego zapotrzebowania przez płaszcz wodny [%]. null = brak płaszcza lub zapotrzebowania. */
  pokrycieProc: number | null
  /** Paliwo na dobę [kg]. null = brak sprawności lub wartości opałowej. */
  paliwoKgDoba: number | null
}

const PUSTY: AwaryjneZrodloCieplaResult = { cieploDobaKwh: null, cieploDoInstalacjiKwh: null, pokrycieProc: null, paliwoKgDoba: null }

/**
 * Ekran 1, Moduł 8 — "Awaryjne źródło ciepła" (dawne 6.19). Bilans energii (Biblia v2.0 §8.1, logika):
 * ciepło dobowe E = P·t; pokrycie zapotrzebowania tylko przez płaszcz wodny (bez niego ciepło zostaje w
 * jednym pomieszczeniu — alert Biblii); paliwo m = E / (η·W_o), bo P to moc cieplna oddana, a paliwo
 * dostarcza E/η. Przykład źródła (8 kW → 60% w mroźny dzień) nie podaje czasu palenia ani
 * zapotrzebowania — nieodtwarzalny liczbowo, test na danych spójnych z nim.
 */
export function calculateAwaryjneZrodloCiepla(input: AwaryjneZrodloCieplaInput): CalcResult<AwaryjneZrodloCieplaResult> {
  const inputs: Record<string, number> = {
    mocKw: input.mocKw ?? 0,
    mocDoWodyKw: input.mocDoWodyKw ?? 0,
    godzinyPaleniaNaDobe: input.godzinyPaleniaNaDobe ?? 0,
    zapotrzebowanieCieplaKwhDoba: input.zapotrzebowanieCieplaKwhDoba ?? 0,
    sprawnoscProc: input.sprawnoscProc ?? 0,
    wartoscOpalowaKwhKg: input.wartoscOpalowaKwhKg ?? 0,
  }
  const wynik = (
    status: Status,
    value: AwaryjneZrodloCieplaResult,
    warnings: Warning[],
    assumptions: Assumption[] = [],
  ): CalcResult<AwaryjneZrodloCieplaResult> => ({
    value,
    unit: "kWh",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-BEZPIECZENSTWO-AWARYJNE-ZRODLO-CIEPLA",
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)

  const P = input.mocKw
  const t = input.godzinyPaleniaNaDobe
  if (input.typZrodla === null || P === null || P <= 0 || t === null || t <= 0) return wynik("INCOMPLETE", PUSTY, [])

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "ZRODLO-ZALOZENIE-MOC-STALA" }]
  const value: AwaryjneZrodloCieplaResult = { ...PUSTY, cieploDobaKwh: P * t }

  if (input.plaszczWodny) {
    if (input.mocDoWodyKw !== null && input.mocDoWodyKw > 0) {
      value.cieploDoInstalacjiKwh = input.mocDoWodyKw * t
      const Qd = input.zapotrzebowanieCieplaKwhDoba
      if (Qd !== null && Qd > 0) {
        value.pokrycieProc = (value.cieploDoInstalacjiKwh / Qd) * 100
        if (value.pokrycieProc < 100) warnings.push(niePokrywaZapotrzebowania(value.pokrycieProc))
      }
    }
  } else {
    warnings.push(bezPlaszczaJednoPomieszczenie())
  }

  const eta = input.sprawnoscProc
  const Wo = input.wartoscOpalowaKwhKg
  if (eta !== null && Wo !== null && Wo > 0) {
    value.paliwoKgDoba = value.cieploDobaKwh! / ((eta / 100) * Wo)
    assumptions.push({ kod: "ZRODLO-ZALOZENIE-WARTOSC-OPALOWA" })
  }
  warnings.push(przypomnienieCzujnikCo())

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, assumptions)
}
