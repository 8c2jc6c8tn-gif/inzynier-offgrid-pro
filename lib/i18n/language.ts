/**
 * Obsługiwane języki UI — docs/standards/17-i18n.md, 17.4/17.4a. Plik bez zależności od
 * `next/headers`/DOM, żeby był bezpieczny do importu zarówno z Server, jak i Client Components,
 * oraz z middleware (Edge runtime).
 */

export const SUPPORTED_LANGUAGES = ["pl", "en", "ru"] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = "pl"

export const LANGUAGE_LABELS: Record<Language, string> = {
  pl: "Polski",
  en: "English",
  ru: "Русский",
}

/**
 * Cookie, nie `localStorage` — 17.4 (poprawka 16.09.2026): apka ma SSR (Next.js App Router),
 * `localStorage` jest niewidoczny przy pierwszym renderze serwera, więc serwer wysyłałby HTML
 * w złym języku przy każdym twardym przeładowaniu. Zwykłe cookie (nie `HttpOnly` — inny
 * przypadek niż token sesji 18.5, JS przełącznika języka musi je czytać/zapisywać).
 */
export const LANGUAGE_COOKIE = "jezyk"

/** 365 dni — ta sama preferencja co inne "drobne ustawienia UI" (theme/wyglad), nie sesja. */
export const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

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
