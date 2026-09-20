"use client"

import { useMemo } from "react"
import { calculatePrzygotowanieStanowiska } from "@/lib/core/modules/montaz-baterii/przygotowanie-stanowiska/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/przygotowanie-stanowiska/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

type FormularzStan = {
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
}

export default function PrzygotowanieStanowiskaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przygotowanie-stanowiska", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({ ...prev, potwierdzoneIds: typeof a === "function" ? a(prev.potwierdzoneIds) : a }))

  const result = useMemo(
    () => calculatePrzygotowanieStanowiska({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przygotowanie-stanowiska" />
      <NaglowekEkranu tytul="Przygotowanie stanowiska i narzędzi">
        Zanim zaczniesz montaż pakietu — stanowisko i narzędzia muszą być gotowe. Moduł 11,
        Ekran A7 (ścieżka LiFePO4).
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Stanowisko gotowe do montażu" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} elementów`} />
      )}
    </main>
  )
}
