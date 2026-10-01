"use client"

import { useMemo } from "react"
import { calculateOznakowanieObwodow } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/oznakowanie-obwodow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  oznaczoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  oznaczoneIds: [],
}

export default function OznakowanieObwodowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("oznakowanie-obwodow", STAN_POCZATKOWY)
  const { oznaczoneIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setOznaczoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("oznaczoneIds", a)

  const result = useMemo(() => calculateOznakowanieObwodow({ oznaczoneIds }), [oznaczoneIds])

  function toggle(id: string) {
    setOznaczoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oznakowanie-obwodow" />
      <NaglowekEkranu tytul={t("UI-OZNOBW-OZNAKOWANIE-OBWODOW")} ekran="oznakowanie-obwodow">
        {t("UI-OZNOBW-LAT-ZAPOMNISZ-CZYM")}
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={oznaczoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.nazwa}</span>
            <span className="block text-muted-foreground">{t("UI-OZNOBW-KOD-60445", { kodOznaczenia: item.kodOznaczenia })}</span>
          </>
        )}
      />

      <p className="text-small text-muted-foreground">
        {t("UI-OZNOBW-KOLORYSTYKA-ZYL-ZOLTO")}
      </p>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={t("UI-OZNOBW-WSZYSTKIE-OBWODY-OZNACZONE")} />
      ) : (
        <StanPusty tytul={t("UI-OZNOBW-OZNACZONO-OBWODOW", { oznaczone: result.value.oznaczone, razem: result.value.razem })} />
      )}
    </main>
  )
}
