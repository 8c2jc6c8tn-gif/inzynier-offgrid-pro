"use client"

import { useSyncExternalStore } from "react"
import { getServerSnapshot, getSnapshot, subscribe, zapiszTryb, type ThemeMode } from "@/lib/theme/storage"
import { useTranslate } from "@/lib/i18n/language-context"

const KOLEJNOSC: ThemeMode[] = ["system", "light", "dark"]

const ETYKIETA: Record<ThemeMode, { ikona: string; opis: string }> = {
  system: { ikona: "🖥️", opis: "UI-THETOG-MOTYW-SYSTEMOWY" },
  light: { ikona: "☀️", opis: "UI-THETOG-MOTYW-JASNY" },
  dark: { ikona: "🌙", opis: "UI-THETOG-MOTYW-CIEMNY" },
}

export function ThemeToggle() {
  const t = useTranslate()
  const tryb = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { ikona, opis } = ETYKIETA[tryb]

  function przelacz() {
    const nastepny = KOLEJNOSC[(KOLEJNOSC.indexOf(tryb) + 1) % KOLEJNOSC.length]
    zapiszTryb(nastepny)
  }

  return (
    <button
      type="button"
      onClick={przelacz}
      title={t("UI-THETOG-KLIKNIJ-ZMIENIC", { opis: t(opis) })}
      aria-label={t("UI-THETOG-KLIKNIJ-PRZELACZYC-KOLEJNY", { opis: t(opis) })}
      className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted"
    >
      {ikona}
    </button>
  )
}
