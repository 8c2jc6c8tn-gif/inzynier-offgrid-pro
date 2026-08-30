"use client"

import { useMemo, useState } from "react"
import { calculatePrzygotowanieStanowiska } from "@/lib/core/modules/montaz-baterii/przygotowanie-stanowiska/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/przygotowanie-stanowiska/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { cn } from "@/lib/utils"

export default function PrzygotowanieStanowiskaPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculatePrzygotowanieStanowiska({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Przygotowanie stanowiska i narzędzi</h1>
        <p className="text-sm text-muted-foreground">
          Zanim zaczniesz montaż pakietu — stanowisko i narzędzia muszą być gotowe. Moduł 11,
          Ekran A7 (ścieżka LiFePO4).
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {CHECKLIST_ITEMS.map((item) => {
          const checked = potwierdzoneIds.includes(item.id)
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-md border p-3">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0"
                checked={checked}
                onChange={() => toggle(item.id)}
                id={`item-${item.id}`}
              />
              <label htmlFor={`item-${item.id}`} className="flex-1 text-sm font-medium">
                {item.element}
              </label>
            </li>
          )
        })}
      </ul>

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Stanowisko gotowe do montażu" />
      ) : (
        <div className={cn("rounded-lg border-2 p-4", "border-muted-foreground/40 bg-muted text-muted-foreground")}>
          <p className="font-medium">
            Potwierdzono {result.value.potwierdzone} / {result.value.razem} elementów
          </p>
        </div>
      )}
    </main>
  )
}
