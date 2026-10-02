import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { obliczPraceAgregatu } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import type { DeficytyMiesieczneInput } from "./input"
import { validateInput } from "./validation"
import { paliwoPonadZapas, sprawdzZapas } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  `t_m = \\dfrac{D_m}{P_{agr} \\cdot ${latexLiczba(OPTYMALNE_OBCIAZENIE_PCT / 100)}},\\quad V_m = t_m \\cdot q,\\quad K_m = V_m \\cdot c_{pal} + t_m \\cdot c_{serw}`

export type MiesiacAgregatu = {
  /** 1 = January … 12 = December. */
  miesiac: number
  deficytKwh: number
  godzinyPracy: number
  paliwoL: number
  kosztPaliwaZl: number
  kosztSerwisuZl: number
  kosztZl: number
}

export type DeficytyMiesieczneResult = {
  /** Only months with a shortfall > 0, in calendar order. */
  miesiace: MiesiacAgregatu[]
  sumaDeficytKwh: number
  sumaGodzin: number
  sumaPaliwaL: number
  sumaKosztZl: number
  /** Month with the most running hours (1–12); null = no shortfall. */
  miesiacNajdluzszy: number | null
}

const PUSTY: DeficytyMiesieczneResult = {
  miesiace: [],
  sumaDeficytKwh: 0,
  sumaGodzin: 0,
  sumaPaliwaL: 0,
  sumaKosztZl: 0,
  miesiacNajdluzszy: null,
}

/**
 * Ekran 2, Moduł 7 — "Deficyty miesięczne i agregat" (dawne 6.2, Biblia §7.2). Echo of M2/E17 month by month
 * (`obliczPraceAgregatu`, the same 80% optimal load — upper end of the source's 70–80%, the value that reproduces
 * both the M2/E17 example and this one): hours = deficit ÷ (P × 0.8), fuel = hours × l/h, cost = fuel × price +
 * hours × service rate („dodaje koszty serwisu i oleju” — a user rate in PLN per running hour; the source gives
 * no number).
 *
 * Source example „Grudzień: deficyt 120 kWh → agregat 5 kW pracuje 30 h → 45 l paliwa → 350 zł”: 120 / (5 × 0.8)
 * = 30 h exactly; 45 l means 1.5 l/h; 350 zł means ≈ 7.78 zł/l (350 / 45) — the source leaves both implicit, the
 * test enters them. 🟡 „W lutym agregat będzie pracował 40 h — sprawdź zapas paliwa” has no hour threshold: the
 * engine raises 🟡 when a month needs more fuel than the stock the user entered; without a stock it only names the
 * busiest month (ℹ️).
 */
export function calculateDeficytyMiesieczne(input: DeficytyMiesieczneInput): CalcResult<DeficytyMiesieczneResult> {
  const { errors } = validateInput(input)
  const inputs = {
    sumaDeficytowKwh: input.deficytyKwh.reduce((a, b) => a + b, 0),
    mocAgregatuKw: input.mocAgregatuKw,
    zuzyciePaliwaLH: input.zuzyciePaliwaLH,
    cenaPaliwaZlL: input.cenaPaliwaZlL,
    kosztSerwisuZlH: input.kosztSerwisuZlH,
    zapasPaliwaL: input.zapasPaliwaL,
  }
  const baza = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (
    inputs.sumaDeficytowKwh === 0 ||
    input.mocAgregatuKw === 0 ||
    input.zuzyciePaliwaLH === 0 ||
    input.cenaPaliwaZlL === 0
  ) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const miesiace: MiesiacAgregatu[] = []
  input.deficytyKwh.forEach((deficytKwh, i) => {
    if (deficytKwh === 0) return
    const p = obliczPraceAgregatu(deficytKwh, input.mocAgregatuKw, input.zuzyciePaliwaLH, input.cenaPaliwaZlL)
    const kosztSerwisuZl = p.godzinyPracy * input.kosztSerwisuZlH
    miesiace.push({
      miesiac: i + 1,
      deficytKwh,
      godzinyPracy: p.godzinyPracy,
      paliwoL: p.zuzyciePaliwaLitry,
      kosztPaliwaZl: p.kosztZl,
      kosztSerwisuZl,
      kosztZl: p.kosztZl + kosztSerwisuZl,
    })
  })

  const suma = (f: (m: MiesiacAgregatu) => number) => miesiace.reduce((a, m) => a + f(m), 0)
  const najdluzszy = miesiace.reduce((a, m) => (m.godzinyPracy > a.godzinyPracy ? m : a))

  const warnings: Warning[] = []
  if (input.zapasPaliwaL > 0) {
    for (const m of miesiace) {
      if (m.paliwoL > input.zapasPaliwaL) warnings.push(paliwoPonadZapas(m.miesiac, m.godzinyPracy, m.paliwoL, input.zapasPaliwaL))
    }
  } else {
    warnings.push(sprawdzZapas(najdluzszy.miesiac, najdluzszy.godzinyPracy, najdluzszy.paliwoL))
  }

  const assumptions: Assumption[] = [
    { kod: "OPTYMALNE-OBCIAZENIE-AGREGATU", params: { procent: OPTYMALNE_OBCIAZENIE_PCT } },
    { kod: "DEFM-ZALOZENIE-WPISANE-DEFICYTY" },
  ]
  return {
    ...baza,
    value: {
      miesiace,
      sumaDeficytKwh: inputs.sumaDeficytowKwh,
      sumaGodzin: suma((m) => m.godzinyPracy),
      sumaPaliwaL: suma((m) => m.paliwoL),
      sumaKosztZl: suma((m) => m.kosztZl),
      miesiacNajdluzszy: najdluzszy.miesiac,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
