"use client"

import { useMemo, useState } from "react"
import { calculateArchitekturaFazowa } from "@/lib/core/modules/zapotrzebowanie/architektura-fazowa/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function ArchitekturaFazowaPage() {
  const [mocL1W, setMocL1W] = useState("")
  const [mocL2W, setMocL2W] = useState("")
  const [mocL3W, setMocL3W] = useState("")

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
      <NaglowekEkranu tytul="Architektura 1-fazowa / 3-fazowa">
        W systemie 3-fazowym nie liczy się tylko suma mocy — liczy się, jak równo jest rozłożona
        między trzy fazy, bo każda ma swój własny limit. Moduł 2, Ekran 14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Obciążenie L1" unit="W" type="number" inputMode="decimal" min={0} value={mocL1W} onChange={(e) => setMocL1W(e.target.value)} />
        <Pole
          label="Obciążenie L2"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL2W}
          onChange={(e) => setMocL2W(e.target.value)}
          hint="0, jeśli instalacja jednofazowa."
        />
        <Pole
          label="Obciążenie L3"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocL3W}
          onChange={(e) => setMocL3W(e.target.value)}
          hint="0, jeśli instalacja jednofazowa."
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
