import { dniWMiesiacuRoku, MAX_DNI, czyRokPrzestepny } from "./constants"
import type { AnalizaHistorii, HistoriaDobowa, ZrodloHistorii } from "./input"

/**
 * History analysis for the fuel stock (owner decision 02.10.2026: "realistically analyse and forecast from
 * how many sunny days there were in past years; with the building's / locality's own data, more accurately").
 *
 * Pure functions over a typed multi-year daily history. No climate data lives here — the history is always
 * an input (PVGIS series, the building's own measurements, hand-entered). Method:
 *  - daily shortfall = max(0, demand of that calendar month − PV of that day), a day without a value stays `null`;
 *  - NO battery in the balance (every kWh PV does not cover goes to the generator) — an upper bound, safe side;
 *  - per calendar month: the shortfall total of every year in which that month is complete → distribution;
 *  - per year: the worst sliding window of `oknoDni` days (annual maximum) → distribution over years;
 *  - per year: the longest run of "low" days (PV < threshold share of that day's demand) → distribution over years;
 *  - percentile = nearest rank, index ⌈p/100·n⌉ of the ascending values (no interpolation: with few years the
 *    result is an observed value, never an invented one between two seasons).
 */

export type Rozklad = {
  /** Number of values (years) the distribution rests on. */
  n: number
  min: number
  mediana: number
  /** The chosen percentile; null when none was entered. */
  percentyl: number | null
  max: number
}

export type MiesiacHistorii = {
  /** 1 = January … 12 = December. */
  miesiac: number
  /** Years in which the month is complete. */
  liczbaLat: number
  deficytKwh: Rozklad
}

export type RokOkna = { rok: number; deficytKwh: number }

export type WynikHistorii = {
  zrodlo: ZrodloHistorii
  /** Years that took part in the window / streak statistics. */
  liczbaLat: number
  /** Days with a value in the whole history. */
  liczbaDniZDanymi: number
  /** Years without a complete window of the chosen length. */
  lataPominiete: number[]
  /** Months that have a complete year (calendar order); the rest is in `miesiaceBezDanych`. */
  miesiace: MiesiacHistorii[]
  miesiaceBezDanych: number[]
  /** Worst `oknoDni`-day window of every year [kWh] (annual maxima) and their distribution. */
  okno: { dni: number; lata: RokOkna[]; rozklad: Rozklad } | null
  /** Runs of low days; null when the threshold was not entered. */
  serie: { progPct: number; najdluzszaDni: number; najdluzszaWRoku: { rok: number; dni: number }[]; rozklad: Rozklad } | null
  /** True when the history rests on a single year, or the chosen percentile equals the maximum. */
  malo: "jeden-rok" | "percentyl-to-maksimum" | null
}

/** Nearest-rank percentile of an unsorted list (p in 1..100). */
export function percentylNajblizszejRangi(wartosci: number[], p: number): number {
  const s = [...wartosci].sort((a, b) => a - b)
  const ranga = Math.min(s.length, Math.max(1, Math.ceil((p / 100) * s.length)))
  return s[ranga - 1]!
}

export function rozklad(wartosci: number[], percentylPct: number): Rozklad {
  const s = [...wartosci].sort((a, b) => a - b)
  const n = s.length
  const mediana = n % 2 === 1 ? s[(n - 1) / 2]! : (s[n / 2 - 1]! + s[n / 2]!) / 2
  return {
    n,
    min: s[0]!,
    mediana,
    percentyl: percentylPct > 0 ? percentylNajblizszejRangi(s, percentylPct) : null,
    max: s[n - 1]!,
  }
}

/** Daily PV energy [kWh/day] of every year (irradiation converted with the user's kWp and PR). `null` = missing day. */
export function dobowaProdukcjaKwh(h: HistoriaDobowa): { rok: number; kwh: (number | null)[] }[] {
  const wsp = h.rodzaj === "naswietlenie-kwh-m2" ? (h.przeliczenie?.mocPvKwp ?? 0) * (h.przeliczenie?.wspolczynnikPr ?? 0) : 1
  return h.lata.map((r) => ({ rok: r.rok, kwh: r.dni.map((d) => (d === null ? null : d * wsp)) }))
}

/** Calendar month (0..11) of every day index of a year. */
function miesiaceDni(rok: number): number[] {
  const out: number[] = []
  dniWMiesiacuRoku(rok).forEach((d, m) => {
    for (let i = 0; i < d; i++) out.push(m)
  })
  return out
}

/**
 * The analysis. Preconditions (checked by `walidujHistorie`): non-empty, year lengths ≤ days of the year,
 * values finite and ≥ 0, `zapotrzebowanieDobaKwh` has 12 values ≥ 0, `analiza.oknoDni` in 1..366.
 */
export function analizujHistorie(h: HistoriaDobowa, zapotrzebowanieDobaKwh: number[], analiza: AnalizaHistorii): WynikHistorii {
  const lata = dobowaProdukcjaKwh(h)
  const miesiaceRoku = new Map<number, number[]>(lata.map((r) => [r.rok, miesiaceDni(r.rok)]))
  const W = analiza.oknoDni

  let liczbaDniZDanymi = 0
  const mSumy: number[][] = Array.from({ length: 12 }, () => [])
  const okna: RokOkna[] = []
  const lataPominiete: number[] = []
  const serieRok: { rok: number; dni: number }[] = []

  for (const { rok, kwh } of lata) {
    const mies = miesiaceRoku.get(rok)!
    const popyt = (i: number) => zapotrzebowanieDobaKwh[mies[i]!]!
    // Daily shortfall; null stays null.
    const def = kwh.map((p, i) => (p === null ? null : Math.max(0, popyt(i) - p)))
    liczbaDniZDanymi += kwh.filter((p) => p !== null).length

    // Complete months → monthly totals.
    const dniMies = dniWMiesiacuRoku(rok)
    let start = 0
    dniMies.forEach((d, m) => {
      let suma = 0
      let pelny = start + d <= def.length
      for (let i = start; pelny && i < start + d; i++) {
        const x = def[i]
        if (x === null || x === undefined) pelny = false
        else suma += x
      }
      if (pelny) mSumy[m]!.push(suma)
      start += d
    })

    // Worst sliding window of W days with every day present.
    let najgorsze = -1
    let suma = 0
    let ileWOknie = 0 // consecutive present days ending at i, capped by the window logic below
    const kolejka: number[] = []
    for (let i = 0; i < def.length; i++) {
      const x = def[i]
      if (x === null || x === undefined) {
        kolejka.length = 0
        suma = 0
        ileWOknie = 0
        continue
      }
      kolejka.push(x)
      suma += x
      ileWOknie++
      if (kolejka.length > W) suma -= kolejka.shift()!
      if (ileWOknie >= W && suma > najgorsze) najgorsze = suma
    }
    if (najgorsze < 0) lataPominiete.push(rok)
    else okna.push({ rok, deficytKwh: najgorsze })

    // Longest run of low days (a missing day breaks the run).
    if (analiza.progSlabegoDniaPct > 0) {
      let biezaca = 0
      let maks = 0
      kwh.forEach((p, i) => {
        if (p !== null && p < (analiza.progSlabegoDniaPct / 100) * popyt(i)) {
          biezaca++
          if (biezaca > maks) maks = biezaca
        } else biezaca = 0
      })
      serieRok.push({ rok, dni: maks })
    }
  }

  const miesiace: MiesiacHistorii[] = []
  const miesiaceBezDanych: number[] = []
  mSumy.forEach((v, m) => {
    if (v.length === 0) miesiaceBezDanych.push(m + 1)
    else miesiace.push({ miesiac: m + 1, liczbaLat: v.length, deficytKwh: rozklad(v, analiza.percentylPct) })
  })

  const nLat = okna.length
  const percentylToMaks =
    analiza.percentylPct > 0 && analiza.percentylPct < 100 && nLat > 1 && Math.ceil((analiza.percentylPct / 100) * nLat) === nLat
  return {
    zrodlo: h.zrodlo,
    liczbaLat: nLat,
    liczbaDniZDanymi,
    lataPominiete,
    miesiace,
    miesiaceBezDanych,
    okno: nLat > 0 ? { dni: W, lata: okna, rozklad: rozklad(okna.map((o) => o.deficytKwh), analiza.percentylPct) } : null,
    serie:
      analiza.progSlabegoDniaPct > 0 && serieRok.length > 0
        ? {
            progPct: analiza.progSlabegoDniaPct,
            najdluzszaDni: Math.max(...serieRok.map((s) => s.dni)),
            najdluzszaWRoku: serieRok,
            rozklad: rozklad(serieRok.map((s) => s.dni), analiza.percentylPct),
          }
        : null,
    malo: nLat === 1 ? "jeden-rok" : percentylToMaks ? "percentyl-to-maksimum" : null,
  }
}

/** Structural checks of a history; returns neutral technical reasons (empty list = OK). */
export function walidujHistorie(h: HistoriaDobowa): string[] {
  const powody: string[] = []
  if (h.lata.length === 0) powody.push("no years")
  if (h.rodzaj === "naswietlenie-kwh-m2") {
    const p = h.przeliczenie
    if (!p || !(p.mocPvKwp > 0) || !(p.wspolczynnikPr > 0) || p.wspolczynnikPr > 1) powody.push("irradiation needs kWp > 0 and 0 < PR <= 1")
  }
  const widziane = new Set<number>()
  for (const r of h.lata) {
    if (widziane.has(r.rok)) powody.push(`duplicate year ${r.rok}`)
    widziane.add(r.rok)
    const max = czyRokPrzestepny(r.rok) ? MAX_DNI : MAX_DNI - 1
    if (r.dni.length > max) powody.push(`year ${r.rok}: ${r.dni.length} values > ${max} days`)
    r.dni.forEach((d, i) => {
      if (d !== null && (!Number.isFinite(d) || d < 0)) powody.push(`year ${r.rok}, day ${i + 1}: ${d}`)
    })
  }
  return powody.slice(0, 3)
}
