"use client"

import { useMemo } from "react"
import { calculateSzynyZbiorczePolaczenia } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function SzynyZbiorczePolaczeniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szyny-zbiorcze-polaczenia", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(() => calculateSzynyZbiorczePolaczenia({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szyny-zbiorcze-polaczenia" />
      <NaglowekEkranu tytul={t("UI-SZYZBIPOL-SZYNY-ZBIORCZE-POLACZENIA")} ekran="szyny-zbiorcze-polaczenia">
        {t("UI-SZYZBIPOL-SRUBA-SPREZYNA-SLABO")}
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.krok}</span>
            <span className="block text-muted-foreground">{t("UI-SZYZBIPOL-WARTOSC-DOCELOWA", { wartoscDocelowa: item.wartoscDocelowa })}</span>
          </>
        )}
      />

      <p className="text-small text-muted-foreground">
        {t("UI-SZYZBIPOL-ZDJECIE-POLACZENIA-OPCJONALN")}
      </p>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-SZYZBIPOL-WSZYSTKIE-KROKI-POTWIERDZONE")} />
      ) : (
        <StanPusty tytul={t("UI-SZYZBIPOL-POTWIERDZONO-KROKOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
