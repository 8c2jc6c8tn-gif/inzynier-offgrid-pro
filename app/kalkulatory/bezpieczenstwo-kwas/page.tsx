"use client"

import { useMemo } from "react"
import { calculateBezpieczenstwoKwas } from "@/lib/core/modules/montaz-baterii/bezpieczenstwo-kwas/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/montaz-baterii/bezpieczenstwo-kwas/constants"
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

export default function BezpieczenstwoKwasPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bezpieczenstwo-kwas", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan

  function setPotwierdzoneIds(akcja: string[] | ((prev: string[]) => string[])) {
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof akcja === "function" ? (akcja as (p: string[]) => string[])(prev.potwierdzoneIds) : akcja,
    }))
  }

  const result = useMemo(() => calculateBezpieczenstwoKwas({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bezpieczenstwo-kwas" />
      <NaglowekEkranu tytul={t("UI-BEZKWA-BEZPIECZENSTWO-PRACY-KWASEM")} ekran="bezpieczenstwo-kwas">
        {t("UI-BEZKWA-MODUL-EKRAN-SCIEZKA")}
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

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>🔴 {w}</li>
        ))}
      </ul>

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-BEZKWA-WYPOSAZENIE-OCHRONNE-PROCEDU")} />
      ) : (
        <StanPusty tytul={t("UI-BEZKWA-POTWIERDZONO-ELEMENTOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
