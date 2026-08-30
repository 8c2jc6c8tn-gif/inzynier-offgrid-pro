"use client"

import { useMemo, useState } from "react"
import { calculateSurvivalCore } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/calculator"
import { DEFAULT_CRITICAL_LOADS } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/constants"
import type { CriticalLoadItem } from "@/lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/input"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { StanPusty } from "@/components/ui/stany"

const initialItems: CriticalLoadItem[] = DEFAULT_CRITICAL_LOADS.map((def) => ({
  id: def.id,
  label: def.label,
  selected: false,
  powerW: def.defaultPowerW ?? 0,
}))

/** Pole liczbowe w rzędzie listy — świadomie nie `Pole` (bez etykiety/wrappera, bo etykieta jest
 * już w <label> checkboxa po lewej), ale te same tokeny stanu co components/ui/pole.tsx. */
const INLINE_INPUT_KLASY =
  "w-24 min-h-11 rounded-md border border-input bg-background px-2 text-body outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"

export default function SystemyPodtrzymaniaZyciaPage() {
  const [items, setItems] = useState<CriticalLoadItem[]>(initialItems)

  const result = useMemo(() => calculateSurvivalCore({ items }), [items])

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : "ok"

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
      <NawigacjaEkranu href="/kalkulatory/systemy-podtrzymania-zycia" />
      <NaglowekEkranu tytul="Systemy podtrzymania życia">
        To jest lista rzeczy, bez których dom przestaje być bezpieczny do mieszkania — reszta
        aplikacji będzie chronić te odbiorniki jako pierwsze, cokolwiek by się działo. Moduł 2,
        Ekran 1.
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const def = DEFAULT_CRITICAL_LOADS.find((d) => d.id === item.id)
          return (
            <li key={item.id} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                checked={item.selected}
                onChange={() => toggleSelected(item.id)}
                id={`item-${item.id}`}
              />
              <label htmlFor={`item-${item.id}`} className="flex-1 text-small font-medium">
                {item.label}
                {def?.defaultPowerW === null && (
                  <span className="block text-caption font-normal text-muted-foreground">
                    brak wartości domyślnej — wpisz ręcznie
                  </span>
                )}
              </label>
              <input
                type="number"
                inputMode="decimal"
                className={INLINE_INPUT_KLASY}
                value={item.powerW}
                disabled={!item.selected}
                onChange={(e) => updatePower(item.id, Number(e.target.value))}
                aria-label={`Moc — ${item.label}`}
              />
              <span className="w-4 text-caption text-muted-foreground">W</span>
            </li>
          )
        })}
      </ul>

      {(() => {
        const dodatki = (
          <>
            {result.assumptions.length > 0 && (
              <ul className="mt-2 text-small opacity-90">
                {result.assumptions.map((a) => (
                  <li key={a}>Założenie: {a}</li>
                ))}
              </ul>
            )}

            {result.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-small">
                {result.warnings.map((w) => (
                  <li key={w.code}>{w.message}</li>
                ))}
              </ul>
            )}
          </>
        )

        if (poziom === null) {
          return <StanPusty tytul="Zaznacz przynajmniej jeden odbiornik krytyczny.">{dodatki}</StanPusty>
        }
        return (
          <WerdyktPanel
            poziom={poziom}
            etykieta={poziom === "blad" ? "Nie da się policzyć — sprawdź zaznaczone pozycje poniżej" : undefined}
          >
            {poziom !== "blad" && (
              <p className="mt-1 text-h1 font-semibold">
                {result.value.toFixed(0)} {result.unit}
              </p>
            )}
            {dodatki}
          </WerdyktPanel>
        )
      })()}
    </main>
  )
}
