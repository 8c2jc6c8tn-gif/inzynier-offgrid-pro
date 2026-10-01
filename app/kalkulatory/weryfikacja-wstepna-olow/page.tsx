"use client"

import { useMemo } from "react"
import { calculateWeryfikacjaWstepnaOlow } from "@/lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/weryfikacja-wstepna-olow/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
}

export default function WeryfikacjaWstepnaOlowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("weryfikacja-wstepna-olow", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan

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

  const result = useMemo(
    () => calculateWeryfikacjaWstepnaOlow({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/weryfikacja-wstepna-olow" />
      <NaglowekEkranu tytul={t("UI-WERWSTOLO-WERYFIKACJA-KONTROLA-WSTEPNA")} ekran="weryfikacja-wstepna-olow">
        {t("UI-WERWSTOLO-MODUL-EKRAN-SCIEZKA")}
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
        <WerdyktPanel poziom="ok" etykieta={t("UI-WERWSTOLO-KONTROLA-WSTEPNA-ZAKONCZONA")} />
      ) : (
        <StanPusty tytul={t("UI-WERWSTOLO-POTWIERDZONO-ELEMENTOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
