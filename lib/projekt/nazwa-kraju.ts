import type { Language } from "@/lib/i18n/language"
import { LOCALE_INTL } from "@/lib/i18n/liczby"

/** Country name in the UI language (the browser's own list, offline); the code when the browser has no name. */
export function nazwaKraju(kod: string, jezyk: Language): string {
  try {
    return new Intl.DisplayNames([LOCALE_INTL[jezyk]], { type: "region" }).of(kod) ?? kod
  } catch {
    return kod
  }
}
