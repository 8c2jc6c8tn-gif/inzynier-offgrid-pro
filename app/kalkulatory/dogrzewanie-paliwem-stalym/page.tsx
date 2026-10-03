"use client"

import { useMemo } from "react"
import { calculateDogrzewaniePaliwemStalym } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/calculator"
import { MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/constants"
import type { PaliwoStale } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  typPaliwa: PaliwoStale | ""
  odlegloscOdMaterialowPalnychCm: string
  maNawiewPowietrzaDoSpalania: boolean
  maCzujnikCo: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  typPaliwa: "",
  odlegloscOdMaterialowPalnychCm: "",
  maNawiewPowietrzaDoSpalania: false,
  maCzujnikCo: false,
}

export default function DogrzewaniePaliwemStalymPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dogrzewanie-paliwem-stalym", STAN_POCZATKOWY)
  const { typPaliwa, odlegloscOdMaterialowPalnychCm, maNawiewPowietrzaDoSpalania, maCzujnikCo } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTypPaliwa = (a: (PaliwoStale | "") | ((p: PaliwoStale | "") => PaliwoStale | "")) => setPole("typPaliwa", a)
  const setOdlegloscOdMaterialowPalnychCm = (a: string | ((p: string) => string)) => setPole("odlegloscOdMaterialowPalnychCm", a)
  const setMaNawiewPowietrzaDoSpalania = (a: boolean | ((p: boolean) => boolean)) => setPole("maNawiewPowietrzaDoSpalania", a)
  const setMaCzujnikCo = (a: boolean | ((p: boolean) => boolean)) => setPole("maCzujnikCo", a)

  const result = useMemo(
    () =>
      calculateDogrzewaniePaliwemStalym({
        typPaliwa: typPaliwa === "" ? null : typPaliwa,
        odlegloscOdMaterialowPalnychCm:
          odlegloscOdMaterialowPalnychCm === "" ? 0 : Number(odlegloscOdMaterialowPalnychCm),
        maNawiewPowietrzaDoSpalania,
        maCzujnikCo,
      }),
    [typPaliwa, odlegloscOdMaterialowPalnychCm, maNawiewPowietrzaDoSpalania, maCzujnikCo],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dogrzewanie-paliwem-stalym" />
      <NaglowekEkranu
        tytul={t("UI-DOGPALSTA-BEZPIECZENSTWO-POZAROWE-DOGR")}
        ekran="dogrzewanie-paliwem-stalym"
        parametry={{ minOdleglosc: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM }}
        wynik={result}
      >
        {t("UI-DOGPALSTA-OTWARTY-OGIEN-DOMU")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-DOGPALSTA-TYP-PALIWA")}
          value={typPaliwa}
          onChange={(e) => setTypPaliwa(e.target.value as PaliwoStale)}
          pomoc={<PomocPola ekran="dogrzewanie-paliwem-stalym" pole="paliwo" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="drewno">{t("UI-DOGPALSTA-DREWNO")}</option>
          <option value="pellet">{t("UI-DOGPALSTA-PELLET")}</option>
          <option value="wegiel">{t("UI-DOGPALSTA-WEGIEL")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-DOGPALSTA-ODLEGLOSC-MATERIALOW-PALNYCH")}
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={odlegloscOdMaterialowPalnychCm}
          onChange={(e) => setOdlegloscOdMaterialowPalnychCm(e.target.value)}
          pomoc={<PomocPola ekran="dogrzewanie-paliwem-stalym" pole="odleglosc" params={{ minOdleglosc: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM }} />}
        />
        <PoleCheckbox
          id="ma-nawiew"
          label={t("UI-DOGPALSTA-OSOBNY-NAWIEW-POWIETRZA")}
          checked={maNawiewPowietrzaDoSpalania}
          onChange={(e) => setMaNawiewPowietrzaDoSpalania(e.target.checked)}
        />
        <PoleCheckbox
          id="ma-czujnik-co"
          label={t("UI-DOGPALSTA-CZUJNIK-CZADU-POMIESZCZENIU")}
          checked={maCzujnikCo}
          onChange={(e) => setMaCzujnikCo(e.target.checked)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DOGPALSTA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DOGPALSTA-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? t("UI-DOGPALSTA-WYKRYTO-BRAKI-BEZPIECZENSTWA") : t("UI-DOGPALSTA-INSTALACJA-ZGODNA-MINIMALNYM")}>
          <WynikGlowny>{result.value.marginesOdlegloscCm >= 0 ? "+" : ""}{result.value.marginesOdlegloscCm.toFixed(0)} cm</WynikGlowny>
          <p className="mt-2 text-small">{t("UI-DOGPALSTA-MARGINES-WZGLEDEM-MINIMALNEJ")}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
