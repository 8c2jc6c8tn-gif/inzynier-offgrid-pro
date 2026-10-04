"use client"

import { useMemo } from "react"
import { calculateBuforCiepla } from "@/lib/core/modules/ogrzewanie/bufor-ciepla/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { ZALECANA_POJEMNOSC_L_NA_KW } from "@/lib/core/modules/ogrzewanie/bufor-ciepla/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { SekcjaPracaZBuforem } from "./sekcja-praca-z-buforem"

type FormularzStan = {
  mocPompyKw: string
  pojemnoscBuforaL: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocPompyKw: "",
  pojemnoscBuforaL: "",
}

export default function BuforCieplaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bufor-ciepla", STAN_POCZATKOWY)
  const { mocPompyKw, pojemnoscBuforaL } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocPompyKw = (a: string | ((p: string) => string)) => setPole("mocPompyKw", a)
  const setPojemnoscBuforaL = (a: string | ((p: string) => string)) => setPole("pojemnoscBuforaL", a)

  const result = useMemo(
    () =>
      calculateBuforCiepla({
        mocPompyKw: mocPompyKw === "" ? 0 : Number(mocPompyKw),
        pojemnoscBuforaL: pojemnoscBuforaL === "" ? 0 : Number(pojemnoscBuforaL),
      }),
    [mocPompyKw, pojemnoscBuforaL],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bufor-ciepla" />
      <NaglowekEkranu tytul={t("UI-BUFCIE-BUFOR-CIEPLA-DOBOR")} ekran="bufor-ciepla" wynik={result} parametry={{ lkw: ZALECANA_POJEMNOSC_L_NA_KW }}>
        {t("UI-BUFCIE-BUFOR-TERMOS-CIEPLA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-BUFCIE-MOC-POMPY-CIEPLA")}
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPompyKw}
          onChange={(e) => setMocPompyKw(e.target.value)}
          pomoc={<PomocPola ekran="bufor-ciepla" pole="moc" />}
        />
        <Pole
          label={t("UI-BUFCIE-POSIADANA-PLANOWANA-POJEMNOS")}
          unit="l"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscBuforaL}
          onChange={(e) => setPojemnoscBuforaL(e.target.value)}
          pomoc={<PomocPola ekran="bufor-ciepla" pole="pojemnosc" params={{ lkw: ZALECANA_POJEMNOSC_L_NA_KW }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-BUFCIE-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-BUFCIE-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t("UI-BUFCIE-ZALECANA-POJEMNOSC-BUFORA")}>
          <WynikGlowny>{result.value.zalecanaPojemnoscL.toFixed(0)} l</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <SekcjaPracaZBuforem
        mocPompyKw={mocPompyKw === "" ? 0 : Number(mocPompyKw)}
        buforL={pojemnoscBuforaL === "" ? 0 : Number(pojemnoscBuforaL)}
      />
    </main>
  )
}
