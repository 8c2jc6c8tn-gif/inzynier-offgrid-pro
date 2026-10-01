"use client"

import { useMemo } from "react"
import { calculateOcenaZasiarczenia } from "@/lib/core/modules/montaz-baterii/ocena-zasiarczenia/calculator"
import { OBJAWY } from "@/lib/core/modules/montaz-baterii/ocena-zasiarczenia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  obserwowaneObjawyIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  obserwowaneObjawyIds: [],
}

export default function OcenaZasiarczeniaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ocena-zasiarczenia", STAN_POCZATKOWY)
  const { obserwowaneObjawyIds } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setObserwowaneObjawyIds = (a: string[] | ((p: string[]) => string[])) => setPole("obserwowaneObjawyIds", a)

  const result = useMemo(
    () => calculateOcenaZasiarczenia({ obserwowaneObjawyIds }),
    [obserwowaneObjawyIds],
  )

  function toggle(id: string) {
    setObserwowaneObjawyIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ocena-zasiarczenia" />
      <NaglowekEkranu tytul={t("UI-OCEZAS-OCENA-ZUZYCIA-SIARCZANOWANIE")} ekran="ocena-zasiarczenia" wynik={result}>
        {t("UI-OCEZAS-ZAZNACZ-OBJAWY-KTORE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        {OBJAWY.map((objaw) => (
          <PoleCheckbox
            key={objaw.id}
            id={`objaw-${objaw.id}`}
            label={objaw.element}
            checked={obserwowaneObjawyIds.includes(objaw.id)}
            onChange={() => toggle(objaw.id)}
          />
        ))}
      </div>

      {result.value.liczbaObjawow > 0 ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-OCEZAS-MOZLIWE-ZASIARCZENIE")}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-OCEZAS-BRAK-ZAOBSERWOWANYCH-OBJAWOW")} />
      )}
    </main>
  )
}
