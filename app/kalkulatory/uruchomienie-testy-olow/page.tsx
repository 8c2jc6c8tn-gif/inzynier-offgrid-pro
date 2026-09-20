"use client"

import { useMemo } from "react"
import { calculateUruchomienieTestyOlow } from "@/lib/core/modules/montaz-baterii/uruchomienie-testy-olow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/uruchomienie-testy-olow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function UruchomienieTestyOlowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("uruchomienie-testy-olow", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(
    () => calculateUruchomienieTestyOlow({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/uruchomienie-testy-olow" />
      <NaglowekEkranu tytul="Pierwsze uruchomienie i testy">
        Moduł 11, Ekran B6 (Ścieżka B — kwasowo-ołowiowa).
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
        <WerdyktPanel poziom="ok" etykieta="Pierwsze uruchomienie zakończone" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} elementów`} />
      )}
    </main>
  )
}
