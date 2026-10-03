"use client"

import { useMemo } from "react"
import { calculateNaporWiatru } from "@/lib/core/modules/pv/napor-wiatru/calculator"
import { CD_TYPOWY_MAX, CD_TYPOWY_MIN, GESTOSC_POWIETRZA_KG_M3 } from "@/lib/core/modules/pv/napor-wiatru/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  predkoscWiatruMS: string
  powierzchniaM2: string
  cd: string
  balastPlanowanyKg: string
  masaPaneliStelazaKg: string
}

const STAN_POCZATKOWY: FormularzStan = {
  predkoscWiatruMS: "",
  powierzchniaM2: "",
  cd: "",
  balastPlanowanyKg: "",
  masaPaneliStelazaKg: "",
}

export default function NaporWiatruPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("napor-wiatru", STAN_POCZATKOWY)
  // Drafts saved before 26.09.2026 have no `balastPlanowanyKg` — treat as empty.
  const { predkoscWiatruMS, powierzchniaM2, cd } = stan
  const balastPlanowanyKg = stan.balastPlanowanyKg ?? ""
  // Same for `masaPaneliStelazaKg` before D29 (28.09.2026).
  const masaPaneliStelazaKg = stan.masaPaneliStelazaKg ?? ""

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPredkoscWiatruMS = (a: string | ((p: string) => string)) => setPole("predkoscWiatruMS", a)
  const setPowierzchniaM2 = (a: string | ((p: string) => string)) => setPole("powierzchniaM2", a)
  const setCd = (a: string | ((p: string) => string)) => setPole("cd", a)
  const setBalastPlanowanyKg = (a: string | ((p: string) => string)) => setPole("balastPlanowanyKg", a)
  const setMasaPaneliStelazaKg = (a: string | ((p: string) => string)) => setPole("masaPaneliStelazaKg", a)

  const result = useMemo(
    () =>
      calculateNaporWiatru({
        predkoscWiatruMS: predkoscWiatruMS === "" ? 0 : Number(predkoscWiatruMS),
        powierzchniaM2: powierzchniaM2 === "" ? 0 : Number(powierzchniaM2),
        cd: cd === "" ? 0 : Number(cd),
        balastPlanowanyKg: balastPlanowanyKg === "" ? null : Number(balastPlanowanyKg),
        masaPaneliStelazaKg: masaPaneliStelazaKg === "" ? null : Number(masaPaneliStelazaKg),
      }),
    [predkoscWiatruMS, powierzchniaM2, cd, balastPlanowanyKg, masaPaneliStelazaKg],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const balastZaMaly = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napor-wiatru" />
      <NaglowekEkranu
        tytul={t("UI-NAPWIA-AERODYNAMIKA-NAPOR-WIATRU")}
        ekran="napor-wiatru"
        wynik={result}
        parametry={{ rho: GESTOSC_POWIETRZA_KG_M3 }}
      >
        {t("UI-NAPWIA-PANEL-DZIALA-TROCHE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-NAPWIA-PREDKOSC-WIATRU")}
          unit="m/s"
          type="number"
          inputMode="decimal"
          min={0}
          value={predkoscWiatruMS}
          onChange={(e) => setPredkoscWiatruMS(e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="predkosc" />}
        />
        <Pole
          label={t("UI-NAPWIA-POWIERZCHNIA-PANELU")}
          unit="m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={powierzchniaM2}
          onChange={(e) => setPowierzchniaM2(e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="powierzchnia" />}
        />
        <Pole
          label={t("UI-NAPWIA-WSPOLCZYNNIK-OPORU")}
          unit="—"
          type="number"
          inputMode="decimal"
          min={0}
          value={cd}
          onChange={(e) => setCd(e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="cd" params={{ cdMin: CD_TYPOWY_MIN, cdMax: CD_TYPOWY_MAX }} />}
        />
        <Pole
          label={t("UI-NAPWIA-PLANOWANY-BALAST-OPCJONALNIE")}
          unit="kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={balastPlanowanyKg}
          onChange={(e) => setBalastPlanowanyKg(e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="balast" />}
        />
        <Pole
          label={t("UI-NAPWIA-MASA-PANELU-STELAZA")}
          unit="kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={masaPaneliStelazaKg}
          onChange={(e) => setMasaPaneliStelazaKg(e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="masa" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-NAPWIA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-NAPWIA-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={balastZaMaly ? "blad" : "uwaga"}
          etykieta={balastZaMaly ? t("UI-NAPWIA-MALY-BALAST-STELAZ") : t("UI-NAPWIA-SILA-NAPORU-BALAST")}
        >
          <WynikGlowny>{result.value.silaNaporuN.toFixed(0)} N</WynikGlowny>
          <p className="text-small">
            {t("UI-NAPWIA-BALAST-PROJEKTOWY-PRZECIW")}
            {masaPaneliStelazaKg !== "" ? ` ${t("UI-NAPWIA-PONAD-CIEZAR-PANELU")}` : ""}{t("UI-NAPWIA-NAJMNIEJ")}{" "}
            <strong>{Math.ceil(result.value.balastProjektowyKg).toLocaleString("pl-PL")} kg</strong>
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
