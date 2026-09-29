"use client"

import { useMemo } from "react"
import { calculateInfiltracjaPowietrza } from "@/lib/core/modules/ogrzewanie/infiltracja-powietrza/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  wymianyPowietrzaNaH: string
  kubaturaBudynkuM3: string
  deltaTK: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wymianyPowietrzaNaH: "",
  kubaturaBudynkuM3: "",
  deltaTK: "",
}

export default function InfiltracjaPowietrzaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("infiltracja-powietrza", STAN_POCZATKOWY)
  const { wymianyPowietrzaNaH, kubaturaBudynkuM3, deltaTK } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWymianyPowietrzaNaH = (a: string | ((p: string) => string)) => setPole("wymianyPowietrzaNaH", a)
  const setKubaturaBudynkuM3 = (a: string | ((p: string) => string)) => setPole("kubaturaBudynkuM3", a)
  const setDeltaTK = (a: string | ((p: string) => string)) => setPole("deltaTK", a)

  const result = useMemo(
    () =>
      calculateInfiltracjaPowietrza({
        wymianyPowietrzaNaH: wymianyPowietrzaNaH === "" ? 0 : Number(wymianyPowietrzaNaH),
        kubaturaBudynkuM3: kubaturaBudynkuM3 === "" ? 0 : Number(kubaturaBudynkuM3),
        deltaTK: deltaTK === "" ? null : Number(deltaTK),
      }),
    [wymianyPowietrzaNaH, kubaturaBudynkuM3, deltaTK],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/infiltracja-powietrza" />
      <NaglowekEkranu tytul="Infiltracja powietrza (test szczelności)" ekran="infiltracja-powietrza" wzor={result.formula}>
        Szpary w budynku to darmowa wentylacja, ale zimą płacisz za nią ciepłem — lepiej mieć
        kontrolowaną wymianę powietrza niż przypadkową. Moduł 6, Ekran 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Wymiany powietrza na godzinę"
          unit="1/h"
          type="number"
          inputMode="decimal"
          min={0}
          value={wymianyPowietrzaNaH}
          onChange={(e) => setWymianyPowietrzaNaH(e.target.value)}
          pomoc={<PomocPola ekran="infiltracja-powietrza" pole="wymiany" />}
        />
        <Pole
          label="Kubatura budynku"
          unit="m³"
          type="number"
          inputMode="decimal"
          min={0}
          value={kubaturaBudynkuM3}
          onChange={(e) => setKubaturaBudynkuM3(e.target.value)}
          pomoc={<PomocPola ekran="infiltracja-powietrza" pole="kubatura" />}
        />
        <Pole
          label="Różnica temperatur wewnątrz/na zewnątrz"
          unit="K"
          type="number"
          inputMode="decimal"
          min={0}
          value={deltaTK}
          onChange={(e) => setDeltaTK(e.target.value)}
          pomoc={<PomocPola ekran="infiltracja-powietrza" pole="deltaT" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Strata ciepła przez infiltrację">
          <WynikGlowny>{result.value.strataCieplnaKw.toFixed(2)} kW</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
