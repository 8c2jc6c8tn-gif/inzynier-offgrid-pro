"use client"

import { useMemo } from "react"
import { calculateDopasowanieTablicyFalownika } from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { DC_AC_RATIO_ZALECANE_MAX, DC_AC_RATIO_ZALECANE_MIN } from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/constants"
import { BETA_TYPOWA_MAX_PCT_NA_C, BETA_TYPOWA_MIN_PCT_NA_C } from "@/lib/core/modules/pv/stress-test-mppt/constants"

type FormularzStan = {
  vocStcV: string
  vmpStcV: string
  impA: string
  betaPctNaC: string
  tminC: string
  liczbaPaneliWStringu: string
  vMaxFalownikaV: string
  mpptMinV: string
  mpptMaxV: string
  iMaxMpptA: string
  mocFalownikaAcW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  vocStcV: "",
  vmpStcV: "",
  impA: "",
  betaPctNaC: "",
  tminC: "",
  liczbaPaneliWStringu: "",
  vMaxFalownikaV: "",
  mpptMinV: "",
  mpptMaxV: "",
  iMaxMpptA: "",
  mocFalownikaAcW: "",
}

export default function DopasowanieTablicyFalownikaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dopasowanie-tablicy-falownika", STAN_POCZATKOWY)
  const {
    vocStcV,
    vmpStcV,
    impA,
    betaPctNaC,
    tminC,
    liczbaPaneliWStringu,
    vMaxFalownikaV,
    mpptMinV,
    mpptMaxV,
    iMaxMpptA,
    mocFalownikaAcW,
  } = stan

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
  const setVmpStcV = (a: string | ((p: string) => string)) => setPole("vmpStcV", a)
  const setImpA = (a: string | ((p: string) => string)) => setPole("impA", a)
  const setBetaPctNaC = (a: string | ((p: string) => string)) => setPole("betaPctNaC", a)
  const setTminC = (a: string | ((p: string) => string)) => setPole("tminC", a)
  const setLiczbaPaneliWStringu = (a: string | ((p: string) => string)) => setPole("liczbaPaneliWStringu", a)
  const setVMaxFalownikaV = (a: string | ((p: string) => string)) => setPole("vMaxFalownikaV", a)
  const setMpptMinV = (a: string | ((p: string) => string)) => setPole("mpptMinV", a)
  const setMpptMaxV = (a: string | ((p: string) => string)) => setPole("mpptMaxV", a)
  const setIMaxMpptA = (a: string | ((p: string) => string)) => setPole("iMaxMpptA", a)
  const setMocFalownikaAcW = (a: string | ((p: string) => string)) => setPole("mocFalownikaAcW", a)

  const result = useMemo(
    () =>
      calculateDopasowanieTablicyFalownika({
        vocStcV: vocStcV === "" ? 0 : Number(vocStcV),
        vmpStcV: vmpStcV === "" ? 0 : Number(vmpStcV),
        impA: impA === "" ? 0 : Number(impA),
        betaPctNaC: betaPctNaC === "" ? 0 : Number(betaPctNaC),
        tminC: tminC === "" ? null : Number(tminC),
        liczbaPaneliWStringu: liczbaPaneliWStringu === "" ? 0 : Number(liczbaPaneliWStringu),
        vMaxFalownikaV: vMaxFalownikaV === "" ? 0 : Number(vMaxFalownikaV),
        mpptMinV: mpptMinV === "" ? 0 : Number(mpptMinV),
        mpptMaxV: mpptMaxV === "" ? 0 : Number(mpptMaxV),
        iMaxMpptA: iMaxMpptA === "" ? 0 : Number(iMaxMpptA),
        mocFalownikaAcW: mocFalownikaAcW === "" ? 0 : Number(mocFalownikaAcW),
      }),
    [
      vocStcV,
      vmpStcV,
      impA,
      betaPctNaC,
      tminC,
      liczbaPaneliWStringu,
      vMaxFalownikaV,
      mpptMinV,
      mpptMaxV,
      iMaxMpptA,
      mocFalownikaAcW,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dopasowanie-tablicy-falownika" />
      <NaglowekEkranu
        tytul="Dopasowanie tablicy PV do falownika"
        ekran="dopasowanie-tablicy-falownika"
        wynik={result}
        parametry={{ dcacMin: DC_AC_RATIO_ZALECANE_MIN, dcacMax: DC_AC_RATIO_ZALECANE_MAX }}
      >
        Nie wystarczy sprawdzić jednego parametru — falownik i panele muszą pasować do siebie na
        kilku frontach naraz: napięcie zimą, napięcie latem, prąd i stosunek mocy. Moduł 3, Ekran
        14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small font-medium text-muted-foreground">Panel i string</p>
        <Pole
          label="Voc panelu (STC)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vocStcV}
          onChange={(e) => setVocStcV(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="voc" />}
        />
        <Pole
          label="Vmp panelu (STC)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vmpStcV}
          onChange={(e) => setVmpStcV(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="vmp" />}
        />
        <Pole
          label="Prąd roboczy panelu (Imp)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={impA}
          onChange={(e) => setImpA(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="imp" />}
        />
        <Pole
          label="Współczynnik temperaturowy Voc (β)"
          unit="%/°C"
          type="number"
          inputMode="decimal"
          step="0.01"
          value={betaPctNaC}
          onChange={(e) => setBetaPctNaC(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="beta" params={{ betaMin: BETA_TYPOWA_MIN_PCT_NA_C, betaMax: BETA_TYPOWA_MAX_PCT_NA_C }} />}
        />
        <Pole
          label="Minimalna temperatura w lokalizacji (Tmin)"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={tminC}
          onChange={(e) => setTminC(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="tmin" />}
        />
        <Pole
          label="Liczba paneli w stringu"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaPaneliWStringu}
          onChange={(e) => setLiczbaPaneliWStringu(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="liczbaPaneli" />}
        />

        <p className="text-small font-medium text-muted-foreground">Falownik</p>
        <Pole
          label="Maksymalne napięcie DC falownika"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vMaxFalownikaV}
          onChange={(e) => setVMaxFalownikaV(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="maxDc" />}
        />
        <Pole
          label="Okno MPPT — dolna granica"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={mpptMinV}
          onChange={(e) => setMpptMinV(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="mpptMin" />}
        />
        <Pole
          label="Okno MPPT — górna granica"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={mpptMaxV}
          onChange={(e) => setMpptMaxV(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="mpptMax" />}
        />
        <Pole
          label="Maksymalny prąd MPPT"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iMaxMpptA}
          onChange={(e) => setIMaxMpptA(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="maxPrad" />}
        />
        <Pole
          label="Moc znamionowa AC falownika"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocFalownikaAcW}
          onChange={(e) => setMocFalownikaAcW(e.target.value)}
          pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="mocAc" params={{ dcacMin: DC_AC_RATIO_ZALECANE_MIN, dcacMax: DC_AC_RATIO_ZALECANE_MAX }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Konfiguracja niedopasowana" : "Konfiguracja dopasowana"}
        >
          <WynikGlowny>{result.value.dcAcRatio.toFixed(2)} DC/AC</WynikGlowny>
          <p className="mt-2 text-small">
            Napięcie zimowe: {result.value.vStringColdV.toFixed(1)} V · napięcie robocze:{" "}
            {result.value.vStringStcV.toFixed(1)} V · prąd: {result.value.iStringA.toFixed(1)} A ·
            moc PV: {result.value.mocPvW.toFixed(0)} W.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
