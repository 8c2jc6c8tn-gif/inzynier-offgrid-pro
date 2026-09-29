"use client"

import { useMemo } from "react"
import { calculateWentylacjaOdzyskCiepla } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/calculator"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { POBOR_WENTYLATOROW_MAX_W, POBOR_WENTYLATOROW_MIN_W } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/constants"

type FormularzStan = {
  wydajnoscCentraliM3H: string
  sprawnoscRekuperatoraPct: string
  deltaTK: string
  poborWentylatorowW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wydajnoscCentraliM3H: "",
  sprawnoscRekuperatoraPct: "",
  deltaTK: "",
  poborWentylatorowW: "",
}

export default function WentylacjaOdzyskCieplaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wentylacja-odzysk-ciepla", STAN_POCZATKOWY)
  const { wydajnoscCentraliM3H, sprawnoscRekuperatoraPct, deltaTK, poborWentylatorowW } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWydajnoscCentraliM3H = (a: string | ((p: string) => string)) => setPole("wydajnoscCentraliM3H", a)
  const setSprawnoscRekuperatoraPct = (a: string | ((p: string) => string)) => setPole("sprawnoscRekuperatoraPct", a)
  const setDeltaTK = (a: string | ((p: string) => string)) => setPole("deltaTK", a)
  const setPoborWentylatorowW = (a: string | ((p: string) => string)) => setPole("poborWentylatorowW", a)

  const result = useMemo(
    () =>
      calculateWentylacjaOdzyskCiepla({
        wydajnoscCentraliM3H: wydajnoscCentraliM3H === "" ? 0 : Number(wydajnoscCentraliM3H),
        sprawnoscRekuperatoraPct: sprawnoscRekuperatoraPct === "" ? 0 : Number(sprawnoscRekuperatoraPct),
        deltaTK: deltaTK === "" ? null : Number(deltaTK),
        poborWentylatorowW: poborWentylatorowW === "" ? 0 : Number(poborWentylatorowW),
      }),
    [wydajnoscCentraliM3H, sprawnoscRekuperatoraPct, deltaTK, poborWentylatorowW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wentylacja-odzysk-ciepla" />
      <NaglowekEkranu tytul="System wentylacji z odzyskiem ciepła" ekran="wentylacja-odzysk-ciepla" wynik={result}>
        Wentylacja to płuca domu. Rekuperacja sprawia, że płuca oddychają, ale nie tracą przy tym
        ciepła. Moduł 6, Ekran 3.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Wydajność centrali wentylacyjnej"
          unit="m³/h"
          type="number"
          inputMode="decimal"
          min={0}
          value={wydajnoscCentraliM3H}
          onChange={(e) => setWydajnoscCentraliM3H(e.target.value)}
          pomoc={<PomocPola ekran="wentylacja-odzysk-ciepla" pole="przeplyw" />}
        />
        <Pole
          label="Sprawność rekuperatora"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscRekuperatoraPct}
          onChange={(e) => setSprawnoscRekuperatoraPct(e.target.value)}
          pomoc={<PomocPola ekran="wentylacja-odzysk-ciepla" pole="sprawnosc" />}
        />
        <Pole
          label="Różnica temperatur wewnątrz/na zewnątrz"
          unit="K"
          type="number"
          inputMode="decimal"
          min={0}
          value={deltaTK}
          onChange={(e) => setDeltaTK(e.target.value)}
          pomoc={<PomocPola ekran="wentylacja-odzysk-ciepla" pole="deltaT" />}
        />
        <Pole
          label="Stały pobór mocy wentylatorów"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={poborWentylatorowW}
          onChange={(e) => setPoborWentylatorowW(e.target.value)}
          pomoc={<PomocPola ekran="wentylacja-odzysk-ciepla" pole="pobor" params={{ min: POBOR_WENTYLATOROW_MIN_W, max: POBOR_WENTYLATOROW_MAX_W }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Odzyskane ciepło">
          <WynikGlowny>{result.value.odzyskaneCieploKw.toFixed(2)} kW</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
