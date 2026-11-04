/**
 * Registry of the loaded dictionaries. The Polish one (default language, what the server renders and the first client
 * render shows) is in the common bundle; English and Russian are separate chunks loaded when the user's language needs
 * them (≈ 640 KB gzipped saved on every page for a Polish user). The chunks are part of the Service Worker precache
 * (the whole `.next/static` is), so switching the language works offline.
 *
 * `t()` stays synchronous: callers either run after `LanguageProvider` has made sure the language is loaded, or
 * `await zaladujJezyk(...)` first (server metadata). Tests and scripts register everything at once (`dictionaries.ts`).
 */
import { slownikPl } from "./slownik-pl"
import { DEFAULT_LANGUAGE, type Language } from "./language"
import { consoleReporter } from "@/lib/core/reporter"

export type Slownik = Record<string, string>

const zaladowane = new Map<Language, Slownik>([[DEFAULT_LANGUAGE, slownikPl]])
const wToku = new Map<Language, Promise<void>>()
const sluchacze = new Set<() => void>()

const LADUJ: Record<"en" | "ru", () => Promise<Slownik>> = {
  en: () => import("./slownik-en").then((m) => m.slownikEn),
  ru: () => import("./slownik-ru").then((m) => m.slownikRu),
}

function powiadom() {
  sluchacze.forEach((s) => s())
}

/** Dictionary of the language, or `undefined` while its chunk has not arrived. */
export function slownik(language: Language): Slownik | undefined {
  return zaladowane.get(language)
}

export function czyZaladowany(language: Language): boolean {
  return zaladowane.has(language)
}

/** Registers a dictionary directly (tests, scripts, a server that has everything at hand). */
export function zarejestrujSlownik(language: Language, tresci: Slownik): void {
  zaladowane.set(language, tresci)
  powiadom()
}

/**
 * Loads the dictionary of the language (once). A failed chunk request (offline without precache, a lost connection)
 * is reported and forgotten, so the next call retries; the UI keeps showing the Polish texts meanwhile.
 */
export function zaladujJezyk(language: Language): Promise<void> {
  if (zaladowane.has(language)) return Promise.resolve()
  const trwa = wToku.get(language)
  if (trwa) return trwa
  const loader = LADUJ[language as "en" | "ru"]
  const obietnica = loader()
    .then((tresci) => {
      zaladowane.set(language, tresci)
      wToku.delete(language)
      powiadom()
    })
    .catch((err: unknown) => {
      wToku.delete(language)
      consoleReporter.reportError({
        userMessage: "Nie udało się wczytać tłumaczeń — pokazany język polski.",
        technicalDetails: `Wczytanie słownika "${language}" nie powiodło się.`,
        source: "lib/i18n/rejestr-slownikow.zaladujJezyk",
        cause: err,
      })
    })
  wToku.set(language, obietnica)
  return obietnica
}

export function subskrybujSlowniki(cb: () => void): () => void {
  sluchacze.add(cb)
  return () => {
    sluchacze.delete(cb)
  }
}
