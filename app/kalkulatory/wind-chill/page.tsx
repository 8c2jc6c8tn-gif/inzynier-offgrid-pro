"use client"

import { useMemo } from "react"
import { calculateWindChill } from "@/lib/core/modules/stress-test/wind-chill/calculator"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import {
  WIND_CHILL_A,
  WIND_CHILL_B,
  WIND_CHILL_C,
  WIND_CHILL_D,
  WIND_CHILL_MAX_TEMP_C,
  WIND_CHILL_MIN_PREDKOSC_KMH,
  WIND_CHILL_WYKLADNIK,
} from "@/lib/core/modules/stress-test/wind-chill/constants"

type FormularzStan = {
  temperaturaC: string
  predkoscWiatruKmh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaC: "",
  predkoscWiatruKmh: "",
}

export default function WindChillPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wind-chill", STAN_POCZATKOWY)
  const { temperaturaC, predkoscWiatruKmh } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaC = (a: string | ((p: string) => string)) => setPole("temperaturaC", a)
  const setPredkoscWiatruKmh = (a: string | ((p: string) => string)) => setPole("predkoscWiatruKmh", a)

  const result = useMemo(
    () =>
      calculateWindChill({
        temperaturaC: temperaturaC === "" ? null : Number(temperaturaC),
        predkoscWiatruKmh: predkoscWiatruKmh === "" ? 0 : Number(predkoscWiatruKmh),
      }),
    [temperaturaC, predkoscWiatruKmh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wind-chill" />
      <NaglowekEkranu
        tytul={t("UI-WINCHI-WIND-CHILL-TEMPERATURA")}
        ekran="wind-chill"
        wynik={result}
        parametry={{
          maxT: WIND_CHILL_MAX_TEMP_C,
          minV: WIND_CHILL_MIN_PREDKOSC_KMH,
          wcA: WIND_CHILL_A,
          wcB: WIND_CHILL_B,
          wcC: WIND_CHILL_C,
          wcD: WIND_CHILL_D,
          wcE: WIND_CHILL_WYKLADNIK,
        }}
      >
        {t("UI-WINCHI-WIATR-WYWIEWA-CIEPLO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-WINCHI-TEMPERATURA-POWIETRZA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaC}
          onChange={(e) => setTemperaturaC(e.target.value)}
          pomoc={<PomocPola ekran="wind-chill" pole="temp" params={{ maxT: WIND_CHILL_MAX_TEMP_C }} />}
        />
        <Pole
          label={t("UI-WINCHI-PREDKOSC-WIATRU")}
          unit="km/h"
          type="number"
          inputMode="decimal"
          min={0}
          value={predkoscWiatruKmh}
          onChange={(e) => setPredkoscWiatruKmh(e.target.value)}
          pomoc={<PomocPola ekran="wind-chill" pole="wiatr" params={{ minV: WIND_CHILL_MIN_PREDKOSC_KMH }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-WINCHI-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-WINCHI-WYPELNIJ-OBA-POLA")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-WINCHI-POZA-ZAKRESEM-WZORU")}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-WINCHI-TEMPERATURA-ODCZUWALNA")}>
          <WynikGlowny>{result.value.temperaturaOdczuwalnaC.toFixed(1)} °C</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
