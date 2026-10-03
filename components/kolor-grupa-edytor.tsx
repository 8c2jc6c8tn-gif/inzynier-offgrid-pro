"use client"

import { useState, useSyncExternalStore } from "react"
import {
  getServerSnapshot,
  getSnapshot,
  GRUPY_KOLOROW,
  subscribe,
  type GrupaKolorow,
  ustawKolor,
  ustawKoloryGrupowo,
  usunKolor,
  przywrocDomyslneKolory,
} from "@/lib/wyglad/storage"
import { cn } from "@/lib/utils"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Edytor kolorów — pojedynczo (swatch + HEX per grupa) albo grupowo (zaznacz kilka grup, wybierz
 * jeden kolor, zastosuj naraz do wszystkich). Renderowany zarówno w /ustawienia jak i /wzornik
 * (ten sam komponent — patrz docs/brief-dla-v0.md, "szablon per wzorzec, nie ekran per ekran").
 */
export function KolorGrupaEdytor() {
  const t = useTranslate()
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [zaznaczone, setZaznaczone] = useState<GrupaKolorow[]>([])
  const [kolorGrupowy, setKolorGrupowy] = useState("#3366ff")

  function przelaczZaznaczenie(id: GrupaKolorow) {
    setZaznaczone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {GRUPY_KOLOROW.map((grupa) => {
          const aktualny = stan.kolory[grupa.id]
          return (
            <li
              key={grupa.id}
              className="flex flex-wrap items-center gap-3 rounded-md border p-3 text-sm"
            >
              <input
                type="checkbox"
                checked={zaznaczone.includes(grupa.id)}
                onChange={() => przelaczZaznaczenie(grupa.id)}
                aria-label={t("UI-KOLGRUEDY-ZAZNACZ-ZMIANY-GRUPOWEJ", { etykieta: t(grupa.etykietaKey) })}
                className="h-4 w-4"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t(grupa.etykietaKey)}</p>
                <p className="text-xs text-muted-foreground">{t(grupa.opisKey)}</p>
              </div>
              <input
                type="color"
                value={aktualny ?? "#888888"}
                onChange={(e) => ustawKolor(grupa.id, e.target.value)}
                aria-label={t("UI-KOLGRUEDY-KOLOR", { etykieta: t(grupa.etykietaKey) })}
                className="h-8 w-10 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={aktualny ?? ""}
                placeholder={t("UI-KOLGRUEDY-DOMYSLNY")}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) ustawKolor(grupa.id, v)
                }}
                aria-label={t("UI-KOLGRUEDY-KOD-HEX", { etykieta: t(grupa.etykietaKey) })}
                className="min-h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
              {aktualny && (
                <button
                  type="button"
                  onClick={() => usunKolor(grupa.id)}
                  className="text-xs text-muted-foreground underline"
                >
                  {t("UI-KOLGRUEDY-RESET")}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed p-3 text-sm">
        <span className="font-medium">{t("UI-KOLGRUEDY-ZMIANA-GRUPOWA")}</span>
        <input
          type="color"
          value={kolorGrupowy}
          onChange={(e) => setKolorGrupowy(e.target.value)}
          aria-label={t("UI-KOLGRUEDY-KOLOR-ZASTOSOWANIA-GRUPOWO")}
          className="h-8 w-10 cursor-pointer rounded border"
        />
        <input
          type="text"
          value={kolorGrupowy}
          aria-label={t("UI-KOLGRUEDY-KOD-HEX-KOLORU")}
          onChange={(e) => {
            const v = e.target.value
            setKolorGrupowy(v)
          }}
          className="min-h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-xs"
        />
        <button
          type="button"
          disabled={zaznaczone.length === 0}
          onClick={() => ustawKoloryGrupowo(zaznaczone, kolorGrupowy)}
          className={cn(
            "min-h-8 rounded-md border px-3 text-xs font-medium",
            zaznaczone.length === 0 ? "opacity-40" : "hover:bg-muted",
          )}
        >
          {t("UI-KOLGRUEDY-ZASTOSUJ-ZAZNACZONYCH", { length: zaznaczone.length })}
        </button>
      </div>

      <button
        type="button"
        onClick={przywrocDomyslneKolory}
        className="min-h-9 self-start rounded-md border px-3 text-xs font-medium hover:bg-muted"
      >
        {t("UI-KOLGRUEDY-PRZYWROC-DOMYSLNE-KOLORY")}
      </button>
    </div>
  )
}
