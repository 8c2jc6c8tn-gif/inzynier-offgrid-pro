/**
 * Obsługiwane języki UI — docs/standards/17-i18n.md, 17.4 (korekta offline-first: zero cookie,
 * zero zależności od serwera — ten projekt ma twardy wymóg offline, "off-grid" w nazwie). Plik
 * bez zależności od DOM/`localStorage`, żeby był bezpieczny do importu z Client Components i
 * z czystego JS skryptu pre-paint w app/layout.tsx (patrz lib/i18n/storage.ts).
 */

export const SUPPORTED_LANGUAGES = ["pl", "en", "ru"] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = "pl"

export const LANGUAGE_LABELS: Record<Language, string> = {
  pl: "Polski",
  en: "English",
  ru: "Русский",
}

export function isLanguage(value: string | null | undefined): value is Language {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

/**
 * Pierwsza wizyta, zanim cookie w ogóle istnieje — 17.4a (doprecyzowanie 16.09.2026): nagłówek
 * HTTP `Accept-Language`, nie `navigator.language` (to drugie ma dokładnie ten sam problem
 * widoczności co `localStorage` — czytane po stronie klienta, niewidoczne przy pierwszym renderze).
 *
 * Uproszczenie świadome: bierzemy języki w kolejności podanej w nagłówku, nie sortujemy pełnym
 * RFC 4647 wg wag `q` — w praktyce przeglądarki i tak wysyłają nagłówek w kolejności preferencji.
 * Wybór UI, nie fakt bezpieczeństwa — nie wymaga pełnej precyzji normy.
 */
export function negocjujJezyk(naglowekAcceptLanguage: string | null | undefined): Language {
  if (!naglowekAcceptLanguage) return DEFAULT_LANGUAGE
  const kandydaci = naglowekAcceptLanguage
    .split(",")
    .map((czesc) => czesc.split(";")[0]!.trim().toLowerCase().split("-")[0])
  for (const kandydat of kandydaci) {
    if (isLanguage(kandydat)) return kandydat
  }
  return DEFAULT_LANGUAGE
}
