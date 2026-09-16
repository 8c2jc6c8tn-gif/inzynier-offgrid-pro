"use client"

/**
 * Kontekst języka dla Client Components — wartość początkowa przychodzi z `app/layout.tsx`
 * (Server Component, czyta cookie `jezyk` przez `getServerLanguage()`), więc pierwszy render
 * po stronie klienta jest już w poprawnym języku, bez migotania (docs/standards/17-i18n.md, 17.4).
 */
import { createContext, useCallback, useContext, type ReactNode } from "react"
import { DEFAULT_LANGUAGE, type Language } from "./language"
import { t } from "./t"

const LanguageContext = createContext<Language>(DEFAULT_LANGUAGE)

export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
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
