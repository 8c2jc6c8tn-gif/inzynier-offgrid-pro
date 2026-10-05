import type { ProbkaTelemetrii } from "./probka"

/** One calendar year of daily energy [kWh/day] from 1 January; `null` = a day not fully covered by samples. */
export type RokEnergii = { rok: number; dni: (number | null)[] }

type DataLokalna = { r: number; m: number; d: number }

function formater(strefa: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: strefa,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
}

/** Offset [ms] of the zone at instant `t` (local wall clock − UTC). */
function przesuniecie(f: Intl.DateTimeFormat, t: number): number {
  const c: Record<string, number> = {}
  for (const p of f.formatToParts(new Date(t))) if (p.type !== "literal") c[p.type] = Number(p.value)
  return Date.UTC(c.year!, c.month! - 1, c.day!, c.hour!, c.minute!, c.second!) - Math.floor(t / 1000) * 1000
}

function dataLokalna(f: Intl.DateTimeFormat, t: number): DataLokalna {
  const l = new Date(t + przesuniecie(f, t))
  return { r: l.getUTCFullYear(), m: l.getUTCMonth(), d: l.getUTCDate() }
}

/** Instant of local midnight starting the given date (two-pass offset; zones switch DST away from midnight). */
function poczatekDnia(f: Intl.DateTimeFormat, { r, m, d }: DataLokalna): number {
  const utc = Date.UTC(r, m, d)
  return utc - przesuniecie(f, utc - przesuniecie(f, utc))
}

const nastepny = ({ r, m, d }: DataLokalna): DataLokalna => {
  const n = new Date(Date.UTC(r, m, d + 1))
  return { r: n.getUTCFullYear(), m: n.getUTCMonth(), d: n.getUTCDate() }
}
const dzienRoku = ({ r, m, d }: DataLokalna) => Math.round((Date.UTC(r, m, d) - Date.UTC(r, 0, 1)) / 86_400_000)

/**
 * Daily energy [kWh] of one power channel (e.g. the PV inverter output) for the M7/E2 history (owner decision
 * 05.10.2026: telemetry has to feed the history). Energy is integrated with trapezoids between consecutive valid
 * power samples whose gap is at most `maxPrzerwaMs` — the user's limit, as in `podsumujSerie`; a longer gap is
 * unknown, never bridged. A pair crossing local midnight is split at midnight with the linearly interpolated power.
 *
 * A day gets a value only when such pairs cover all of it (23/24/25 h in the time zone `strefa`); otherwise it is
 * `null` (missing), so a logger that sleeps at night yields missing days rather than a guessed night of zero.
 * PV production cannot be negative: a negative day total (standby draw logged on the same channel) becomes 0.
 * Years run from 1 January to the last day with any covered time; days before the first sample are `null`.
 */
export function dobowaEnergiaKwh(probki: ProbkaTelemetrii[], maxPrzerwaMs: number, strefa: string): RokEnergii[] {
  if (!(maxPrzerwaMs > 0)) return []
  const f = formater(strefa)
  const ok = probki
    .filter((p) => p.wielkosc === "moc" && p.jakosc === "ok" && p.wartosc !== null)
    .sort((a, b) => a.czas - b.czas)

  const dni = new Map<string, { data: DataLokalna; pokrycieMs: number; energiaWh: number }>()
  const klucz = (x: DataLokalna) => `${x.r}-${x.m}-${x.d}`
  const dodaj = (data: DataLokalna, ms: number, wh: number) => {
    const k = klucz(data)
    const z = dni.get(k)
    if (z) {
      z.pokrycieMs += ms
      z.energiaWh += wh
    } else dni.set(k, { data, pokrycieMs: ms, energiaWh: wh })
  }

  for (let i = 1; i < ok.length; i++) {
    const t0 = ok[i - 1]!.czas
    const p0 = ok[i - 1]!.wartosc as number
    const tb = ok[i]!.czas
    const pb = ok[i]!.wartosc as number
    if (tb - t0 > maxPrzerwaMs || tb === t0) continue
    let ta = t0
    let pa = p0
    let data = dataLokalna(f, ta)
    for (;;) {
      const koniec = poczatekDnia(f, nastepny(data))
      if (tb <= koniec) {
        dodaj(data, tb - ta, ((pa + pb) / 2) * ((tb - ta) / 3_600_000))
        break
      }
      const pk = p0 + ((pb - p0) * (koniec - t0)) / (tb - t0)
      dodaj(data, koniec - ta, ((pa + pk) / 2) * ((koniec - ta) / 3_600_000))
      ta = koniec
      pa = pk
      data = nastepny(data)
    }
  }

  const lata = new Map<number, (number | null)[]>()
  for (const { data, pokrycieMs, energiaWh } of dni.values()) {
    const dlugosc = poczatekDnia(f, nastepny(data)) - poczatekDnia(f, data)
    const tab = lata.get(data.r) ?? []
    const i = dzienRoku(data)
    while (tab.length <= i) tab.push(null)
    tab[i] = pokrycieMs >= dlugosc ? Math.max(0, energiaWh) / 1000 : null
    lata.set(data.r, tab)
  }
  return [...lata.entries()].sort((a, b) => a[0] - b[0]).map(([rok, d]) => ({ rok, dni: d }))
}
