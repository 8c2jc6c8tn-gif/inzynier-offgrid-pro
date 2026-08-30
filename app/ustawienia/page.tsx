"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { znajdzKafel } from "@/lib/pulpit/registry"
import {
  domyslnyStan,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  zapiszStanPulpitu,
  type PulpitState,
} from "@/lib/pulpit/storage"
import { cn } from "@/lib/utils"

export default function UstawieniaPage() {
  const stan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function zapisz(nowyStan: PulpitState) {
    zapiszStanPulpitu(nowyStan)
  }

  function przelaczWidocznosc(id: number) {
    const hiddenIds = stan.hiddenIds.includes(id)
      ? stan.hiddenIds.filter((x) => x !== id)
      : [...stan.hiddenIds, id]
    zapisz({ ...stan, hiddenIds })
  }

  function przesun(id: number, kierunek: -1 | 1) {
    const index = stan.order.indexOf(id)
    const nowyIndex = index + kierunek
    if (nowyIndex < 0 || nowyIndex >= stan.order.length) return

    const order = [...stan.order]
    ;[order[index], order[nowyIndex]] = [order[nowyIndex], order[index]]
    zapisz({ ...stan, order })
  }

  function przywrocDomyslne() {
    zapisz(domyslnyStan())
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Pulpit
        </Link>
        <h1 className="mt-2 text-xl font-semibold">⚙️ Ustawienia — Skonfiguruj pulpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pokaż/ukryj moduł, zmień kolejność (↑/↓). Ukrycie nie usuwa modułu — zawsze możesz go
          przywrócić. Zmiany zapisują się automatycznie w tej przeglądarce.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {stan.order.map((id, index) => {
          const kafel = znajdzKafel(id)
          if (!kafel) return null
          const ukryty = stan.hiddenIds.includes(id)

          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3",
                ukryty && "opacity-50",
              )}
            >
              <span className="text-xl">{kafel.ikona}</span>
              <span className="flex-1 text-sm font-medium">
                {kafel.id}. {kafel.nazwa}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => przesun(id, -1)}
                  disabled={index === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-30"
                  aria-label="Przenieś wyżej"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => przesun(id, 1)}
                  disabled={index === stan.order.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-30"
                  aria-label="Przenieś niżej"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => przelaczWidocznosc(id)}
                  className="ml-1 min-h-8 rounded-md border px-2 text-xs font-medium"
                >
                  {ukryty ? "Pokaż" : "Ukryj"}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={przywrocDomyslne}
        className="min-h-11 rounded-md border px-4 text-sm font-medium hover:bg-muted"
      >
        Przywróć domyślne
      </button>
    </main>
  )
}
