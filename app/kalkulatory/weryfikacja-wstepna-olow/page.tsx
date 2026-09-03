"use client"

import { useMemo, useState } from "react"
import { calculateWeryfikacjaWstepnaOlow } from "@/lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

export default function WeryfikacjaWstepnaOlowPage() {
  const [potwierdzoneIds, setPotwierdzoneIds] = useState<string[]>([])

  const result = useMemo(
    () => calculateWeryfikacjaWstepnaOlow({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/weryfikacja-wstepna-olow" />
      <NaglowekEkranu tytul="Weryfikacja + kontrola wstępna">
        Moduł 11, Ekran B1 (Ścieżka B — kwasowo-ołowiowa).
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            {item.uwaga !== "—" && (
              <span className="block text-muted-foreground">{item.uwaga}</span>
            )}
          </>
        )}
      />

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Kontrola wstępna zakończona" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} elementów`} />
      )}
    </main>
  )
}
