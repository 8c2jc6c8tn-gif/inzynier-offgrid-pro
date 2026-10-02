/** Pure currency conversion and formatting (no DOM, no storage). Rates: units of X per 1 PLN. */
import type { Language } from "@/lib/i18n/language"
import { WALUTA_BAZOWA, type KodWaluty } from "./waluty"

export type Kursy = Partial<Record<string, number>>

const LOCALE: Record<Language, string> = { pl: "pl-PL", en: "en-GB", ru: "ru-RU" }

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
