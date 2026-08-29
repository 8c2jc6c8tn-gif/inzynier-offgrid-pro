"use client"

import { useMemo, useState } from "react"
import { calculateSurvivalCore } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/calculator"
import { DEFAULT_CRITICAL_LOADS } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants"
import type { CriticalLoadItem } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/input"
import { cn } from "@/lib/utils"

const initialItems: CriticalLoadItem[] = DEFAULT_CRITICAL_LOADS.map((def) => ({
  id: def.id,
  label: def.label,
  selected: false,
  powerW: def.defaultPowerW ?? 0,
}))

export default function SystemyPodtrzymaniaZyciaPage() {
  const [items, setItems] = useState<CriticalLoadItem[]>(initialItems)

  const result = useMemo(() => calculateSurvivalCore({ items }), [items])

  const verdictColor =
    result.status === "INVALID_INPUT"
      ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
      : result.status === "INCOMPLETE"
        ? "border-muted-foreground/40 bg-muted text-muted-foreground"
        : result.status === "VALID_WITH_WARNINGS"
          ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
          : "border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"

  function toggleSelected(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    )
  }

  function updatePower(id: string, powerW: number) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, powerW } : item)))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Systemy podtrzymania życia</h1>
        <p className="text-sm text-muted-foreground">
          To jest lista rzeczy, bez których dom przestaje być bezpieczny do mieszkania — reszta
          aplikacji będzie chronić te odbiorniki jako pierwsze, cokolwiek by się działo. Moduł 2,
          Ekran 1.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const def = DEFAULT_CRITICAL_LOADS.find((d) => d.id === item.id)
          return (
            <li key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0"
                checked={item.selected}
                onChange={() => toggleSelected(item.id)}
                id={`item-${item.id}`}
              />
              <label htmlFor={`item-${item.id}`} className="flex-1 text-sm font-medium">
                {item.label}
                {def?.defaultPowerW === null && (
                  <span className="block text-xs font-normal text-muted-foreground">
                    brak wartości domyślnej — wpisz ręcznie
                  </span>
                )}
              </label>
              <input
                type="number"
                inputMode="decimal"
                className="w-24 min-h-11 rounded-md border border-input bg-background px-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={item.powerW}
                disabled={!item.selected}
                onChange={(e) => updatePower(item.id, Number(e.target.value))}
              />
              <span className="w-4 text-xs text-muted-foreground">W</span>
            </li>
          )
        })}
      </ul>

      <div className={cn("rounded-lg border-2 p-4", verdictColor)}>
        {result.status === "INVALID_INPUT" || result.status === "INCOMPLETE" ? (
          <p className="font-medium">
            {result.status === "INCOMPLETE"
              ? "Zaznacz przynajmniej jeden odbiornik krytyczny."
              : "Nie da się policzyć — sprawdź zaznaczone pozycje poniżej."}
          </p>
        ) : (
          <p className="text-2xl font-semibold">
            {result.value.toFixed(0)} {result.unit}
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-sm opacity-90">
            {result.assumptions.map((a) => (
              <li key={a}>Założenie: {a}</li>
            ))}
          </ul>
        )}

        {result.warnings.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {result.warnings.map((w) => (
              <li key={w.code}>{w.message}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
