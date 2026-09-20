"use client"

import { useMemo } from "react"
import { calculatePompyCyrkulacyjne } from "@/lib/core/modules/ogrzewanie/pompy-cyrkulacyjne/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  mocObecnejPompyW: string
  mocNowejPompyW: string
  godzinyPracyDobowoH: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocObecnejPompyW: "",
  mocNowejPompyW: "",
  godzinyPracyDobowoH: "",
}

export default function PompyCyrkulacyjnePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pompy-cyrkulacyjne", STAN_POCZATKOWY)
  const { mocObecnejPompyW, mocNowejPompyW, godzinyPracyDobowoH } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocObecnejPompyW = (a: string | ((p: string) => string)) => setPole("mocObecnejPompyW", a)
  const setMocNowejPompyW = (a: string | ((p: string) => string)) => setPole("mocNowejPompyW", a)
  const setGodzinyPracyDobowoH = (a: string | ((p: string) => string)) => setPole("godzinyPracyDobowoH", a)

  const result = useMemo(
    () =>
      calculatePompyCyrkulacyjne({
        mocObecnejPompyW: mocObecnejPompyW === "" ? 0 : Number(mocObecnejPompyW),
        mocNowejPompyW: mocNowejPompyW === "" ? 0 : Number(mocNowejPompyW),
        godzinyPracyDobowoH: godzinyPracyDobowoH === "" ? 0 : Number(godzinyPracyDobowoH),
      }),
    [mocObecnejPompyW, mocNowejPompyW, godzinyPracyDobowoH],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pompy-cyrkulacyjne" />
      <NaglowekEkranu tytul="Pompy cyrkulacyjne — dobór">
        W off-gridzie pompy cyrkulacyjne to cisi złodzieje energii — pracują 24/7 i łatwo je
        zlekceważyć, a różnica między starym a nowym modelem to realne kilowatogodziny dziennie.
        Moduł 6, Ekran 15.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc obecnej pompy"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Typowo pompa stałoobrotowa: 100-150 W."
          value={mocObecnejPompyW}
          onChange={(e) => setMocObecnejPompyW(e.target.value)}
        />
        <Pole
          label="Moc rozważanej pompy elektronicznej (PWM)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Typowo 5-50 W."
          value={mocNowejPompyW}
          onChange={(e) => setMocNowejPompyW(e.target.value)}
        />
        <Pole
          label="Godziny pracy na dobę"
          unit="h"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          hint="24 dla pracy ciągłej (24/7)."
          value={godzinyPracyDobowoH}
          onChange={(e) => setGodzinyPracyDobowoH(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta="Oszczędność dobowa">
          <WynikGlowny>{result.value.oszczednoscKwh.toFixed(2)} kWh</WynikGlowny>
          <p className="mt-2 text-small">
            Obecna pompa: {result.value.energiaObecnaKwh.toFixed(2)} kWh/dobę · nowa pompa:{" "}
            {result.value.energiaNowaKwh.toFixed(2)} kWh/dobę · oszczędność:{" "}
            {result.value.oszczednoscPct.toFixed(0)}%.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
