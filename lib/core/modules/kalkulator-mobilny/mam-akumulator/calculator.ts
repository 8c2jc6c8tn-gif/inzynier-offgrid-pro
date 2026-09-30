import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { MamAkumulatorInput } from "./input"
import { validateInput } from "./validation"
import { pradRazemPonadMaks, pradUrzadzeniaPonadMaks } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "t_i = \\dfrac{C_{Ah} \\times U \\times DoD \\times \\eta}{P_i}, \\quad I_i = \\dfrac{P_i}{U \\times \\eta}"

export type CzasUrzadzenia = {
  nazwa: string
  mocW: number
  /** Czas pracy tego urządzenia samego [h]. */
  czasH: number
  /** Prąd pobierany z akumulatora [A]. */
  pradA: number
}

export type MamAkumulatorResult = {
  /** Energia do wykorzystania [Wh] = C × U × DoD × η. */
  energiaUzytecznaWh: number
  /** Per device (only rows with power entered), longest runtime first. */
  urzadzenia: CzasUrzadzenia[]
  /** Wszystkie urządzenia naraz [h] (0 gdy brak urządzeń). */
  czasRazemH: number
  pradRazemA: number
}

const PUSTY_WYNIK: MamAkumulatorResult = { energiaUzytecznaWh: 0, urzadzenia: [], czasRazemH: 0, pradRazemA: 0 }

/**
 * Ekran 4, Moduł 12 — "Mam akumulator — co mogę podłączyć?" (dawne 8.4). Biblia §12.4: pojemność
 * użyteczna z DoD, czas pracy każdego urządzenia z listy, sortowanie, ostrzeżenie o zbyt dużym prądzie.
 * Przykład Biblii (12 V 100 Ah, użyteczne 1,2 kWh): lodówka 50 W — 24 h, LED 20 W — 60 h, czajnik
 * 1000 W — 1,2 h. Wzór ten sam co E1 (`tryb-uproszczony`, t = C × U / P) rozszerzony o DoD i η.
 * Moce urządzeń zawsze od usera (D33 — przykłady to tylko podpowiedź).
 */
export function calculateMamAkumulator(input: MamAkumulatorInput): CalcResult<MamAkumulatorResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    dodPct: input.dodPct,
    sprawnoscPct: input.sprawnoscPct,
    maksPradA: input.maksPradA,
  }
  const baza = { unit: "h", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.urzadzenia.map((u, indeks) => ({ ...u, indeks })).filter((u) => u.mocW > 0)
  if (
    input.chemia === null ||
    input.pojemnoscAh === 0 ||
    input.napiecieV === 0 ||
    input.dodPct === 0 ||
    input.sprawnoscPct === 0 ||
    wpisane.length === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const eta = input.sprawnoscPct / 100
  const energiaUzytecznaWh = input.pojemnoscAh * input.napiecieV * (input.dodPct / 100) * eta
  const pradZ = (mocW: number) => mocW / (input.napiecieV * eta)
  const warnings: Warning[] = []
  const urzadzenia = wpisane.map((u) => {
    const pradA = pradZ(u.mocW)
    if (input.maksPradA > 0 && pradA > input.maksPradA) warnings.push(pradUrzadzeniaPonadMaks(u.nazwa, pradA, input.maksPradA, u.indeks))
    return { nazwa: u.nazwa, mocW: u.mocW, czasH: energiaUzytecznaWh / u.mocW, pradA }
  })
  urzadzenia.sort((a, b) => b.czasH - a.czasH)
  const mocRazem = wpisane.reduce((s, u) => s + u.mocW, 0)
  const pradRazemA = pradZ(mocRazem)
  if (input.maksPradA > 0 && pradRazemA > input.maksPradA && wpisane.length > 1) warnings.push(pradRazemPonadMaks(pradRazemA, input.maksPradA))

  const assumptions: Assumption[] = [{ kod: "MA-ZALOZENIE-PELNY-AKUMULATOR" }, { kod: "AS-ZALOZENIE-BEZ-TEMPERATURY" }]
  return {
    ...baza,
    value: { energiaUzytecznaWh, urzadzenia, czasRazemH: energiaUzytecznaWh / mocRazem, pradRazemA },
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
