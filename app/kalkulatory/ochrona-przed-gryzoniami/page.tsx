"use client"

import { useMemo } from "react"
import { calculateOchronaPrzedGryzoniami } from "@/lib/core/modules/okablowanie/ochrona-przed-gryzoniami/calculator"
import { ETYKIETY_RYZYKA } from "@/lib/core/modules/okablowanie/ochrona-przed-gryzoniami/constants"
import type { PoziomRyzykaGryzoni } from "@/lib/core/modules/okablowanie/ochrona-przed-gryzoniami/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { poziomRyzyka: PoziomRyzykaGryzoni | "" }
const STAN_POCZATKOWY: FormularzStan = { poziomRyzyka: "" }

export default function OchronaPrzedGryzoniamiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-przed-gryzoniami", STAN_POCZATKOWY)
  const { poziomRyzyka } = stan
  const setPoziomRyzyka = (
    a: PoziomRyzykaGryzoni | "" | ((p: PoziomRyzykaGryzoni | "") => PoziomRyzykaGryzoni | ""),
  ) =>
    setStan((prev) => ({
      ...prev,
      poziomRyzyka: typeof a === "function" ? (a as (p: PoziomRyzykaGryzoni | "") => PoziomRyzykaGryzoni | "")(prev.poziomRyzyka) : a,
    }))

  const result = useMemo(
    () => calculateOchronaPrzedGryzoniami({ poziomRyzyka: poziomRyzyka === "" ? null : poziomRyzyka }),
    [poziomRyzyka],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przed-gryzoniami" />
      <NaglowekEkranu tytul={t("UI-OCHPRZGRY-OCHRONA-PRZED-GRYZONIAMI")} ekran="ochrona-przed-gryzoniami">
        {t("UI-OCHPRZGRY-MYSZ-PATRZY-KABEL")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-OCHPRZGRY-RYZYKO-GRYZONI-OKOLICY")}
        value={poziomRyzyka}
        onChange={(e) => setPoziomRyzyka(e.target.value as PoziomRyzykaGryzoni)}
        pomoc={<PomocPola ekran="ochrona-przed-gryzoniami" pole="ryzyko" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {(Object.keys(ETYKIETY_RYZYKA) as PoziomRyzykaGryzoni[]).map((r) => (
          <option key={r} value={r}>
            {ETYKIETY_RYZYKA[r]}
          </option>
        ))}
      </PoleSelect>

      {result.status === "VALID" && result.value.zalecanaOslona && (
        <WerdyktPanel poziom="ok" etykieta={t("UI-OCHPRZGRY-ZALECANA-OSLONA")}>
          <WynikGlowny>{result.value.zalecanaOslona}</WynikGlowny>
        </WerdyktPanel>
      )}
    </main>
  )
}
