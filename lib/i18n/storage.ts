/**
 * Preferencja języka UI — docs/standards/17-i18n.md, 17.4 (korekta offline-first: zero cookie,
 * zero zależności od serwera dla projektu z twardym wymogiem offline — ten projekt, "off-grid"
 * w nazwie). Ten sam wzorzec co lib/theme/storage.ts/lib/wyglad/storage.ts/lib/pulpit/storage.ts —
 * `useSyncExternalStore` (nie `useState`+`useEffect`, żeby uniknąć react-hooks/set-state-in-effect
 * i, ważniej tutaj, żeby hydracja korzystała z `getServerSnapshot()` bez ostrzeżeń mismatch).
 *
 * Pierwsza wizyta, brak zapisanej preferencji — `navigator.languages`, nigdy `Accept-Language`
 * (nagłówek HTTP jest niewidoczny bez serwera renderującego per żądanie — dokładnie tej
 * zależności ta korekta 17.4 się pozbywa).
 */

import { consoleReporter } from "@/lib/core/reporter"
import { DEFAULT_LANGUAGE, isLanguage, negocjujJezyk, type Language } from "./language"

export const STORAGE_KEY = "offgrid.jezyk.v1"
const CHANGE_EVENT = "offgrid-jezyk-change"

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się odczytać zapisanego języka — pokazany domyślny.",
      technicalDetails: `localStorage.getItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/i18n/storage.odczytajRaw",
      cause: err,
    })
    return null
  }
}

function wykryjJezykPrzegladarki(): Language {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE
  const lista = navigator.languages && navigator.languages.length ? navigator.languages.join(",") : navigator.language
  return negocjujJezyk(lista)
}

function zastosujJezyk(jezyk: Language): void {
  if (typeof document === "undefined") return
  document.documentElement.lang = jezyk
}

let cache: { raw: string | null; jezyk: Language } | null = null

export function getSnapshot(): Language {
  const raw = odczytajRaw()
  if (cache && cache.raw === raw) return cache.jezyk
  const jezyk = isLanguage(raw) ? raw : wykryjJezykPrzegladarki()
  cache = { raw, jezyk }
  return jezyk
}

export function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zapiszJezyk(jezyk: Language): void {
  if (typeof window === "undefined") return
  zastosujJezyk(jezyk)
  try {
    window.localStorage.setItem(STORAGE_KEY, jezyk)
  } catch (err) {
    // localStorage niedostępny (tryb prywatny itp.) — wybór nie zostanie zapamiętany,
    // ale język i tak jest zastosowany na tę sesję (drobna preferencja UI, nie błąd krytyczny).
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać wyboru języka — zmiana obowiązuje tylko w tej sesji.",
      technicalDetails: `localStorage.setItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/i18n/storage.zapiszJezyk",
      cause: err,
    })
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
