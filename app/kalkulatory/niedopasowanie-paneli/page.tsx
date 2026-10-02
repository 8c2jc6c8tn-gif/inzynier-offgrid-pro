"use client"

import { useMemo } from "react"
import { calculateNiedopasowaniePaneli } from "@/lib/core/modules/pv/niedopasowanie-paneli/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { ROZNICA_MOCY_KRYTYCZNA_PCT, ROZNICA_MOCY_OSTRZEZENIE_PCT } from "@/lib/core/modules/pv/niedopasowanie-paneli/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  mocPanel1W: string
  impPanel1A: string
  mocPanel2W: string
  impPanel2A: string
  napiecieWspolneV: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocPanel1W: "",
  impPanel1A: "",
  mocPanel2W: "",
  impPanel2A: "",
  napiecieWspolneV: "",
}

export default function NiedopasowaniePaneliPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("niedopasowanie-paneli", STAN_POCZATKOWY)
  const { mocPanel1W, impPanel1A, mocPanel2W, impPanel2A, napiecieWspolneV } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocPanel1W = (a: string | ((p: string) => string)) => setPole("mocPanel1W", a)
  const setImpPanel1A = (a: string | ((p: string) => string)) => setPole("impPanel1A", a)
  const setMocPanel2W = (a: string | ((p: string) => string)) => setPole("mocPanel2W", a)
  const setImpPanel2A = (a: string | ((p: string) => string)) => setPole("impPanel2A", a)
  const setNapiecieWspolneV = (a: string | ((p: string) => string)) => setPole("napiecieWspolneV", a)

  const result = useMemo(
    () =>
      calculateNiedopasowaniePaneli({
        mocPanel1W: mocPanel1W === "" ? 0 : Number(mocPanel1W),
        impPanel1A: impPanel1A === "" ? 0 : Number(impPanel1A),
        mocPanel2W: mocPanel2W === "" ? 0 : Number(mocPanel2W),
        impPanel2A: impPanel2A === "" ? 0 : Number(impPanel2A),
        napiecieWspolneV: napiecieWspolneV === "" ? 0 : Number(napiecieWspolneV),
      }),
    [mocPanel1W, impPanel1A, mocPanel2W, impPanel2A, napiecieWspolneV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/niedopasowanie-paneli" />
      <NaglowekEkranu
        tytul={t("UI-NIEPAN-NIEDOPASOWANIE-MOCY-PANELI")}
        ekran="niedopasowanie-paneli"
        wynik={result}
        parametry={{ ostrzezenie: ROZNICA_MOCY_OSTRZEZENIE_PCT, krytyczna: ROZNICA_MOCY_KRYTYCZNA_PCT }}
      >
        {t("UI-NIEPAN-STRING-DZIALA-ZESPOL")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-NIEPAN-MOC-PANELU")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPanel1W}
          onChange={(e) => setMocPanel1W(e.target.value)}
          pomoc={<PomocPola ekran="niedopasowanie-paneli" pole="moc1" />}
        />
        <Pole
          label={t("UI-NIEPAN-PRAD-ROBOCZY-PANELU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={impPanel1A}
          onChange={(e) => setImpPanel1A(e.target.value)}
          pomoc={<PomocPola ekran="niedopasowanie-paneli" pole="imp1" />}
        />
        <Pole
          label={t("UI-NIEPAN-MOC-PANELU-2")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPanel2W}
          onChange={(e) => setMocPanel2W(e.target.value)}
          pomoc={<PomocPola ekran="niedopasowanie-paneli" pole="moc2" />}
        />
        <Pole
          label={t("UI-NIEPAN-PRAD-ROBOCZY-PANELU-2")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={impPanel2A}
          onChange={(e) => setImpPanel2A(e.target.value)}
          pomoc={<PomocPola ekran="niedopasowanie-paneli" pole="imp2" />}
        />
        <Pole
          label={t("UI-NIEPAN-WSPOLNE-NAPIECIE-ROBOCZE")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieWspolneV}
          onChange={(e) => setNapiecieWspolneV(e.target.value)}
          pomoc={<PomocPola ekran="niedopasowanie-paneli" pole="vmp" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-NIEPAN-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-NIEPAN-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta={t("UI-NIEPAN-MOC-RZECZYWISTA-STRINGU")}>
          <WynikGlowny>{result.value.mocRzeczywistaW.toFixed(0)} W</WynikGlowny>
          <p className="mt-2 text-small">
            {t("UI-NIEPAN-TEORETYCZNA-SUMA-STRATA", { mocTeoretycznaW: result.value.mocTeoretycznaW.toFixed(0), strataPct: result.value.strataPct.toFixed(1), roznicaMocyPct: result.value.roznicaMocyPct.toFixed(1) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
