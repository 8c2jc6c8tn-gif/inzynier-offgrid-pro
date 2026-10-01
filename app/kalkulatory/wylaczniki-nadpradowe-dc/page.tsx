"use client"

import { useMemo } from "react"
import { calculateWylacznikiNadpradoweDc } from "@/lib/core/modules/okablowanie/wylaczniki-nadpradowe-dc/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pradA: string
  napiecieV: string
  liczbaBiegunow: string
  certyfikowanyDoDc: boolean
  aicA: string
  pradZwarciowyA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pradA: "",
  napiecieV: "",
  liczbaBiegunow: "",
  certyfikowanyDoDc: false,
  aicA: "",
  pradZwarciowyA: "",
}

export default function WylacznikiNadpradoweDcPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wylaczniki-nadpradowe-dc", STAN_POCZATKOWY)
  const { pradA, napiecieV, liczbaBiegunow, certyfikowanyDoDc, aicA, pradZwarciowyA } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setLiczbaBiegunow = (a: string | ((p: string) => string)) => setPole("liczbaBiegunow", a)
  const setCertyfikowanyDoDc = (a: boolean | ((p: boolean) => boolean)) => setPole("certyfikowanyDoDc", a)
  const setAicA = (a: string | ((p: string) => string)) => setPole("aicA", a)
  const setPradZwarciowyA = (a: string | ((p: string) => string)) => setPole("pradZwarciowyA", a)

  const result = useMemo(
    () =>
      calculateWylacznikiNadpradoweDc({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        liczbaBiegunow: liczbaBiegunow === "" ? 0 : Number(liczbaBiegunow),
        certyfikowanyDoDc,
        aicA: aicA === "" ? 0 : Number(aicA),
        pradZwarciowyA: pradZwarciowyA === "" ? 0 : Number(pradZwarciowyA),
      }),
    [pradA, napiecieV, liczbaBiegunow, certyfikowanyDoDc, aicA, pradZwarciowyA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }
  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-WYLNADDC-POLICZYC"),
    incomplete: t("UI-WYLNADDC-WYPELNIJ-PRAD-NAPIECIE"),
    red: t("UI-WYLNADDC-ZABRONIONE-WYLACZNIK-SPELNIA"),
    green: t("UI-WYLNADDC-WYLACZNIK-DOBRANY-POPRAWNIE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wylaczniki-nadpradowe-dc" />
      <NaglowekEkranu tytul={t("UI-WYLNADDC-WYLACZNIKI-NADPRADOWE")} ekran="wylaczniki-nadpradowe-dc" wynik={result}>
        {t("UI-WYLNADDC-PRAD-STALY-PALI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-WYLNADDC-PRAD-OBWODU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-nadpradowe-dc" pole="prad" />}
        />
        <Pole
          label={t("UI-WYLNADDC-NAPIECIE-OBWODU")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-nadpradowe-dc" pole="napiecie" />}
        />
        <Pole
          label={t("UI-WYLNADDC-LICZBA-BIEGUNOW")}
          unit=""
          type="number"
          inputMode="decimal"
          min={0}
          value={liczbaBiegunow}
          onChange={(e) => setLiczbaBiegunow(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-nadpradowe-dc" pole="bieguny" />}
        />
        <PoleCheckbox
          id="certyfikowany-dc"
          label={t("UI-WYLNADDC-WYLACZNIK-CERTYFIKACJE-PRACY")}
          checked={certyfikowanyDoDc}
          onChange={(e) => setCertyfikowanyDoDc(e.target.checked)}
        />
        <Pole
          label={t("UI-WYLNADDC-ZDOLNOSC-WYLACZANIA-AIC")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={aicA}
          onChange={(e) => setAicA(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-nadpradowe-dc" pole="aic" />}
        />
        <Pole
          label={t("UI-WYLNADDC-PRAD-ZWARCIOWY-TYM")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradZwarciowyA}
          onChange={(e) => setPradZwarciowyA(e.target.value)}
          pomoc={<PomocPola ekran="wylaczniki-nadpradowe-dc" pole="pradZwarcia" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
