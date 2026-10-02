"use client"

import { useSyncExternalStore } from "react"
import {
  CZCIONKI,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  ustawCzcionke,
  ustawWage,
} from "@/lib/wyglad/storage"
import { cn } from "@/lib/utils"
import { useTranslate } from "@/lib/i18n/language-context"

/** Font preview sample — `UI-CZCEDY-PANGRAM` key (per-language sample text), render through `t()`. */
const PANGRAM = "UI-CZCEDY-PANGRAM"
const zmiennaCss = (zmienna: string) => `var(${zmienna})`

export function CzcionkaEdytor() {
  const t = useTranslate()
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{t("UI-CZCEDY-CZCIONKA")}</span>
        <div className="flex flex-col gap-2">
          {CZCIONKI.map((c) => (
            <label
              key={c.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md border p-3",
                stan.czcionka === c.id && "border-primary",
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="czcionka"
                  checked={stan.czcionka === c.id}
                  onChange={() => ustawCzcionke(c.id)}
                />
                <span className="text-sm text-muted-foreground">{c.etykieta}</span>
              </span>
              <span style={{ fontFamily: zmiennaCss(c.zmienna) }} className="text-base">
                {t(PANGRAM)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{t("UI-CZCEDY-WAGA-TEKSTU")}</span>
        <div className="flex gap-2">
          {(["normalna", "pogrubiona"] as const).map((waga) => (
            <button
              key={waga}
              type="button"
              onClick={() => ustawWage(waga)}
              className={cn(
                "min-h-9 rounded-md border px-3 text-sm capitalize",
                stan.waga === waga ? "border-primary bg-muted" : "hover:bg-muted",
              )}
            >
              {waga}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
