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

const PANGRAM = "Zażółć gęślą jaźń — polskie znaki: ą ć ę ł ń ó ś ź ż"

export function CzcionkaEdytor() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Czcionka</span>
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
              <span style={{ fontFamily: `var(${c.zmienna})` }} className="text-base">
                {PANGRAM}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Waga tekstu</span>
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
