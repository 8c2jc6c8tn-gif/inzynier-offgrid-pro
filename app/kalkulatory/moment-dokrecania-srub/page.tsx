"use client"

import { useMemo, useState } from "react"
import { calculateMomentDokrecania } from "@/lib/core/modules/baterie/moment-dokrecania-srub/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/baterie/moment-dokrecania-srub/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { cn } from "@/lib/utils"

export default function MomentDokrecaniaSrubPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculateMomentDokrecania({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Moment dokręcania śrub</h1>
        <p className="text-sm text-muted-foreground">
          Śruba to sprężyna — musisz ją naciągnąć dokładnie tyle, ile trzeba, żeby docisnęła
          końcówkę kablową, ani trochę więcej. Moduł 4, Ekran 11.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {CHECKLIST_ITEMS.map((item) => {
          const checked = potwierdzoneIds.includes(item.id)
          return (
            <li key={item.id} className="flex items-start gap-3 rounded-md border p-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0"
                checked={checked}
                onChange={() => toggle(item.id)}
                id={`step-${item.id}`}
              />
              <label htmlFor={`step-${item.id}`} className="flex-1 text-sm">
                <span className="block font-medium">{item.element}</span>
                <span className="block text-muted-foreground">Moment: {item.moment}</span>
                {item.uwaga !== "—" && (
                  <span className="block text-xs text-muted-foreground">{item.uwaga}</span>
                )}
              </label>
            </li>
          )
        })}
      </ul>

      <ul className="space-y-1 text-xs text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>⚠️ {w}</li>
        ))}
      </ul>

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Wszystkie kroki potwierdzone" />
      ) : (
        <div className={cn("rounded-lg border-2 p-4", "border-muted-foreground/40 bg-muted text-muted-foreground")}>
          <p className="font-medium">
            Potwierdzono {result.value.potwierdzone} / {result.value.razem} kroków
          </p>
        </div>
      )}
    </main>
  )
}
