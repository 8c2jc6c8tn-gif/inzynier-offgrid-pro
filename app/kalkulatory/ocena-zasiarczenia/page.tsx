"use client"

import { useMemo, useState } from "react"
import { calculateOcenaZasiarczenia } from "@/lib/core/modules/montaz-baterii/ocena-zasiarczenia/calculator"
import { OBJAWY } from "@/lib/core/modules/montaz-baterii/ocena-zasiarczenia/constants"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function OcenaZasiarczeniaPage() {
  const [obserwowaneObjawyIds, setObserwowaneObjawyIds] = useState<string[]>([])

  const result = useMemo(
    () => calculateOcenaZasiarczenia({ obserwowaneObjawyIds }),
    [obserwowaneObjawyIds],
  )

  function toggle(id: string) {
    setObserwowaneObjawyIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ocena-zasiarczenia" />
      <NaglowekEkranu tytul="Ocena zużycia — siarczanowanie">
        Zaznacz objawy, które faktycznie obserwujesz na akumulatorze. Moduł 11, Ekran B10 (Ścieżka
        B — kwasowo-ołowiowa).
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {OBJAWY.map((objaw) => (
          <PoleCheckbox
            key={objaw.id}
            id={`objaw-${objaw.id}`}
            label={objaw.element}
            checked={obserwowaneObjawyIds.includes(objaw.id)}
            onChange={() => toggle(objaw.id)}
          />
        ))}
      </div>

      {result.value.liczbaObjawow > 0 ? (
        <WerdyktPanel poziom="uwaga" etykieta="Możliwe zasiarczenie">
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Brak zaobserwowanych objawów zasiarczenia" />
      )}
    </main>
  )
}
