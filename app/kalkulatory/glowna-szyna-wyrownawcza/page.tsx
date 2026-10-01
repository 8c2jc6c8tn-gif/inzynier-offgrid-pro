"use client"

import { useMemo } from "react"
import { calculateGlownaSzynaWyrownawcza } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/glowna-szyna-wyrownawcza/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  potwierdzoneIds: string[]
  uzywanaJakoPrzylaczeOdbiornikow: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
  uzywanaJakoPrzylaczeOdbiornikow: false,
}

export default function GlownaSzynaWyrownawczaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("glowna-szyna-wyrownawcza", STAN_POCZATKOWY)
  const { potwierdzoneIds, uzywanaJakoPrzylaczeOdbiornikow } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)
  const setUzywanaJakoPrzylaczeOdbiornikow = (a: boolean | ((p: boolean) => boolean)) =>
    setPole("uzywanaJakoPrzylaczeOdbiornikow", a)

  const result = useMemo(
    () => calculateGlownaSzynaWyrownawcza({ potwierdzoneIds, uzywanaJakoPrzylaczeOdbiornikow }),
    [potwierdzoneIds, uzywanaJakoPrzylaczeOdbiornikow],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? (hasCritical ? "blad" : "uwaga") : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/glowna-szyna-wyrownawcza" />
      <NaglowekEkranu tytul={t("UI-GLOSZYWYR-GLOWNA-SZYNA-WYROWNAWCZA")} ekran="glowna-szyna-wyrownawcza">
        {t("UI-GLOSZYWYR-JESLI-DOTKNIESZ-DWOCH")}
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            <span className="block text-muted-foreground">{t("UI-GLOSZYWYR-MIN-PRZEKROJ", { minPrzekrojMm2: item.minPrzekrojMm2 })}</span>
          </>
        )}
      />

      <PoleCheckbox
        id="uzywana-jako-przylacze"
        label={t("UI-GLOSZYWYR-GSW-UZYWANA-JAKO")}
        checked={uzywanaJakoPrzylaczeOdbiornikow}
        onChange={(e) => setUzywanaJakoPrzylaczeOdbiornikow(e.target.checked)}
      />

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-GLOSZYWYR-GSW-SKOMPLETOWANA-POPRAWNIE") : undefined}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <StanPusty tytul={t("UI-GLOSZYWYR-POTWIERDZONO-ELEMENTOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
