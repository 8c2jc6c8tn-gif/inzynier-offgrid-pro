"use client"

import { useMemo } from "react"
import { calculateProceduraBlackStart } from "@/lib/core/modules/stress-test/procedura-black-start/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE } from "@/lib/core/modules/stress-test/procedura-black-start/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
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

export default function ProceduraBlackStartPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("procedura-black-start", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({ ...prev, potwierdzoneIds: typeof a === "function" ? a(prev.potwierdzoneIds) : a }))

  const result = useMemo(
    () => calculateProceduraBlackStart({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "VALID"
      ? "ok"
      : result.status === "VALID_WITH_WARNINGS"
        ? hasCritical
          ? "blad"
          : "uwaga"
        : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/procedura-black-start" />
      <NaglowekEkranu tytul="Procedura Black Start" ekran="procedura-black-start">
        To jak rozruch samochodu po nocy na mrozie — trzeba wiedzieć dokładnie, co i w jakiej
        kolejności przekręcić, żeby zapalić. Moduł 7, Ekran 5.
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
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Procedura zakończona" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
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
