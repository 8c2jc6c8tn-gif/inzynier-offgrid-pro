"use client"

import { useMemo } from "react"
import { calculateStressTestMppt } from "@/lib/core/modules/pv/stress-test-mppt/calculator"
import {
  BETA_TYPOWA_MAX_PCT_NA_C,
  BETA_TYPOWA_MIN_PCT_NA_C,
  PROG_OSTRZEGAWCZY_UDZIAL_LIMITU,
  TEMPERATURA_REFERENCYJNA_STC_C,
} from "@/lib/core/modules/pv/stress-test-mppt/constants"
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
  vocStcV: string
  betaPctNaC: string
  tminC: string
  liczbaPaneliWStringu: string
  limitMpptV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  vocStcV: "",
  betaPctNaC: "",
  tminC: "",
  liczbaPaneliWStringu: "",
  limitMpptV: "",
}

export default function StressTestMpptPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("stress-test-mppt", STAN_POCZATKOWY)
  const { vocStcV, betaPctNaC, tminC, liczbaPaneliWStringu, limitMpptV } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setVocStcV = (a: string | ((p: string) => string)) => setPole("vocStcV", a)
  const setBetaPctNaC = (a: string | ((p: string) => string)) => setPole("betaPctNaC", a)
  const setTminC = (a: string | ((p: string) => string)) => setPole("tminC", a)
  const setLiczbaPaneliWStringu = (a: string | ((p: string) => string)) => setPole("liczbaPaneliWStringu", a)
  const setLimitMpptV = (a: string | ((p: string) => string)) => setPole("limitMpptV", a)

  const result = useMemo(
    () =>
      calculateStressTestMppt({
        vocStcV: vocStcV === "" ? 0 : Number(vocStcV),
        betaPctNaC: betaPctNaC === "" ? 0 : Number(betaPctNaC),
        tminC: tminC === "" ? null : Number(tminC),
        liczbaPaneliWStringu: liczbaPaneliWStringu === "" ? 0 : Number(liczbaPaneliWStringu),
        limitMpptV: limitMpptV === "" ? 0 : Number(limitMpptV),
      }),
    [vocStcV, betaPctNaC, tminC, liczbaPaneliWStringu, limitMpptV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : hasCritical
          ? "red"
          : hasWarning
            ? "yellow"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-STRTESMPP-POLICZYC"),
    incomplete: t("UI-STRTESMPP-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-STRTESMPP-ZABRONIONE-RYZYKO-TRWALEGO"),
    yellow: t("UI-STRTESMPP-DOPUSZCZALNE-MALY-MARGINES"),
    green: t("UI-STRTESMPP-BEZPIECZNY-MARGINES"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/stress-test-mppt" />
      <NaglowekEkranu
        tytul={t("UI-STRTESMPP-ZIMOWY-STRESS-TEST")}
        ekran="stress-test-mppt"
        wynik={result}
        parametry={{
          progOstrzezenia: Math.round(PROG_OSTRZEGAWCZY_UDZIAL_LIMITU * 100),
          tStc: TEMPERATURA_REFERENCYJNA_STC_C,
        }}
      >
        {t("UI-STRTESMPP-PANELE-ZACHOWUJA-ODWROTNIE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-STRTESMPP-VOC-PANELU-STC")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vocStcV}
          onChange={(e) => setVocStcV(e.target.value)}
          pomoc={<PomocPola ekran="stress-test-mppt" pole="voc" />}
        />
        <Pole
          label={t("UI-STRTESMPP-WSPOLCZYNNIK-TEMPERATUROWY-V")}
          unit="%/°C"
          type="number"
          inputMode="decimal"
          value={betaPctNaC}
          onChange={(e) => setBetaPctNaC(e.target.value)}
          pomoc={<PomocPola ekran="stress-test-mppt" pole="beta" params={{ betaMin: BETA_TYPOWA_MIN_PCT_NA_C, betaMax: BETA_TYPOWA_MAX_PCT_NA_C }} />}
        />
        <Pole
          label={t("UI-STRTESMPP-MINIMALNA-TEMPERATURA-LOKALI")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={tminC}
          onChange={(e) => setTminC(e.target.value)}
          pomoc={<PomocPola ekran="stress-test-mppt" pole="tmin" />}
        />
        <Pole
          label={t("UI-STRTESMPP-LICZBA-PANELI-STRINGU")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaPaneliWStringu}
          onChange={(e) => setLiczbaPaneliWStringu(e.target.value)}
          pomoc={<PomocPola ekran="stress-test-mppt" pole="liczbaPaneli" />}
        />
        <Pole
          label={t("UI-STRTESMPP-MAX-NAPIECIE-WEJSCIOWE")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={limitMpptV}
          onChange={(e) => setLimitMpptV(e.target.value)}
          pomoc={<PomocPola ekran="stress-test-mppt" pole="limit" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{t("UI-STRTESMPP-STRING", { vStringV: result.value.vStringV.toFixed(0) })}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
