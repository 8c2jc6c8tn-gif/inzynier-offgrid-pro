/**
 * Currency of each money field (owner decisions 24.11.2026): the currency chosen in Settings is the WORKING currency — every
 * result and sum is in it. Each amount keeps the currency it was typed in (by default the working currency; in lists each row
 * on its own); an amount in another currency is converted to the working one at the NBP average rate (table A), and the
 * conversion is shown next to the field. Changing the working currency no longer rewrites typed amounts.
 *
 * Paths: a flat field is its name (`cenaBateriiZl`); a field of list rows is `list.*.field` in the screen's declaration and
 * `list.<row id>.field` for one row (rows must have a string `id`). Pure functions — the hook stores their results.
 */
import { WALUTA_BAZOWA, type KodWaluty } from "./waluty"

/** Concrete path → currency of the amount typed there. A path without an entry has no amount yet. */
export type WalutyPol = Partial<Record<string, KodWaluty>>

/** Rate of a currency in units per 1 PLN (`kursEfektywny`), `null` when unknown. */
export type KursOd = (kod: KodWaluty) => number | null

/** Amount in `z` → the same value in `na` (both rates are per 1 PLN, so the conversion goes through PLN). */
export function przeliczMiedzyWalutami(kwota: number, z: KodWaluty, na: KodWaluty, kurs: KursOd): number | null {
  if (z === na) return kwota
  const kz = z === WALUTA_BAZOWA ? 1 : kurs(z)
  const kn = na === WALUTA_BAZOWA ? 1 : kurs(na)
  if (kz === null || kn === null || !(kz > 0) || !(kn > 0)) return null
  return (kwota / kz) * kn
}

type Rekord = Record<string, unknown>

function obiekt(v: unknown): v is Rekord {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/** Every concrete path of the declared paths in this state (list rows expanded by their `id`). */
export function sciezkiKonkretne(stan: unknown, deklarowane: readonly string[]): string[] {
  const wynik: string[] = []
  for (const d of deklarowane) {
    const czesci = d.split(".")
    const idz = (v: unknown, i: number, prefiks: string[]) => {
      if (i === czesci.length) {
        wynik.push(prefiks.join("."))
        return
      }
      const c = czesci[i]!
      if (c === "*") {
        if (!Array.isArray(v)) return
        for (const w of v) if (obiekt(w) && typeof w.id === "string") idz(w, i + 1, [...prefiks, w.id])
      } else if (obiekt(v)) idz(v[c], i + 1, [...prefiks, c])
    }
    idz(stan, 0, [])
  }
  return wynik
}

/** Value at a concrete path (`list.<id>.field` finds the row by its `id`); `undefined` when absent. */
export function wartoscSciezki(stan: unknown, sciezka: string): unknown {
  let v: unknown = stan
  for (const c of sciezka.split(".")) {
    if (Array.isArray(v)) v = v.find((w) => obiekt(w) && w.id === c)
    else if (obiekt(v)) v = v[c]
    else return undefined
  }
  return v
}

const pusta = (v: unknown) => v === undefined || v === null || (typeof v === "string" && v.trim() === "")

/**
 * Currencies after the state changed: an amount typed where there was none gets the working currency at that moment; a path
 * that disappeared or was cleared loses its entry. Returns the same object when nothing changed.
 */
export function walutyPoZmianie(stan: unknown, deklarowane: readonly string[], waluty: WalutyPol, robocza: KodWaluty): WalutyPol {
  let nowe: WalutyPol | null = null
  const obecne = new Set(sciezkiKonkretne(stan, deklarowane))
  for (const s of obecne) {
    const pustaWartosc = pusta(wartoscSciezki(stan, s))
    if (!pustaWartosc && waluty[s] === undefined) (nowe ??= { ...waluty })[s] = robocza
    if (pustaWartosc && waluty[s] !== undefined) delete (nowe ??= { ...waluty })[s]
  }
  for (const s of Object.keys(waluty)) if (!obecne.has(s)) delete (nowe ??= { ...waluty })[s]
  return nowe ?? waluty
}

/**
 * Drafts saved before 3.55.0 have no per-field currencies: their amounts are in the currency the whole draft was denominated
 * in (the old `draftwaluta` marker, PLN when absent).
 */
export function walutyZeStaregoSzkicu(stan: unknown, deklarowane: readonly string[], denominacja: KodWaluty): WalutyPol {
  return walutyPoZmianie(stan, deklarowane, {}, denominacja)
}

/** Number typed in a field (`"2,5"` → 2.5); `null` when empty or not a number. */
export function liczbaKwoty(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null
  if (typeof v !== "string" || v.trim() === "") return null
  const x = Number(v.trim().replace(",", "."))
  return Number.isFinite(x) ? x : null
}

/**
 * The state with every declared amount converted to `cel` (text fields stay text, rounded to 6 significant digits). An amount
 * whose rate is unknown becomes empty — the calculator then reports missing data instead of computing with a wrong currency.
 */
export function stanWWalucie<T>(stan: T, deklarowane: readonly string[], waluty: WalutyPol, cel: KodWaluty, kurs: KursOd): T {
  const sciezki = sciezkiKonkretne(stan, deklarowane).filter((s) => waluty[s] !== undefined && waluty[s] !== cel)
  if (sciezki.length === 0) return stan
  const kopia = structuredClone(stan) as unknown
  for (const s of sciezki) {
    const czesci = s.split(".")
    let rodzic: unknown = kopia
    for (const c of czesci.slice(0, -1)) rodzic = Array.isArray(rodzic) ? rodzic.find((w) => obiekt(w) && w.id === c) : obiekt(rodzic) ? rodzic[c] : undefined
    if (!obiekt(rodzic)) continue
    const pole = czesci[czesci.length - 1]!
    const x = liczbaKwoty(rodzic[pole])
    if (x === null) continue
    const p = przeliczMiedzyWalutami(x, waluty[s]!, cel, kurs)
    const zaokr = p === null ? null : Number(p.toPrecision(6))
    rodzic[pole] = typeof rodzic[pole] === "number" ? (zaokr ?? Number.NaN) : zaokr === null ? "" : String(zaokr)
  }
  return kopia as T
}

/** Sum of amounts per currency (for the „1 200 € + 3 400 zł” breakdown under a total). */
export function rozbiciePoWalutach(stan: unknown, deklarowane: readonly string[], waluty: WalutyPol): Partial<Record<KodWaluty, number>> {
  const wynik: Partial<Record<KodWaluty, number>> = {}
  for (const s of sciezkiKonkretne(stan, deklarowane)) {
    const kod = waluty[s]
    const x = liczbaKwoty(wartoscSciezki(stan, s))
    if (kod && x !== null) wynik[kod] = (wynik[kod] ?? 0) + x
  }
  return wynik
}
