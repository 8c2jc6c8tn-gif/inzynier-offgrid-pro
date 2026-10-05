import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import { OPTYMALNE_OBCIAZENIE_PCT } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/constants"
import { obliczPraceAgregatu } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import { DNI_W_MIESIACU, HORYZONTY_STALE_DNI } from "./constants"
import { brakujaceDni, dataDnia } from "./brakujace-dni"
import { analizujHistorie, type WynikHistorii } from "./historia"
import type { DeficytyMiesieczneInput } from "./input"
import { validateInput } from "./validation"
import { paliwoPonadZapas, sprawdzZapas } from "./warnings"
import {
  historiaBrakDni,
  historiaBrakMiesiecy,
  historiaBrakParametrow,
  historiaMaloDanych,
  historiaPercentylToMaksimum,
  historiaPominieteLata,
  historiaZapasZaMaly,
  horyzontPonadZapas,
} from "./warnings-historia"

/**
 * 1.1.0 (02.10.2026, owner decision): generator chain shown explicitly (kW per running hour, l/kWh), fixed
 * START horizons 3/7/14 days / month / own days, optional multi-year daily history (distribution of monthly
 * shortfalls, worst resupply window per year, streaks of low days, stock sized from a user percentile).
 * Without the new optional inputs the result and warnings are the 1.0.0 ones.
 * 1.2.0 (04.10.2026, owner decision D74 pkt 5): a month with no complete data in any year of the history is
 * not a zero shortfall — it is listed in `miesiaceBezDanych` (no result for it) and raises 🟡 (was ℹ️), because
 * a missing winter month would make the fuel stock too small.
 * 1.3.0 (05.10.2026, list entry M7/E2 (a)): optional energy store in the daily balance of the history
 * (`analizaHistorii.magazyn`: usable capacity, round-trip efficiency, state on 1 January — all from the user).
 * Without it the result is the 1.2.0 one; a capacity without efficiency → INCOMPLETE (nothing assumed).
 * 1.4.0 (05.10.2026, owner: "niech liczy"): optional night share of the daily demand (`analizaHistorii.udzialNocyPct`,
 * from the user) — the night part is covered only from the store or the generator, not by the same day's PV.
 * Without it the numbers are the 1.3.0 ones; an assumption now says that day and night are netted then.
 * 1.5.0 (05.10.2026, owner decision 2 A+B): days marked as missing in the history raise 🟡
 * `DEFM-HISTORIA-BRAK-DNI` with their count and first dates (the screen lets the user fill them by hand).
 * The numbers are the 1.4.0 ones.
 */
export const CALCULATOR_VERSION = "1.5.0"

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

/** The generator chain, spelled out: kW per running hour → l per kWh → hours and litres for the demand. */
export type LancuchAgregatu = {
  /** Rated power × the optimal-load factor [kW produced per running hour]. */
  mocUzytecznaKw: number
  /** Fuel use [l/h] ÷ useful power [kW]. */
  litryNaKwh: number
  /** litres per kWh × fuel price [PLN/kWh]. */
  kosztPaliwaNaKwhZl: number
  /** The energy the generator has to supply [kWh] (sum of the monthly shortfalls). */
  energiaKwh: number
  godzinyPracy: number
  paliwoL: number
}

/** Fuel for a fixed horizon, taken from the worst month prorated to N days. */
export type HoryzontPaliwa = {
  klucz: "3" | "7" | "14" | "miesiac" | "wlasny"
  dni: number
  energiaKwh: number
  godzinyPracy: number
  paliwoL: number
  kosztPaliwaZl: number
  /** null = stock not entered. */
  zapasWystarcza: boolean | null
  /** The horizon the user picked (its warning is the one raised). */
  wybrany: boolean
}

/** Stock sized from the history: the worst resupply window of every year, in litres. */
export type ZapasZHistorii = {
  oknoDni: number
  litryMin: number
  litryMediana: number
  /** The user-chosen percentile; null when none was entered. */
  litryPercentyl: number | null
  percentylPct: number
  litryMax: number
  /** Years in which the entered stock would have been enough; null = stock not entered. */
  lataPokryte: number | null
  lata: number
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
  /** null while the result is empty (INCOMPLETE / INVALID_INPUT). */
  lancuch: LancuchAgregatu | null
  horyzonty: HoryzontPaliwa[]
  /** The history analysis; null without a history or its parameters. */
  historia: WynikHistorii | null
  zapasZHistorii: ZapasZHistorii | null
  /** True when the monthly shortfalls were derived from the history instead of being entered. */
  deficytyZHistorii: boolean
  /** Months (1–12) with no complete data in the history when the shortfalls come from it — no result, not 0. */
  miesiaceBezDanych: number[]
}

const PUSTY: DeficytyMiesieczneResult = {
  miesiace: [],
  sumaDeficytKwh: 0,
  sumaGodzin: 0,
  sumaPaliwaL: 0,
  sumaKosztZl: 0,
  miesiacNajdluzszy: null,
  lancuch: null,
  horyzonty: [],
  historia: null,
  zapasZHistorii: null,
  deficytyZHistorii: false,
  miesiaceBezDanych: [],
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
 *
 * Owner extension (02.10.2026): see CALCULATOR_VERSION. Fixed horizons use the worst month's average daily
 * shortfall × N days (the generator covers all the missing energy). The history mode replaces the single fixed
 * horizon by the distribution over past years (`historia.ts`).
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

  // History analysis (needs the history, a 12-month daily demand, the window length).
  const a = input.analizaHistorii
  const maParametry =
    !!input.historia && !!input.zapotrzebowanieDobaKwh && input.zapotrzebowanieDobaKwh.length === 12 && !!a && a.oknoDni > 0
  // A store with a capacity but no efficiency: nothing is assumed, the result waits for the value.
  const magazynBezSprawnosci = !!a?.magazyn && a.magazyn.pojemnoscUzytecznaKwh > 0 && a.magazyn.sprawnoscPct === 0
  if (maParametry && magazynBezSprawnosci) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }
  const historia =
    maParametry && input.historia && input.zapotrzebowanieDobaKwh && a
      ? analizujHistorie(input.historia, input.zapotrzebowanieDobaKwh, a)
      : null

  // Monthly shortfalls: the entered ones; all zero + a history → the history's (percentile, else median) per month.
  let deficyty = input.deficytyKwh
  let deficytyZHistorii = false
  if (inputs.sumaDeficytowKwh === 0 && historia && historia.miesiace.length > 0) {
    deficyty = Array.from({ length: 12 }, (_, i) => {
      const m = historia.miesiace.find((x) => x.miesiac === i + 1)
      return m ? (m.deficytKwh.percentyl ?? m.deficytKwh.mediana) : 0
    })
    deficytyZHistorii = true
  }
  const sumaDeficytowKwh = deficyty.reduce((x, y) => x + y, 0)
  inputs.sumaDeficytowKwh = sumaDeficytowKwh

  if (sumaDeficytowKwh === 0 || input.mocAgregatuKw === 0 || input.zuzyciePaliwaLH === 0 || input.cenaPaliwaZlL === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const miesiace: MiesiacAgregatu[] = []
  deficyty.forEach((deficytKwh, i) => {
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

  const suma = (f: (m: MiesiacAgregatu) => number) => miesiace.reduce((acc, m) => acc + f(m), 0)
  const najdluzszy = miesiace.reduce((acc, m) => (m.godzinyPracy > acc.godzinyPracy ? m : acc))

  const mocUzytecznaKw = input.mocAgregatuKw * (OPTYMALNE_OBCIAZENIE_PCT / 100)
  const litryNaKwh = input.zuzyciePaliwaLH / mocUzytecznaKw
  const lancuch: LancuchAgregatu = {
    mocUzytecznaKw,
    litryNaKwh,
    kosztPaliwaNaKwhZl: litryNaKwh * input.cenaPaliwaZlL,
    energiaKwh: sumaDeficytowKwh,
    godzinyPracy: suma((m) => m.godzinyPracy),
    paliwoL: suma((m) => m.paliwoL),
  }

  // Fixed START horizons from the worst month (its average daily shortfall × N days).
  const dniNajgorszego = DNI_W_MIESIACU[najdluzszy.miesiac - 1]!
  const naDobeKwh = najdluzszy.deficytKwh / dniNajgorszego
  const wybraneDni = input.horyzont?.rodzaj === "dni" ? input.horyzont.dni : null
  const horyzont = (klucz: HoryzontPaliwa["klucz"], dni: number, wybrany: boolean): HoryzontPaliwa => {
    const energiaKwh = naDobeKwh * dni
    const godzinyPracy = energiaKwh / mocUzytecznaKw
    const paliwoL = godzinyPracy * input.zuzyciePaliwaLH
    return {
      klucz,
      dni,
      energiaKwh,
      godzinyPracy,
      paliwoL,
      kosztPaliwaZl: paliwoL * input.cenaPaliwaZlL,
      zapasWystarcza: input.zapasPaliwaL > 0 ? paliwoL <= input.zapasPaliwaL : null,
      wybrany,
    }
  }
  const horyzonty: HoryzontPaliwa[] = [
    ...HORYZONTY_STALE_DNI.map((d) => horyzont(String(d) as "3" | "7" | "14", d, wybraneDni === d)),
    horyzont("miesiac", dniNajgorszego, input.horyzont?.rodzaj === "miesiac"),
  ]
  if (wybraneDni !== null && !HORYZONTY_STALE_DNI.some((d) => d === wybraneDni)) horyzonty.push(horyzont("wlasny", wybraneDni, true))

  const warnings: Warning[] = []
  const wybrany = horyzonty.find((h) => h.wybrany)
  if (input.zapasPaliwaL > 0) {
    if (wybrany) {
      if (wybrany.paliwoL > input.zapasPaliwaL) {
        warnings.push(horyzontPonadZapas(najdluzszy.miesiac, wybrany.dni, wybrany.paliwoL, input.zapasPaliwaL))
      }
    } else {
      for (const m of miesiace) {
        if (m.paliwoL > input.zapasPaliwaL) warnings.push(paliwoPonadZapas(m.miesiac, m.godzinyPracy, m.paliwoL, input.zapasPaliwaL))
      }
    }
  } else {
    warnings.push(sprawdzZapas(najdluzszy.miesiac, najdluzszy.godzinyPracy, najdluzszy.paliwoL))
  }

  // Stock sized from the history: yearly worst windows in litres.
  let zapasZHistorii: ZapasZHistorii | null = null
  if (historia?.okno && a) {
    const litry = historia.okno.lata.map((o) => o.deficytKwh * litryNaKwh)
    const r = historia.okno.rozklad
    const percentylL = r.percentyl === null ? null : r.percentyl * litryNaKwh
    zapasZHistorii = {
      oknoDni: historia.okno.dni,
      litryMin: r.min * litryNaKwh,
      litryMediana: r.mediana * litryNaKwh,
      litryPercentyl: percentylL,
      percentylPct: a.percentylPct,
      litryMax: r.max * litryNaKwh,
      lataPokryte: input.zapasPaliwaL > 0 ? litry.filter((l) => l <= input.zapasPaliwaL).length : null,
      lata: litry.length,
    }
    if (input.zapasPaliwaL > 0 && percentylL !== null && input.zapasPaliwaL < percentylL) {
      warnings.push(
        historiaZapasZaMaly(a.oknoDni, a.percentylPct, percentylL, input.zapasPaliwaL, zapasZHistorii.lataPokryte ?? 0, litry.length),
      )
    }
  }
  if (input.historia && !maParametry) warnings.push(historiaBrakParametrow())
  if (historia && input.historia) {
    const braki = brakujaceDni(input.historia.lata)
    if (braki.length > 0) warnings.push(historiaBrakDni(braki.length, braki.slice(0, 5).map((b) => dataDnia(b.rok, b.dzien))))
    if (historia.lataPominiete.length > 0) warnings.push(historiaPominieteLata(historia.lataPominiete))
    if (deficytyZHistorii && historia.miesiaceBezDanych.length > 0) warnings.push(historiaBrakMiesiecy(historia.miesiaceBezDanych))
    if (historia.malo === "jeden-rok") warnings.push(historiaMaloDanych(historia.liczbaLat, historia.liczbaDniZDanymi))
    if (historia.malo === "percentyl-to-maksimum" && a) {
      warnings.push(historiaPercentylToMaksimum(historia.liczbaLat, historia.liczbaDniZDanymi, a.percentylPct))
    }
  }

  const assumptions: Assumption[] = [
    { kod: "OPTYMALNE-OBCIAZENIE-AGREGATU", params: { procent: OPTYMALNE_OBCIAZENIE_PCT } },
    { kod: deficytyZHistorii ? "DEFM-ZALOZENIE-DEFICYTY-Z-HISTORII" : "DEFM-ZALOZENIE-WPISANE-DEFICYTY" },
  ]
  if (wybrany) assumptions.push({ kod: "DEFM-ZALOZENIE-HORYZONT" })
  if (historia) {
    const m = a?.magazyn
    assumptions.push(
      historia.zMagazynem && m
        ? {
            kod: "DEFM-ZALOZENIE-HISTORIA-MAGAZYN",
            params: { zrodlo: historia.zrodlo, pojemnosc: m.pojemnoscUzytecznaKwh, sprawnosc: m.sprawnoscPct, stan: m.stanPoczatkowyPct },
          }
        : { kod: "DEFM-ZALOZENIE-HISTORIA", params: { zrodlo: historia.zrodlo } },
    )
    const noc = a?.udzialNocyPct ?? 0
    assumptions.push(noc > 0 ? { kod: "DEFM-ZALOZENIE-HISTORIA-DZIEN-NOC", params: { noc } } : { kod: "DEFM-ZALOZENIE-HISTORIA-DOBA-NETTO" })
  }

  return {
    ...baza,
    value: {
      miesiace,
      sumaDeficytKwh: sumaDeficytowKwh,
      sumaGodzin: lancuch.godzinyPracy,
      sumaPaliwaL: lancuch.paliwoL,
      sumaKosztZl: suma((m) => m.kosztZl),
      miesiacNajdluzszy: najdluzszy.miesiac,
      lancuch,
      horyzonty,
      historia,
      zapasZHistorii,
      deficytyZHistorii,
      miesiaceBezDanych: deficytyZHistorii && historia ? historia.miesiaceBezDanych : [],
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
