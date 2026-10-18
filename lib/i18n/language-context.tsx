"use client"

/**
 * Kontekst języka dla Client Components — docs/standards/17-i18n.md, 17.4 (korekta offline-first:
 * zero cookie, zero zależności od serwera). Źródłem prawdy jest lib/i18n/storage.ts
 * (`useSyncExternalStore` + `localStorage`, ten sam wzorzec co lib/theme/storage.ts) — ten
 * kontekst tylko udostępnia rozwiązaną wartość przez Reacta, żeby `useTranslate()`/`useLanguage()`
 * nie musiały wywoływać `useSyncExternalStore` w każdym z ~130 miejsc użycia.
 */
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { DEFAULT_LANGUAGE, type Language } from "./language"
import { getServerSnapshot, getSnapshot, subscribe } from "./storage"
import { formatujLiczbe } from "./liczby"
import { t } from "./t"
import { kursEfektywny, symbolWaluty } from "@/lib/waluta/przelicz"
import { getServerSnapshot as walutaServer, getSnapshot as walutaSnapshot, subscribe as walutaSubscribe } from "@/lib/waluta/storage"
import { WALUTA_BAZOWA } from "@/lib/waluta/waluty"

const LanguageContext = createContext<Language>(DEFAULT_LANGUAGE)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
}

export function useLanguage(): Language {
  return useContext(LanguageContext)
}

/** Symbol of the currency the user displays money in (PLN when the chosen currency has no known rate yet — same rule as `useZl`). */
export function useSymbolWaluty(): string {
  const language = useLanguage()
  const stan = useSyncExternalStore(walutaSubscribe, walutaSnapshot, walutaServer)
  const { kod, narzutProc, reczne } = stan.preferencja
  const kurs = kursEfektywny(kod, stan.kursy?.kursy ?? {}, reczne, narzutProc)
  return symbolWaluty(kurs === null ? WALUTA_BAZOWA : kod, language)
}

/**
 * `stalaPln = true` pins `{waluta}` to „zł” — for Polish-market screens (OSD tariffs, URE fees,
 * prosumer deposit) whose data and amounts are legally PLN whatever display currency is chosen.
 */
export function useTranslate(stalaPln = false) {
  const language = useLanguage()
  const symbol = useSymbolWaluty()
  const waluta = stalaPln ? "zł" : symbol
  return useCallback(
    (kod: string, params?: Record<string, string | number>) => t(language, kod, { waluta, ...params }),
    [language, waluta],
  )
}

/** Number formatter bound to the UI language (replaces `x.toLocaleString("pl-PL", …)` in screens). */
export function useFormatLiczby() {
  const language = useLanguage()
  return useCallback((x: number, opcje?: Intl.NumberFormatOptions) => formatujLiczbe(x, language, opcje), [language])
}

/** The usual roundings of screens, bound to the UI language: `f0`…`f3` = at most 0…3 decimal places (stable between renders). */
export function useFormaty() {
  const formatLiczbe = useFormatLiczby()
  return useMemo(
    () => ({
      f0: (x: number) => formatLiczbe(x, { maximumFractionDigits: 0 }),
      f1: (x: number) => formatLiczbe(x, { maximumFractionDigits: 1 }),
      f2: (x: number) => formatLiczbe(x, { maximumFractionDigits: 2 }),
      f3: (x: number) => formatLiczbe(x, { maximumFractionDigits: 3 }),
    }),
    [formatLiczbe],
  )
}
