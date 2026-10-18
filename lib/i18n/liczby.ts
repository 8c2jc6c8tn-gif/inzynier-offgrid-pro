/** Number formatting by UI language (docs/standards/17.12): one place for locale choice, no hardcoded `pl-PL` in screens. */
import type { Language } from "./language"

export const LOCALE_INTL: Record<Language, string> = { pl: "pl-PL", en: "en-GB", ru: "ru-RU" }

export function formatujLiczbe(x: number, jezyk: Language, opcje?: Intl.NumberFormatOptions): string {
  return x.toLocaleString(LOCALE_INTL[jezyk], opcje)
}

export function formatujDate(data: Date, jezyk: Language): string {
  return data.toLocaleDateString(LOCALE_INTL[jezyk])
}
