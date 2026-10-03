import { kluczSerii } from "./jakosc"
import type { ProbkaTelemetrii, Wielkosc } from "./probka"

export interface PodsumowanieSerii {
  kanal: string
  wielkosc: Wielkosc
  liczbaProbek: number
  /** Samples that did not count (missing or out of the sensor range). */
  pominiete: number
  min: number | null
  max: number | null
  srednia: number | null
  /** Energy in Wh integrated from power (trapezoids); null for other quantities or when no pair of samples qualified. */
  energiaWh: number | null
  /** Pairs of consecutive valid power samples skipped because their gap exceeded the limit given by the user. */
  pominieteLuki: number
}

/**
 * Per-series summary of a time range (Biblia 7.50). Only valid samples count; missing / out-of-range ones are
 * reported as `pominiete`, never as zero. Energy is integrated only between consecutive valid power samples whose
 * gap is at most `maxPrzerwaMs` — a limit that depends on the logger and comes from the user, so without it energy
 * stays null instead of bridging unknown gaps. Mean is the plain mean of samples (not time-weighted).
 */
export function podsumujSerie(probki: ProbkaTelemetrii[], maxPrzerwaMs: number | null): PodsumowanieSerii[] {
  const serie = new Map<string, ProbkaTelemetrii[]>()
  for (const p of probki) {
    const k = kluczSerii(p)
    const l = serie.get(k)
    if (l) l.push(p)
    else serie.set(k, [p])
  }
  const wynik: PodsumowanieSerii[] = []
  for (const lista of serie.values()) {
    const poprawne = lista.filter((p) => p.jakosc === "ok" && p.wartosc !== null).sort((a, b) => a.czas - b.czas)
    const wartosci = poprawne.map((p) => p.wartosc as number)
    let energiaWh: number | null = null
    let pominieteLuki = 0
    if (lista[0].wielkosc === "moc" && maxPrzerwaMs !== null && maxPrzerwaMs > 0) {
      for (let i = 1; i < poprawne.length; i++) {
        const dt = poprawne[i].czas - poprawne[i - 1].czas
        if (dt > maxPrzerwaMs) {
          pominieteLuki++
          continue
        }
        energiaWh = (energiaWh ?? 0) + (((poprawne[i].wartosc as number) + (poprawne[i - 1].wartosc as number)) / 2) * (dt / 3_600_000)
      }
    }
    wynik.push({
      kanal: lista[0].kanal,
      wielkosc: lista[0].wielkosc,
      liczbaProbek: poprawne.length,
      pominiete: lista.length - poprawne.length,
      min: wartosci.length ? Math.min(...wartosci) : null,
      max: wartosci.length ? Math.max(...wartosci) : null,
      srednia: wartosci.length ? wartosci.reduce((a, b) => a + b, 0) / wartosci.length : null,
      energiaWh,
      pominieteLuki,
    })
  }
  return wynik.sort((a, b) => (a.kanal + a.wielkosc).localeCompare(b.kanal + b.wielkosc))
}

/** CSV export of samples (Biblia 7.30): ISO time, channel, quantity, value in the canonical unit, quality. Missing = empty cell. */
export function probkiDoCsv(probki: ProbkaTelemetrii[]): string {
  const cell = (s: string) => (/[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  const wiersze = [...probki]
    .sort((a, b) => a.czas - b.czas)
    .map((p) => [new Date(p.czas).toISOString(), cell(p.kanal), p.wielkosc, p.wartosc === null ? "" : String(p.wartosc), p.jakosc].join(","))
  return ["czas,kanal,wielkosc,wartosc,jakosc", ...wiersze].join("\n") + "\n"
}
