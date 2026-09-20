"use client"

import { useMemo } from "react"
import { calculateNormyICertyfikaty } from "@/lib/core/modules/okablowanie/normy-i-certyfikaty/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/normy-i-certyfikaty/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { potwierdzoneIds: string[] }

const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function NormyICertyfikatyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("normy-i-certyfikaty", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan

  function toggle(id: string) {
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: prev.potwierdzoneIds.includes(id)
        ? prev.potwierdzoneIds.filter((x) => x !== id)
        : [...prev.potwierdzoneIds, id],
    }))
  }

  const result = useMemo(() => calculateNormyICertyfikaty({ potwierdzoneIds }), [potwierdzoneIds])

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/normy-i-certyfikaty" />
      <NaglowekEkranu tytul="Normy i certyfikaty">
        Certyfikat to dowód, że coś nie wybuchnie przy normalnym użytkowaniu. Bez niego jesteś
        testerem beta. Moduł 5, Ekran 21.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.komponent}</span>
            <span className="block text-muted-foreground">{item.norma}</span>
          </>
        )}
      />

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? "Wszystkie certyfikaty potwierdzone" : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} komponentów`} />
      )}
    </main>
  )
}
