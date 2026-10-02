"use client"

/**
 * Przełącznik języka UI (Ustawienia) — docs/standards/17-i18n.md, 17.4 (korekta offline-first).
 * Zapisuje wybór do `localStorage` (lib/i18n/storage.ts) — brak cookie/serwera, więc zmiana jest
 * natychmiastowa (bez router.refresh()); LanguageProvider odzwierciedla ją przez
 * useSyncExternalStore od razu po zapisie.
 */
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/language"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { zapiszJezyk } from "@/lib/i18n/storage"
import { cn } from "@/lib/utils"

export function JezykWybor() {
  const t = useTranslate()
  const jezyk = useLanguage()

  function wybierz(nastepny: Language) {
    if (nastepny === jezyk) return
    zapiszJezyk(nastepny)
  }

  return (
    <div className="flex gap-2" role="radiogroup" aria-label={t("UI-JEZWYB-WYBOR-JEZYKA")}>
      {SUPPORTED_LANGUAGES.map((kod) => (
        <button
          key={kod}
          type="button"
          role="radio"
          aria-checked={jezyk === kod}
          onClick={() => wybierz(kod)}
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
