"use client"

import { useMemo } from "react"
import { calculateStratyOkablowanieDc } from "@/lib/core/modules/pv/straty-okablowanie-dc/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomOstrzezen } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { CEL_STRATY_MAX_PCT, REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M } from "@/lib/core/modules/pv/straty-okablowanie-dc/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  dlugoscKablaM: string
  pradA: string
  napiecieV: string
  przekrojMm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dlugoscKablaM: "",
  pradA: "",
  napiecieV: "",
  przekrojMm2: "",
}

export default function StratyOkablowanieDcPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("straty-okablowanie-dc", STAN_POCZATKOWY)
  const { dlugoscKablaM, pradA, napiecieV, przekrojMm2 } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setDlugoscKablaM = (a: string | ((p: string) => string)) => setPole("dlugoscKablaM", a)
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setPrzekrojMm2 = (a: string | ((p: string) => string)) => setPole("przekrojMm2", a)

  const result = useMemo(
    () =>
      calculateStratyOkablowanieDc({
        dlugoscKablaM: dlugoscKablaM === "" ? 0 : Number(dlugoscKablaM),
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        przekrojMm2: przekrojMm2 === "" ? 0 : Number(przekrojMm2),
      }),
    [dlugoscKablaM, pradA, napiecieV, przekrojMm2],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/straty-okablowanie-dc" />
      <NaglowekEkranu
        tytul={t("UI-STROKADC-STRATY-OKABLOWANIU")}
        ekran="straty-okablowanie-dc"
        wynik={result}
        parametry={{ cel: CEL_STRATY_MAX_PCT, rhoCu: REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M }}
      >
        {t("UI-STROKADC-PRAD-PLYNACY-KABLEM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-STROKADC-DLUGOSC-KABLA-PANEL")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscKablaM}
          onChange={(e) => setDlugoscKablaM(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="dlugosc" />}
        />
        <Pole
          label={t("UI-STROKADC-PRAD-ROBOCZY-IMP")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="prad" />}
        />
        <Pole
          label={t("UI-STROKADC-NAPIECIE-ROBOCZE-VMP")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="napiecie" />}
        />
        <Pole
          label={t("UI-STROKADC-PRZEKROJ-KABLA")}
          unit="mm²"
          type="number"
          inputMode="decimal"
          min={0}
          value={przekrojMm2}
          onChange={(e) => setPrzekrojMm2(e.target.value)}
          pomoc={<PomocPola ekran="straty-okablowanie-dc" pole="przekroj" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-STROKADC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-STROKADC-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel
          poziom={poziomOstrzezen(result.status)}
          etykieta={t("UI-STROKADC-STRATA-MOCY-KABLU")}
        >
          <WynikGlowny>{result.value.strataProcentowa.toFixed(1)}%</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-STROKADC-SPADEK-NAPIECIA-STRATA", { spadekNapieciaV: result.value.spadekNapieciaV.toFixed(2), strataMocyW: result.value.strataMocyW.toFixed(1) })}
          </p>
          <div className="mt-3 flex flex-col gap-1 text-small">
            <p className="font-medium">{t("UI-STROKADC-POROWNANIE-PRZEKROJOW")}</p>
            {result.value.porownaniePrzekrojow.map((p) => (
              <p key={p.przekrojMm2}>
                {p.przekrojMm2} mm² → {p.strataProcentowa.toFixed(1)}%
              </p>
            ))}
          </div>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
