"use client"

/**
 * Kontekst języka dla Client Components — docs/standards/17-i18n.md, 17.4 (korekta offline-first:
 * zero cookie, zero zależności od serwera). Źródłem prawdy jest lib/i18n/storage.ts
 * (`useSyncExternalStore` + `localStorage`, ten sam wzorzec co lib/theme/storage.ts) — ten
 * kontekst tylko udostępnia rozwiązaną wartość przez Reacta, żeby `useTranslate()`/`useLanguage()`
 * nie musiały wywoływać `useSyncExternalStore` w każdym z ~130 miejsc użycia.
 */
import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react"
import { DEFAULT_LANGUAGE, type Language } from "./language"
import { getServerSnapshot, getSnapshot, subscribe } from "./storage"
import { t } from "./t"

const LanguageContext = createContext<Language>(DEFAULT_LANGUAGE)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
}

export function useLanguage(): Language {
  return useContext(LanguageContext)
}

export function useTranslate() {
  const language = useLanguage()
  return useCallback(
    (kod: string, params?: Record<string, string | number>) => t(language, kod, params),
    [language],
  )
}
