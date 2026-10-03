"use client"

import { useMemo } from "react"
import { calculateRyzykoNiskiegoNapiecia } from "@/lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/calculator"
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
  minNapiecieRoboczeV: string
  aktualneNapiecieSystemuV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  minNapiecieRoboczeV: "",
  aktualneNapiecieSystemuV: "",
}

export default function RyzykoNiskiegoNapieciaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ryzyko-niskiego-napiecia", STAN_POCZATKOWY)
  const { minNapiecieRoboczeV, aktualneNapiecieSystemuV } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMinNapiecieRoboczeV = (a: string | ((p: string) => string)) => setPole("minNapiecieRoboczeV", a)
  const setAktualneNapiecieSystemuV = (a: string | ((p: string) => string)) => setPole("aktualneNapiecieSystemuV", a)

  const result = useMemo(
    () =>
      calculateRyzykoNiskiegoNapiecia({
        minNapiecieRoboczeV: minNapiecieRoboczeV === "" ? 0 : Number(minNapiecieRoboczeV),
        aktualneNapiecieSystemuV: aktualneNapiecieSystemuV === "" ? 0 : Number(aktualneNapiecieSystemuV),
      }),
    [minNapiecieRoboczeV, aktualneNapiecieSystemuV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-niskiego-napiecia" />
      <NaglowekEkranu tytul={t("UI-RYZNISNAP-RYZYKO-WYLACZENIA-POMPY")} ekran="ryzyko-niskiego-napiecia" wynik={result}>
        {t("UI-RYZNISNAP-NISKIE-NAPIECIE-CICHY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-RYZNISNAP-MINIMALNE-NAPIECIE-PRACY")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={minNapiecieRoboczeV}
          onChange={(e) => setMinNapiecieRoboczeV(e.target.value)}
          pomoc={<PomocPola ekran="ryzyko-niskiego-napiecia" pole="vMin" />}
        />
        <Pole
          label={t("UI-RYZNISNAP-AKTUALNE-NAPIECIE-SYSTEMU")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={aktualneNapiecieSystemuV}
          onChange={(e) => setAktualneNapiecieSystemuV(e.target.value)}
          pomoc={<PomocPola ekran="ryzyko-niskiego-napiecia" pole="vSys" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-RYZNISNAP-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-RYZNISNAP-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? t("UI-RYZNISNAP-POMPA-WYLACZY") : t("UI-RYZNISNAP-MARGINES-PROGU-WYLACZENIA")}>
          <WynikGlowny>{result.value.marginesV.toFixed(1)} V</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
