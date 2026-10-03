import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, wartoscNajdluzej, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { SciezkaCenInput, TrybSciezki } from "./input"
import { validateInput } from "./validation"
import { pozaProjekcjaUe, zalozeniaUe2019 } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type SciezkaCenResult = {
  /** Price multiplier of year t = 1..N relative to the base year (index 0 = year 1). */
  mnozniki: number[]
  /** Multiplier in year N. */
  mnoznikKoncowy: number
  /** Geometric average change [%/year] over the horizon. */
  sredniaProcentRok: number
  /** Sum of annual costs over N years in the money of those years (nominal). */
  sumaNominalnaZl: number
  /** The same sum in base-year money (deflated by (1+π)^t; equal to nominal without inflation). */
  sumaDzisiejszeZl: number
  /** Inflation used [%/year]; null for "suwak" and "ue" (real prices). */
  inflacjaProcent: number | null
}

const FORMULA =
  "indeks_{UE}(t) = P(r_0+t)/P(r_0),\\ P \\text{ interpolowane geometrycznie}; \\ indeks_{nom}(t) = indeks_{UE}(t)\\cdot(1+\\pi)^t; \\ " +
  "g: (1+g)^t; \\ \\Sigma = \\sum_{t=1}^{N} K_0 \\cdot indeks(t)"

/**
 * EU Reference Scenario level interpolated geometrically between the 5-year points (D40).
 * Null outside the projection range — never extrapolated.
 */
export function poziomUe(rok: number, dane: Rozliczenia = DANE_ROZLICZEN): number | null {
  const pkt = [...dane.sciezkaUe.punkty].sort((a, b) => a.rok - b.rok)
  for (let i = 0; i < pkt.length - 1; i++) {
    const a = pkt[i]
    const b = pkt[i + 1]
    if (rok >= a.rok && rok <= b.rok) {
      return a.wartosc * Math.pow(b.wartosc / a.wartosc, (rok - a.rok) / (b.rok - a.rok))
    }
  }
  return null
}

/** Inflation π as a fraction for the chosen path; null when the path has no inflation. */
export function inflacjaSciezki(
  tryb: TrybSciezki,
  rokBazowy: number,
  dane: Rozliczenia = DANE_ROZLICZEN,
): number | null {
  if (tryb.rodzaj !== "ue-inflacja") return null
  if (tryb.zrodloInflacji === "wlasna") return (tryb.wlasnaInflacjaProcent ?? 0) / 100
  const stawka = tryb.zrodloInflacji === "gus" ? dane.inflacja.sredniaGus15Lat : dane.inflacja.celNbp
  return wartoscNajdluzej(stawka.okresy, rokBazowy)
}

/**
 * Energy price multiplier in year t (echo for the TCO engine D7/F8). Null when the EU path does
 * not reach year `rokBazowy + t`.
 */
export function mnoznikCenyEnergii(
  tryb: TrybSciezki,
  rokBazowy: number,
  t: number,
  dane: Rozliczenia = DANE_ROZLICZEN,
): number | null {
  if (tryb.rodzaj === "suwak") return Math.pow(1 + tryb.gProcent / 100, t)
  const p0 = poziomUe(rokBazowy, dane)
  const pt = poziomUe(rokBazowy + t, dane)
  if (p0 === null || pt === null) return null
  const pi = inflacjaSciezki(tryb, rokBazowy, dane) ?? 0
  return (pt / p0) * Math.pow(1 + pi, t)
}

/**
 * Multiplier of every other running cost (fuel, service, replacements) in year t: (1+π)^t when
 * inflation is chosen, otherwise 1 — without it off-grid scenarios would look artificially cheap (D41).
 */
export function mnoznikKosztowBiezacych(
  tryb: TrybSciezki,
  rokBazowy: number,
  t: number,
  dane: Rozliczenia = DANE_ROZLICZEN,
): number {
  const pi = inflacjaSciezki(tryb, rokBazowy, dane)
  return pi === null ? 1 : Math.pow(1 + pi, t)
}

export function calculateSciezkaCen(
  input: SciezkaCenInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<SciezkaCenResult> {
  const pusty: SciezkaCenResult = {
    mnozniki: [],
    mnoznikKoncowy: 0,
    sredniaProcentRok: 0,
    sumaNominalnaZl: 0,
    sumaDzisiejszeZl: 0,
    inflacjaProcent: null,
  }
  const inputs = { rokBazowy: input.rokBazowy, horyzontLat: input.horyzontLat, kosztRocznyZl: input.kosztRocznyZl }
  const base = { unit: "zł", formula: FORMULA, formulaKey: "UI-FORMULA-SIEC-SCIEZKA-CEN-ENERGII", inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) {
    return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  }

  const warnings: Warning[] = []
  const assumptions: Assumption[] = []
  if (input.tryb.rodzaj !== "suwak") {
    const ostatni = Math.max(...dane.sciezkaUe.punkty.map((p) => p.rok))
    const koniec = input.rokBazowy + input.horyzontLat
    if (poziomUe(input.rokBazowy, dane) === null || koniec > ostatni) {
      return {
        ...base,
        value: pusty,
        status: "OUT_OF_SCOPE",
        assumptions: [],
        warnings: [pozaProjekcjaUe(koniec, ostatni)],
      }
    }
    warnings.push(zalozeniaUe2019())
    assumptions.push({ kod: "SIEC-ZRODLO-SCIEZKI-UE", params: { stanNa: dane.sciezkaUe.stanNa } })
  } else {
    assumptions.push({ kod: "SIEC-SUWAK-PONAD-INFLACJE", params: { g: input.tryb.gProcent } })
  }

  const pi = inflacjaSciezki(input.tryb, input.rokBazowy, dane)
  if (pi !== null) {
    assumptions.push({ kod: "SIEC-INFLACJA-FISHER", params: { pi: (pi * 100).toFixed(2) } })
  }

  const mnozniki: number[] = []
  let sumaNominalnaZl = 0
  let sumaDzisiejszeZl = 0
  for (let t = 1; t <= input.horyzontLat; t++) {
    const m = mnoznikCenyEnergii(input.tryb, input.rokBazowy, t, dane) as number
    mnozniki.push(m)
    sumaNominalnaZl += input.kosztRocznyZl * m
    sumaDzisiejszeZl += (input.kosztRocznyZl * m) / Math.pow(1 + (pi ?? 0), t)
  }
  const mnoznikKoncowy = mnozniki[mnozniki.length - 1]
  const sredniaProcentRok = (Math.pow(mnoznikKoncowy, 1 / input.horyzontLat) - 1) * 100

  return {
    ...base,
    value: {
      mnozniki,
      mnoznikKoncowy,
      sredniaProcentRok,
      sumaNominalnaZl,
      sumaDzisiejszeZl,
      inflacjaProcent: pi === null ? null : pi * 100,
    },
    status: input.kosztRocznyZl === 0 ? "INCOMPLETE" : "VALID",
    assumptions,
    warnings,
  }
}
