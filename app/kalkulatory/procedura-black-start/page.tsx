"use client"

import { useMemo, useState } from "react"
import { calculateProceduraBlackStart } from "@/lib/core/modules/stress-test/procedura-black-start/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/stress-test/procedura-black-start/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { cn } from "@/lib/utils"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

export default function ProceduraBlackStartPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculateProceduraBlackStart({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/procedura-black-start" />
      <div>
        <h1 className="text-xl font-semibold">Procedura Black Start</h1>
        <p className="text-sm text-muted-foreground">
          To jak rozruch samochodu po nocy na mrozie — trzeba wiedzieć dokładnie, co i w jakiej
          kolejności przekręcić, żeby zapalić. Moduł 7, Ekran 5.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {CHECKLIST_ITEMS.map((item, index) => {
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
                <span className="font-medium">Krok {index + 1}. </span>
                {item.krok}
              </label>
            </li>
          )
        })}
      </ol>

      <ul className="space-y-1 text-xs text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Procedura zakończona" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-sm">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <div className={cn("rounded-lg border-2 p-4", "border-muted-foreground/40 bg-muted text-muted-foreground")}>
          <p className="font-medium">
            Potwierdzono {result.value.potwierdzoneWKolejnosci} / {result.value.razem} kroków po kolei
          </p>
        </div>
      )}
    </main>
  )
}
