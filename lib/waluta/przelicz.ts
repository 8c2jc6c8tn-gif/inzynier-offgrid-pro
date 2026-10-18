/** Pure currency conversion and formatting (no DOM, no storage). Rates: units of X per 1 PLN. */
import type { Language } from "@/lib/i18n/language"
import { LOCALE_INTL } from "@/lib/i18n/liczby"
import { WALUTA_BAZOWA, type KodWaluty } from "./waluty"

export type Kursy = Partial<Record<string, number>>

const LOCALE = LOCALE_INTL

/**
 * Effective rate for `kod`: a manual rate wins over the fetched one; `narzutProc` widens the rate
 * the way a card/exchange spread does (rate × (1 + p/100)). Returns null when no rate is known.
 */
export function kursEfektywny(kod: KodWaluty, pobrane: Kursy, reczne: Kursy, narzutProc: number): number | null {
  if (kod === WALUTA_BAZOWA) return 1
  const baza = reczne[kod] ?? pobrane[kod]
  if (baza === undefined || !Number.isFinite(baza) || baza <= 0) return null
  return baza * (1 + (Number.isFinite(narzutProc) ? narzutProc : 0) / 100)
}

export function przeliczZPln(kwotaPln: number, kurs: number): number {
  return kwotaPln * kurs
}

export function formatujKwote(kwota: number, kod: KodWaluty, jezyk: Language, cyfry = 0): string {
  return new Intl.NumberFormat(LOCALE[jezyk], {
    style: "currency",
    currency: kod,
    minimumFractionDigits: cyfry,
    maximumFractionDigits: cyfry,
  }).format(kwota)
}

/** Short symbol/label for unit strings (`zł/kWh` → `€/kWh`): PLN keeps the Polish „zł”, others use the narrow symbol, falling back to the code. */
export function symbolWaluty(kod: KodWaluty, jezyk: Language): string {
  if (kod === WALUTA_BAZOWA) return jezyk === "pl" ? "zł" : "PLN"
  const czesc = new Intl.NumberFormat(LOCALE[jezyk], { style: "currency", currency: kod, currencyDisplay: "narrowSymbol" })
    .formatToParts(0)
    .find((c) => c.type === "currency")
  return czesc?.value ?? kod
}

/** Currency a stored amount is denominated in, with the effective rate (units per 1 PLN) it was converted at. */
export interface DenominacjaKwot {
  kod: KodWaluty
  kurs: number
  /** ECB date of the rate (`null` for a manual rate or PLN). */
  dataEcb: string | null
  reczny: boolean
  narzutProc: number
}

/** Factor that turns an amount in `z` into the same value in `na` (via PLN). */
export function wspolczynnikPrzeliczenia(z: Pick<DenominacjaKwot, "kurs">, na: Pick<DenominacjaKwot, "kurs">): number {
  return na.kurs / z.kurs
}

/** Converts one numeric form string; empty / non-numeric text stays untouched (the user's own text is never invented). */
export function przeliczPoleTekst(tekst: string, wspolczynnik: number): string {
  if (tekst.trim() === "") return tekst
  const x = Number(tekst.replace(",", "."))
  if (!Number.isFinite(x)) return tekst
  return String(Number((x * wspolczynnik).toPrecision(6)))
}

/**
 * Builds a draft converter for flat form state: multiplies the listed string fields.
 * Nested state (rows, lists) writes its own converter and may reuse `przeliczPoleTekst`.
 */
export function przeliczPola<T>(...klucze: (keyof T)[]): (stan: T, wspolczynnik: number) => T {
  return (stan, wspolczynnik) => {
    const kopia = { ...stan } as Record<keyof T, unknown>
    for (const k of klucze) {
      const v = kopia[k]
      if (typeof v === "string") kopia[k] = przeliczPoleTekst(v, wspolczynnik)
      else if (typeof v === "number") kopia[k] = Number((v * wspolczynnik).toPrecision(6))
    }
    return kopia as T
  }
}
