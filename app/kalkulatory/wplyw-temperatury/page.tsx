"use client"

import { useMemo } from "react"
import { calculateWplywTemperatury } from "@/lib/core/modules/pv/wplyw-temperatury/calculator"
import {
  GAMMA_TYPOWA_MAX_PCT_NA_C,
  GAMMA_TYPOWA_MIN_PCT_NA_C,
  PRZYROST_TEMPERATURY_TYPOWY_MAX_C,
  PRZYROST_TEMPERATURY_TYPOWY_MIN_C,
  TEMPERATURA_REFERENCYJNA_STC_C,
} from "@/lib/core/modules/pv/wplyw-temperatury/constants"
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
  const t = useTranslate()
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
      <NaglowekEkranu
        tytul={t("UI-WPLTEM-WPLYW-TEMPERATURY-WYDAJNOSC")}
        ekran="wplyw-temperatury"
        wynik={result}
        parametry={{ tStc: TEMPERATURA_REFERENCYJNA_STC_C }}
      >
        {t("UI-WPLTEM-PANELE-LUBIA-UPALOW")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-WPLTEM-TEMPERATURA-OTOCZENIA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
          pomoc={<PomocPola ekran="wplyw-temperatury" pole="tOtoczenia" />}
        />
        <Pole
          label={t("UI-WPLTEM-PRZYROST-TEMPERATURY-PANELU")}
          unit="°C"
          type="number"
          inputMode="decimal"
          min={0}
          value={przyrostTemperaturyC}
          onChange={(e) => setPrzyrostTemperaturyC(e.target.value)}
          pomoc={<PomocPola ekran="wplyw-temperatury" pole="przyrost" params={{ przyrostMin: PRZYROST_TEMPERATURY_TYPOWY_MIN_C, przyrostMax: PRZYROST_TEMPERATURY_TYPOWY_MAX_C }} />}
        />
        <Pole
          label={t("UI-WPLTEM-WSPOLCZYNNIK-TEMPERATUROWY-M")}
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={gammaPctNaC}
          onChange={(e) => setGammaPctNaC(e.target.value)}
          pomoc={<PomocPola ekran="wplyw-temperatury" pole="gamma" params={{ gammaMin: GAMMA_TYPOWA_MIN_PCT_NA_C, gammaMax: GAMMA_TYPOWA_MAX_PCT_NA_C }} />}
        />
        <Pole
          label={t("UI-WPLTEM-MOC-NOMINALNA-PANELU")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocNominalnaW}
          onChange={(e) => setMocNominalnaW(e.target.value)}
          pomoc={<PomocPola ekran="wplyw-temperatury" pole="moc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-WPLTEM-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-WPLTEM-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-WPLTEM-MOC-RZECZYWISTA-PANELU")}>
          <WynikGlowny>{result.value.mocRzeczywistaW.toFixed(0)} W</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-WPLTEM-TEMPERATURA-PANELU-STRATA", { temperaturaPanelaC: result.value.temperaturaPanelaC.toFixed(0), strataPct: result.value.strataPct.toFixed(1) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
