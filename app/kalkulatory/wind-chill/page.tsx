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
import { WIND_CHILL_MAX_TEMP_C, WIND_CHILL_MIN_PREDKOSC_KMH } from "@/lib/core/modules/stress-test/wind-chill/constants"

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
        tytul="Wind Chill — temperatura odczuwalna"
        ekran="wind-chill"
        wzor={result.formula}
        parametry={{ maxT: WIND_CHILL_MAX_TEMP_C, minV: WIND_CHILL_MIN_PREDKOSC_KMH }}
      >
        Wiatr wywiewa ciepło z domu nawet wtedy, gdy termometr nie pokazuje wcale tak niskiej
        temperatury — liczy się nie tylko stopień, ale i to, jak mocno wieje. Moduł 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Temperatura powietrza"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaC}
          onChange={(e) => setTemperaturaC(e.target.value)}
          pomoc={<PomocPola ekran="wind-chill" pole="temp" params={{ maxT: WIND_CHILL_MAX_TEMP_C }} />}
        />
        <Pole
          label="Prędkość wiatru"
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
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij oba pola, żeby zobaczyć wynik.</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="uwaga" etykieta="Poza zakresem wzoru">
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Temperatura odczuwalna">
          <WynikGlowny>{result.value.temperaturaOdczuwalnaC.toFixed(1)} °C</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
