"use client"

import { useMemo } from "react"
import { calculateWplywTemperatury } from "@/lib/core/modules/pv/wplyw-temperatury/calculator"
import {
  GAMMA_TYPOWA_MAX_PCT_NA_C,
  GAMMA_TYPOWA_MIN_PCT_NA_C,
  PRZYROST_TEMPERATURY_TYPOWY_MAX_C,
  PRZYROST_TEMPERATURY_TYPOWY_MIN_C,
} from "@/lib/core/modules/pv/wplyw-temperatury/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  temperaturaOtoczeniaC: string
  przyrostTemperaturyC: string
  gammaPctNaC: string
  mocNominalnaW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaOtoczeniaC: "",
  przyrostTemperaturyC: "",
  gammaPctNaC: "",
  mocNominalnaW: "",
}

export default function WplywTemperaturyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wplyw-temperatury", STAN_POCZATKOWY)
  const { temperaturaOtoczeniaC, przyrostTemperaturyC, gammaPctNaC, mocNominalnaW } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaOtoczeniaC = (a: string | ((p: string) => string)) => setPole("temperaturaOtoczeniaC", a)
  const setPrzyrostTemperaturyC = (a: string | ((p: string) => string)) => setPole("przyrostTemperaturyC", a)
  const setGammaPctNaC = (a: string | ((p: string) => string)) => setPole("gammaPctNaC", a)
  const setMocNominalnaW = (a: string | ((p: string) => string)) => setPole("mocNominalnaW", a)

  const result = useMemo(
    () =>
      calculateWplywTemperatury({
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        przyrostTemperaturyC: przyrostTemperaturyC === "" ? 0 : Number(przyrostTemperaturyC),
        gammaPctNaC: gammaPctNaC === "" ? 0 : Number(gammaPctNaC),
        mocNominalnaW: mocNominalnaW === "" ? 0 : Number(mocNominalnaW),
      }),
    [temperaturaOtoczeniaC, przyrostTemperaturyC, gammaPctNaC, mocNominalnaW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wplyw-temperatury" />
      <NaglowekEkranu tytul="Wpływ temperatury na wydajność">
        Panele nie lubią upałów — paradoksalnie, najzimniejszy słoneczny dzień daje więcej mocy
        niż najgorętszy. Moduł 3, Ekran 18.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Temperatura otoczenia"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
        />
        <Pole
          label="Przyrost temperatury panelu ponad otoczenie"
          unit="°C"
          type="number"
          inputMode="decimal"
          min={0}
          value={przyrostTemperaturyC}
          onChange={(e) => setPrzyrostTemperaturyC(e.target.value)}
          hint={`Typowo ${PRZYROST_TEMPERATURY_TYPOWY_MIN_C}–${PRZYROST_TEMPERATURY_TYPOWY_MAX_C}°C (nagrzewanie od słońca).`}
        />
        <Pole
          label="Współczynnik temperaturowy mocy γ"
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={gammaPctNaC}
          onChange={(e) => setGammaPctNaC(e.target.value)}
          hint={`Typowo ${GAMMA_TYPOWA_MIN_PCT_NA_C} do ${GAMMA_TYPOWA_MAX_PCT_NA_C}%/°C (z karty katalogowej panelu).`}
        />
        <Pole
          label="Moc nominalna panelu (STC, 25°C)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocNominalnaW}
          onChange={(e) => setMocNominalnaW(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Moc rzeczywista panelu">
          <WynikGlowny>{result.value.mocRzeczywistaW.toFixed(0)} W</WynikGlowny>
          <p className="mt-2 text-small">
            Temperatura panelu: {result.value.temperaturaPanelaC.toFixed(0)}°C · strata mocy:{" "}
            {result.value.strataPct.toFixed(1)}%.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
