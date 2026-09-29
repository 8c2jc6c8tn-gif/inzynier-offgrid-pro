"use client"

import { useMemo } from "react"
import { calculateArchitekturaFazowa } from "@/lib/core/modules/zapotrzebowanie/architektura-fazowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  mocL1W: string
  mocL2W: string
  mocL3W: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mocL1W: "",
  mocL2W: "",
  mocL3W: "",
}

export default function ArchitekturaFazowaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("architektura-fazowa", STAN_POCZATKOWY)
  const { mocL1W, mocL2W, mocL3W } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMocL1W = (a: string | ((p: string) => string)) => setPole("mocL1W", a)
  const setMocL2W = (a: string | ((p: string) => string)) => setPole("mocL2W", a)
  const setMocL3W = (a: string | ((p: string) => string)) => setPole("mocL3W", a)

  const result = useMemo(
    () =>
      calculateArchitekturaFazowa({
        mocL1W: mocL1W === "" ? 0 : Number(mocL1W),
        mocL2W: mocL2W === "" ? 0 : Number(mocL2W),
        mocL3W: mocL3W === "" ? 0 : Number(mocL3W),
      }),
    [mocL1W, mocL2W, mocL3W],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/architektura-fazowa" />
      <NaglowekEkranu tytul="Architektura 1-fazowa / 3-fazowa" ekran="architektura-fazowa" wynik={result}>
        W systemie 3-fazowym nie liczy się tylko suma mocy — liczy się, jak równo jest rozłożona
        między trzy fazy, bo każda ma swój własny limit. Moduł 2, Ekran 14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Obciążenie L1"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL1W}
          onChange={(e) => setMocL1W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l1" />}
        />
        <Pole
          label="Obciążenie L2"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL2W}
          onChange={(e) => setMocL2W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l2" />}
        />
        <Pole
          label="Obciążenie L3"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL3W}
          onChange={(e) => setMocL3W(e.target.value)}
          pomoc={<PomocPola ekran="architektura-fazowa" pole="l3" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz obciążenie przynajmniej jednej fazy.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Rozkład obciążenia faz">
          <p className="text-h1 font-semibold">{result.value.sumaW.toFixed(0)} W łącznie</p>
          <p className="mt-1 text-small text-muted-foreground">
            Najbardziej obciążona faza: {result.value.maxFazaW.toFixed(0)} W · najmniej:{" "}
            {result.value.minFazaW.toFixed(0)} W · asymetria: {result.value.asymetriaPct.toFixed(1)}%
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            Źródło nie podaje liczbowego progu &quot;znacznej&quot; asymetrii — oceń sam, czy warto
            przepiąć część obwodów na mniej obciążoną fazę. Przykład źródła (L1 dwukrotnie
            bardziej obciążona niż L2/L3) uznano za problem wart korekty.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
