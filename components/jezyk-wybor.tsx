"use client"

/**
 * Przełącznik języka UI (Ustawienia) — docs/standards/17-i18n.md, 17.4. Zapisuje wybór do cookie
 * `jezyk` (nie `localStorage` — apka ma SSR, patrz uzasadnienie w lib/i18n/language.ts) i odświeża
 * drzewo Server Components (`router.refresh()`), żeby kolejny render poszedł już w nowym języku —
 * cookie, nie kontekst kliencki, jest tu źródłem prawdy (LanguageProvider tylko go odzwierciedla).
 */
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/language"
import { useLanguage } from "@/lib/i18n/language-context"
import { ustawCookieJezyka } from "@/lib/i18n/client-language"
import { cn } from "@/lib/utils"

export function JezykWybor() {
  const jezyk = useLanguage()
  const router = useRouter()
  const [odswiezaSie, startTransition] = useTransition()

  function wybierz(nastepny: Language) {
    if (nastepny === jezyk) return
    ustawCookieJezyka(nastepny)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Wybór języka">
      {SUPPORTED_LANGUAGES.map((kod) => (
        <button
          key={kod}
          type="button"
          role="radio"
          aria-checked={jezyk === kod}
          onClick={() => wybierz(kod)}
          disabled={odswiezaSie}
          className={cn(
            "min-h-9 rounded-md border px-3 text-sm",
            jezyk === kod ? "border-primary bg-muted" : "hover:bg-muted",
          )}
        >
          {LANGUAGE_LABELS[kod]}
        </button>
      ))}
    </div>
  )
}
