"use client"

import { useMemo } from "react"
import { calculateReguRatorPwmMppt } from "@/lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt/calculator"
import { PROG_MOC_MPPT_OPLACALNY_W } from "@/lib/core/modules/kalkulator-mobilny/dobor-regulatora-pwm-mppt/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  mocPaneliW: string
  napiecieNominalnePaneluV: string
  napiecieAkumulatoraV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocPaneliW: "",
  napiecieNominalnePaneluV: "",
  napiecieAkumulatoraV: "",
}

export default function DoborRegulatoraPwmMpptPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-regulatora-pwm-mppt", STAN_POCZATKOWY)
  const { mocPaneliW, napiecieNominalnePaneluV, napiecieAkumulatoraV } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocPaneliW = (a: string | ((p: string) => string)) => setPole("mocPaneliW", a)
  const setNapiecieNominalnePaneluV = (a: string | ((p: string) => string)) => setPole("napiecieNominalnePaneluV", a)
  const setNapiecieAkumulatoraV = (a: string | ((p: string) => string)) => setPole("napiecieAkumulatoraV", a)

  const result = useMemo(
    () =>
      calculateReguRatorPwmMppt({
        mocPaneliW: mocPaneliW === "" ? 0 : Number(mocPaneliW),
        napiecieNominalnePaneluV: napiecieNominalnePaneluV === "" ? 0 : Number(napiecieNominalnePaneluV),
        napiecieAkumulatoraV: napiecieAkumulatoraV === "" ? 0 : Number(napiecieAkumulatoraV),
      }),
    [mocPaneliW, napiecieNominalnePaneluV, napiecieAkumulatoraV],
  )

  const poziom: WerdyktPoziom = result.value.niezgodnoscNapiec ? "blad" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-regulatora-pwm-mppt" />
      <NaglowekEkranu
        tytul={t("UI-DOBREGPWMMPP-DOBOR-REGULATORA-PWM")}
        ekran="dobor-regulatora-pwm-mppt"
        wynik={result}
        parametry={{ progMppt: PROG_MOC_MPPT_OPLACALNY_W }}
      >
        {t("UI-DOBREGPWMMPP-PWM-TANI-ROBOTNIK")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DOBREGPWMMPP-MOC-PANELI")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPaneliW}
          onChange={(e) => setMocPaneliW(e.target.value)}
          pomoc={<PomocPola ekran="dobor-regulatora-pwm-mppt" pole="moc" params={{ progMppt: PROG_MOC_MPPT_OPLACALNY_W }} />}
        />
        <Pole
          label={t("UI-DOBREGPWMMPP-NAPIECIE-PANELI-KLASA")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieNominalnePaneluV}
          onChange={(e) => setNapiecieNominalnePaneluV(e.target.value)}
          pomoc={<PomocPola ekran="dobor-regulatora-pwm-mppt" pole="napieciePanelu" />}
        />
        <Pole
          label={t("UI-DOBREGPWMMPP-NAPIECIE-SYSTEMOWE-AKUMULATO")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieAkumulatoraV}
          onChange={(e) => setNapiecieAkumulatoraV(e.target.value)}
          pomoc={<PomocPola ekran="dobor-regulatora-pwm-mppt" pole="napiecieAkumulatora" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DOBREGPWMMPP-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DOBREGPWMMPP-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.niezgodnoscNapiec ? t("UI-DOBREGPWMMPP-PWM-NIEKOMPATYBILNY") : t("UI-DOBREGPWMMPP-REKOMENDACJA")}
        >
          <WynikGlowny>{result.value.regulator}</WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
