"use client"

import { useMemo } from "react"
import { calculateColdCRate } from "@/lib/core/modules/baterie/cold-c-rate/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"
import { LIMIT_C_RATE_CHLODNO, PROG_BLOKADY_C, PROG_LUKI_GORNY_C, PROG_PELNEGO_PRADU_C } from "@/lib/core/modules/baterie/cold-c-rate/constants"

const POZIOM_ZE_STREFY: Record<string, WerdyktPoziom> = {
  blokada: "blad",
  "limit-02c": "uwaga",
  "luka-zrodla": "uwaga",
  "pelny-prad": "ok",
}

const ETYKIETA_ZE_STREFY: Record<string, string> = {
  blokada: "UI-COLCRAT-LADOWANIE-ZABLOKOWANE-ZIMNO",
  "limit-02c": "UI-COLCRAT-LADOWANIE-OGRANICZONE-2",
  "luka-zrodla": "UI-COLCRAT-ZAKRES-NIEOKRESLONY-ZRODLE",
  "pelny-prad": "UI-COLCRAT-BRAK-OGRANICZENIA",
}

type FormularzStan = {
  temperaturaOgniwaC: string
  pojemnoscAh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaOgniwaC: "",
  pojemnoscAh: "",
}

export default function ColdCRatePage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("cold-c-rate", STAN_POCZATKOWY)
  const { temperaturaOgniwaC, pojemnoscAh } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaOgniwaC = (a: string | ((p: string) => string)) => setPole("temperaturaOgniwaC", a)
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)

  const result = useMemo(
    () =>
      calculateColdCRate({
        temperaturaOgniwaC: temperaturaOgniwaC === "" ? null : Number(temperaturaOgniwaC),
        pojemnoscAh: pojemnoscAh === "" ? 0 : Number(pojemnoscAh),
      }),
    [temperaturaOgniwaC, pojemnoscAh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cold-c-rate" />
      <NaglowekEkranu
        tytul={t("UI-COLCRAT-OGRANICZENIE-PRADU-LADOWANIA")}
        ekran="cold-c-rate"
        wynik={result}
        parametry={{ blokada: PROG_BLOKADY_C, luka: PROG_LUKI_GORNY_C, pelny: PROG_PELNEGO_PRADU_C, cChlodno: LIMIT_C_RATE_CHLODNO }}
      >
        {t("UI-COLCRAT-LODOWCE-MIOD-LEDWO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-COLCRAT-TEMPERATURA-OGNIWA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={temperaturaOgniwaC}
          onChange={(e) => setTemperaturaOgniwaC(e.target.value)}
          pomoc={<PomocPola ekran="cold-c-rate" pole="temperatura" params={{ blokada: PROG_BLOKADY_C, luka: PROG_LUKI_GORNY_C, pelny: PROG_PELNEGO_PRADU_C, cChlodno: LIMIT_C_RATE_CHLODNO }} />}
        />
        <Pole
          label={t("UI-COLCRAT-POJEMNOSC-PAKIETU")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
          pomoc={<PomocPola ekran="cold-c-rate" pole="pojemnosc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-COLCRAT-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-COLCRAT-WPISZ-TEMPERATURE-POJEMNOSC")}</p>
      ) : (
        <WerdyktPanel
          poziom={POZIOM_ZE_STREFY[result.value.strefa]}
          etykieta={t(ETYKIETA_ZE_STREFY[result.value.strefa]!)}
        >
          {result.value.maxPradA !== null && (
            <WynikGlowny>{formatLiczbe(result.value.maxPradA)} A</WynikGlowny>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
