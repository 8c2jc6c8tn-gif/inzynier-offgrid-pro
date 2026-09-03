"use client"

import { useMemo, useState } from "react"
import { calculatePolaczeniaElektryczne } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/polaczenia-elektryczne/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

export default function PolaczeniaElektrycznePage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculatePolaczeniaElektryczne({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/polaczenia-elektryczne" />
      <NaglowekEkranu tytul="Połączenia elektryczne i kolejność łączenia">
        Kolejność łączenia ma znaczenie — przypadkowe zwarcie podczas montażu szeregu ogniw to
        najczęstsza przyczyna wypadków przy budowie własnego pakietu. Moduł 11, Ekran A3.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">Krok {index + 1}. </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Połączenia zgodne z kolejnością" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty
          tytul={`Potwierdzono ${result.value.potwierdzoneWKolejnosci} / ${result.value.razem} kroków po kolei`}
        />
      )}
    </main>
  )
}
