import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { BlackoutMinimumInput } from "./input"
import { validateInput } from "./validation"
import { akumulatorZaMaly, rozruchPrzetwornicy } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_{d} = \\sum P_i h_i, \\quad E = E_{d} \\times \\dfrac{T}{24}, \\quad C_{min} = \\dfrac{E}{\\eta \\times U \\times u}, \\quad P_{przetw} \\ge \\sum P_i"

/** Biblia §12.20: "Oblicza, ile energii potrzeba na 12, 24, 48 h". */
export const CZASY_REFERENCYJNE_H = [12, 24, 48] as const

export type BlackoutMinimumResult = {
  /** Zużycie odbiorników krytycznych na dobę [Wh]. */
  zuzycieDobaWh: number
  /** Energia na wpisany czas blackoutu [Wh] (po stronie odbiorników). */
  energiaBlackoutWh: number
  /** Energia na 12/24/48 h [Wh] — kolejność jak CZASY_REFERENCYJNE_H. */
  energiaReferencyjnaWh: number[]
  /** Minimalna pojemność akumulatora [Ah]. */
  minimalnyAh: number
  /** Minimalna moc ciągła przetwornicy [W] — suma mocy (wszystko naraz). */
  minimalnaPrzetwornicaW: number
  /** Na ile godzin starczy posiadany akumulator; 0 = nie podano. */
  posiadanyStarczyH: number
}

const PUSTY_WYNIK: BlackoutMinimumResult = {
  zuzycieDobaWh: 0,
  energiaBlackoutWh: 0,
  energiaReferencyjnaWh: [],
  minimalnyAh: 0,
  minimalnaPrzetwornicaW: 0,
  posiadanyStarczyH: 0,
}

/**
 * Ekran 13, Moduł 12 — "Blackout w domu — minimum do przeżycia" (dawne 8.20, Biblia §12.20).
 * Minimalny zestaw tylko dla odbiorników krytycznych: energia na czas blackoutu, akumulator
 * E / (η × U × u) i przetwornica ≥ suma mocy (wszystkie mogą pracować naraz). Prądy rozruchowe
 * (sprężarka lodówki) — E8. Przykład Biblii "24 h → 2 kWh → 200 Ah" zgadza się rzędem wielkości
 * (2000 Wh / 12 V ≈ 167 Ah przed stratami i częścią użyteczną).
 */
export function calculateBlackoutMinimum(input: BlackoutMinimumInput): CalcResult<BlackoutMinimumResult> {
  const { errors } = validateInput(input)
  const inputs = {
    czasBlackoutuH: input.czasBlackoutuH,
    napiecieV: input.napiecieV,
    uzytecznaPct: input.uzytecznaPct,
    sprawnoscPrzetwornicyPct: input.sprawnoscPrzetwornicyPct,
    posiadanyAh: input.posiadanyAh,
  }
  const baza = { unit: "Ah", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY_WYNIK, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const wpisane = input.odbiorniki.filter((o) => o.mocW > 0 && o.godzinNaDobe > 0)
  if (
    wpisane.length === 0 ||
    input.czasBlackoutuH === 0 ||
    input.napiecieV === 0 ||
    input.uzytecznaPct === 0 ||
    input.sprawnoscPrzetwornicyPct === 0
  ) {
    return { ...baza, value: PUSTY_WYNIK, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zuzycieDobaWh = wpisane.reduce((s, o) => s + o.mocW * o.godzinNaDobe, 0)
  const naCzas = (h: number) => (zuzycieDobaWh * h) / 24
  const whNaAh = (input.sprawnoscPrzetwornicyPct / 100) * input.napiecieV * (input.uzytecznaPct / 100)
  const energiaBlackoutWh = naCzas(input.czasBlackoutuH)
  const minimalnyAh = energiaBlackoutWh / whNaAh
  const posiadanyStarczyH = input.posiadanyAh > 0 ? ((input.posiadanyAh * whNaAh) / zuzycieDobaWh) * 24 : 0

  const warnings: Warning[] = []
  if (input.posiadanyAh > 0 && input.posiadanyAh < minimalnyAh) {
    warnings.push(akumulatorZaMaly(input.posiadanyAh, minimalnyAh, posiadanyStarczyH))
  }
  warnings.push(rozruchPrzetwornicy())

  return {
    ...baza,
    value: {
      zuzycieDobaWh,
      energiaBlackoutWh,
      energiaReferencyjnaWh: CZASY_REFERENCYJNE_H.map(naCzas),
      minimalnyAh,
      minimalnaPrzetwornicaW: wpisane.reduce((s, o) => s + o.mocW, 0),
      posiadanyStarczyH,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions: [{ kod: "BM-ZALOZENIE-BEZ-LADOWANIA" }],
    warnings,
  }
}
