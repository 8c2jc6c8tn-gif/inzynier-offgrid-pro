"use client"

import { useSyncExternalStore } from "react"
import { getServerSnapshot, getSnapshot, subscribe, zapiszTryb, type ThemeMode } from "@/lib/theme/storage"

const KOLEJNOSC: ThemeMode[] = ["system", "light", "dark"]

const ETYKIETA: Record<ThemeMode, { ikona: string; opis: string }> = {
  system: { ikona: "🖥️", opis: "Motyw: systemowy" },
  light: { ikona: "☀️", opis: "Motyw: jasny" },
  dark: { ikona: "🌙", opis: "Motyw: ciemny" },
}

export function ThemeToggle() {
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
      title={`${opis} — kliknij, by zmienić`}
      aria-label={`${opis}. Kliknij, by przełączyć na kolejny motyw.`}
      className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted"
    >
      {ikona}
    </button>
  )
}
