"use client"

import { useSyncExternalStore } from "react"
import { Ikona, IKONA, type NazwaIkony } from "@/components/ui/ikona"
import { getServerSnapshot, getSnapshot, subscribe, zapiszTryb, type ThemeMode } from "@/lib/theme/storage"
import { useTranslate } from "@/lib/i18n/language-context"

const KOLEJNOSC: ThemeMode[] = ["system", "light", "dark"]

const ETYKIETA: Record<ThemeMode, { ikona: NazwaIkony; opis: string }> = {
  system: { ikona: IKONA.monitor, opis: "UI-THETOG-MOTYW-SYSTEMOWY" },
  light: { ikona: IKONA.sun, opis: "UI-THETOG-MOTYW-JASNY" },
  dark: { ikona: IKONA.moon, opis: "UI-THETOG-MOTYW-CIEMNY" },
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
      <Ikona nazwa={ikona} className="size-4" />
    </button>
  )
}
