"use client"

import { useMemo } from "react"
import { calculatePeszleKorytaRurki } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/calculator"
import { ETYKIETY_MIEJSC, OSLONY } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/constants"
import type { MiejsceMontazu } from "@/lib/core/modules/okablowanie/peszle-koryta-rurki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  miejsceMontazu: MiejsceMontazu | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  miejsceMontazu: "",
}

export default function PeszleKorytaRurkiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("peszle-koryta-rurki", STAN_POCZATKOWY)
  const { miejsceMontazu } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMiejsceMontazu = (a: (MiejsceMontazu | "") | ((p: MiejsceMontazu | "") => MiejsceMontazu | "")) => setPole("miejsceMontazu", a)

  const result = useMemo(
    () => calculatePeszleKorytaRurki({ miejsceMontazu: miejsceMontazu === "" ? null : miejsceMontazu }),
    [miejsceMontazu],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/peszle-koryta-rurki" />
      <NaglowekEkranu tytul={t("UI-PESKORRUR-PESZLE-KORYTA-RURKI")} ekran="peszle-koryta-rurki">
        {t("UI-PESKORRUR-OSLONA-UBRANIE-KABLA")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-PESKORRUR-MIEJSCE-MONTAZU")}
        value={miejsceMontazu}
        onChange={(e) => setMiejsceMontazu(e.target.value as MiejsceMontazu)}
        pomoc={<PomocPola ekran="peszle-koryta-rurki" pole="miejsce" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {(Object.keys(ETYKIETY_MIEJSC) as MiejsceMontazu[]).map((m) => (
          <option key={m} value={m}>
            {ETYKIETY_MIEJSC[m]}
          </option>
        ))}
      </PoleSelect>

      {result.status === "VALID" && result.value.zalecanaOslona && (
        <WerdyktPanel poziom="ok" etykieta={t("UI-PESKORRUR-ZALECANA-OSLONA")}>
          <WynikGlowny>{result.value.zalecanaOslona.nazwa}</WynikGlowny>
          <p className="mt-1 text-small text-muted-foreground">{result.value.zalecanaOslona.opis}</p>
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-3">
        <div className="font-medium text-small">{t("UI-PESKORRUR-WSZYSTKIE-OSLONY")}</div>
        {OSLONY.map((o) => (
          <div key={o.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{o.nazwa}</span>
            <span className="block text-muted-foreground">{o.opis}</span>
            <span className="block text-caption text-muted-foreground">{t("UI-PESKORRUR-ZALECANE", { p: ETYKIETY_MIEJSC[o.zalecaneMiejsce] })}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
