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
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
}

export default function PrzygotowanieStanowiskaPage() {
  const t = useTranslate()
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
      <NaglowekEkranu tytul={t("UI-PRZSTA-PRZYGOTOWANIE-STANOWISKA-NAR")} ekran="przygotowanie-stanowiska">
        {t("UI-PRZSTA-ZANIM-ZACZNIESZ-MONTAZ")}
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => item.element}
      />

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-PRZSTA-STANOWISKO-GOTOWE-MONTAZU")} />
      ) : (
        <StanPusty tytul={t("UI-PRZSTA-POTWIERDZONO-ELEMENTOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
