import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczStrumienCieplaPowietrzaW } from "../wentylacja-odzysk-ciepla/calculator"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { GwcPompaCieplaInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\Delta T_{par} = \\Delta T_{GWC} \\min\\!\\left(1, \\dfrac{\\dot V_{GWC}}{\\dot V_{par}}\\right), \\quad " +
  "\\Phi_{GWC} = \\min(\\dot V_{GWC}, \\dot V_{par}) \\rho c_p \\Delta T_{GWC}, \\quad P_{dolne} = P \\left(1 - \\dfrac{1}{COP}\\right), \\quad " +
  "\\Delta E = Q \\left(\\dfrac{1}{COP_{bez}} - \\dfrac{1}{COP_{z}}\\right)"

export type GwcPompaCieplaResult = {
  /** Wzrost temperatury powietrza na wlocie parownika [K]. */
  wzrostTempParownikaK: number
  /** Ciepło, które GWC dodaje do powietrza parownika [kW]. */
  mocGwcKw: number
  /** Moc pobierana przez pompę z dolnego źródła = P(1 − 1/COP) [kW]. */
  mocDolnegoZrodlaKw: number
  /** Udział GWC w dolnym źródle [%]. */
  udzialGwcPct: number
  /** Wzrost COP z karty [%]; null = brak COP z GWC. */
  wzrostCopPct: number | null
  /** Oszczędność prądu [kWh]; null = brak COP z GWC albo ciepła. */
  oszczednoscKwh: number | null
}

const PUSTY: GwcPompaCieplaResult = {
  wzrostTempParownikaK: 0,
  mocGwcKw: 0,
  mocDolnegoZrodlaKw: 0,
  udzialGwcPct: 0,
  wzrostCopPct: null,
  oszczednoscKwh: null,
}

const r0 = (x: number) => Math.round(x)

/** Source 5.54 warning: a GWC is not a full heat source for the pump — only a support. */
function tylkoWsparcie(udzialPct: number): Warning {
  return {
    code: "GWP-TYLKO-WSPARCIE",
    level: "info",
    i18nKey: "GWP-TYLKO-WSPARCIE",
    params: { pct: udzialPct },
    technicalMessage: `udzialGwcPct = ${udzialPct} < 100`,
    field: "strumienParownikaM3H",
  }
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 4: GWC jako wsparcie pompy ciepła powietrze-woda (dawne 5.54). Źródło:
 * „GWC podgrzewa powietrze o kilka stopni, co zwiększa COP”, „GWC to nie pełne dolne źródło — tylko wsparcie”.
 * Fizyka: powietrze z GWC miesza się na wlocie parownika z powietrzem zewnętrznym — przy równych ρ·c_p temperatura
 * mieszaniny rośnie o ΔT_GWC · V̇_GWC / V̇_par (✅🤖 — bilans mieszania; gdy GWC daje cały strumień parownika,
 * pełne ΔT_GWC). Ciepło GWC — ten sam wzór strumienia ciepła powietrza co Ekrany 3/4/12. Dolne źródło pompy
 * daje P·(1 − 1/COP) (bilans energii pompy: ciepło = prąd + dolne źródło). Wzrost COP — wyłącznie z karty pompy
 * (COP przy wyższej temperaturze powietrza): źródło nie daje reguły COP od temperatury dolnego źródła.
 *
 * Niespójność przykładów źródła (Dyrektywa #5): 5.54 „+3 °C → COP +6%” to 2 %/K, a 5.93 „0 → 5 °C → COP +15%”
 * to 3 %/K — dwa przykłady, nie reguła; dlatego COP „z GWC” wpisuje user z karty. Wariant solanka-woda (GWC
 * „podgrzewa wodę”) nie jest liczony — źródło nie daje modelu wymiany ciepła w gruncie (Ekran 4).
 */
export function calculateGwcPompaCiepla(input: GwcPompaCieplaInput): CalcResult<GwcPompaCieplaResult> {
  const errors = [
    ...ujemneWartosci({
      strumienGwcM3H: input.strumienGwcM3H,
      przyrostGwcK: input.przyrostGwcK,
      strumienParownikaM3H: input.strumienParownikaM3H,
      mocPompyKw: input.mocPompyKw,
      cieploKwh: input.cieploKwh,
    }),
    ...copPonizejJednosci("copBezGwc", input.copBezGwc),
    ...copPonizejJednosci("copZGwc", input.copZGwc),
  ]
  const inputs = { ...input }
  const baza = { unit: "%", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    input.strumienGwcM3H === 0 ||
    input.przyrostGwcK === 0 ||
    input.strumienParownikaM3H === 0 ||
    input.mocPompyKw === 0 ||
    input.copBezGwc === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const strumienDoParownika = Math.min(input.strumienGwcM3H, input.strumienParownikaM3H)
  const wzrostTempParownikaK = (input.przyrostGwcK * strumienDoParownika) / input.strumienParownikaM3H
  const mocGwcKw = obliczStrumienCieplaPowietrzaW(strumienDoParownika, input.przyrostGwcK) / 1000
  const mocDolnegoZrodlaKw = input.mocPompyKw * (1 - 1 / input.copBezGwc)
  const udzialGwcPct = mocDolnegoZrodlaKw > 0 ? (mocGwcKw / mocDolnegoZrodlaKw) * 100 : 0
  const zCop = input.copZGwc > 0
  const value: GwcPompaCieplaResult = {
    wzrostTempParownikaK,
    mocGwcKw,
    mocDolnegoZrodlaKw,
    udzialGwcPct,
    wzrostCopPct: zCop ? (input.copZGwc / input.copBezGwc - 1) * 100 : null,
    oszczednoscKwh: zCop && input.cieploKwh > 0 ? input.cieploKwh * (1 / input.copBezGwc - 1 / input.copZGwc) : null,
  }
  const warnings: Warning[] = udzialGwcPct < 100 ? [tylkoWsparcie(r0(udzialGwcPct))] : []
  const assumptions: Assumption[] = [{ kod: "GWP-ZAL-MIESZANIE" }, { kod: "GWP-ZAL-COP-Z-KARTY" }]
  return { ...baza, value, status: "VALID", assumptions, warnings }
}
