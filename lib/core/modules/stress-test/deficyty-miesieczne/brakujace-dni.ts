import type { RokHistorii } from "./input"

/** A day written as missing (`null`) in a history; `dzien` = 1-based day of the year. */
export type BrakujacyDzien = { rok: number; dzien: number }

/**
 * Days explicitly marked as missing (`null`) within the entered length of every year. Days after the last
 * entered value of a year (a year still running, a logger started mid-year at the end) are not listed — they
 * were never entered, the analysis simply ends there.
 */
export function brakujaceDni(lata: RokHistorii[]): BrakujacyDzien[] {
  const out: BrakujacyDzien[] = []
  for (const r of lata) r.dni.forEach((d, i) => d === null && out.push({ rok: r.rok, dzien: i + 1 }))
  return out
}

/** ISO date (YYYY-MM-DD) of a 1-based day of the year. */
export function dataDnia(rok: number, dzien: number): string {
  return new Date(Date.UTC(rok, 0, dzien)).toISOString().slice(0, 10)
}

/**
 * Fills missing days with values the user has from another source (inverter counter, notes). Only days that
 * are `null` are replaced and only with finite values ≥ 0; everything else is left untouched.
 */
export function uzupelnijDni(lata: RokHistorii[], wpisy: { rok: number; dzien: number; wartosc: number }[]): RokHistorii[] {
  return lata.map((r) => {
    const tegoRoku = wpisy.filter((w) => w.rok === r.rok && Number.isFinite(w.wartosc) && w.wartosc >= 0)
    if (tegoRoku.length === 0) return r
    const dni = [...r.dni]
    for (const w of tegoRoku) if (dni[w.dzien - 1] === null) dni[w.dzien - 1] = w.wartosc
    return { rok: r.rok, dni }
  })
}
