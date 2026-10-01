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
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function UruchomienieTestyOlowPage() {
  const t = useTranslate()
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
      <NaglowekEkranu tytul={t("UI-URUTESOLO-PIERWSZE-URUCHOMIENIE-TESTY")} ekran="uruchomienie-testy-olow">
        {t("UI-URUTESOLO-MODUL-EKRAN-SCIEZKA")}
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
        <WerdyktPanel poziom="ok" etykieta={t("UI-URUTESOLO-PIERWSZE-URUCHOMIENIE-ZAKONC")} />
      ) : (
        <StanPusty tytul={t("UI-URUTESOLO-POTWIERDZONO-ELEMENTOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
