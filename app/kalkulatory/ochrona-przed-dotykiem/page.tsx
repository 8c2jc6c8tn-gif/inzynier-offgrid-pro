"use client"

import { useMemo } from "react"
import { calculateOchronaPrzedDotykiem } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/ochrona-przed-dotykiem/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function OchronaPrzedDotykiemPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-przed-dotykiem", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(() => calculateOchronaPrzedDotykiem({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przed-dotykiem" />
      <NaglowekEkranu tytul={t("UI-OCHPRZDOT-OCHRONA-PRZED-DOTYKIEM")} ekran="ochrona-przed-dotykiem">
        {t("UI-OCHPRZDOT-PRAD-WYBACZA-DOTKNIESZ")}
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.nazwa}</span>
            <span className="block text-muted-foreground">{item.opis}</span>
          </>
        )}
      />

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-OCHPRZDOT-OBA-MECHANIZMY-OCHRONY")} />
      ) : (
        <StanPusty tytul={t("UI-OCHPRZDOT-POTWIERDZONO-MECHANIZMOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
