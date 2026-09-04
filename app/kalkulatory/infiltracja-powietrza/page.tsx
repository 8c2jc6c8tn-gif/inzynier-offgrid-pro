"use client"

import { useMemo, useState } from "react"
import { calculateInfiltracjaPowietrza } from "@/lib/core/modules/ogrzewanie/infiltracja-powietrza/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function InfiltracjaPowietrzaPage() {
  const [wymianyPowietrzaNaH, setWymianyPowietrzaNaH] = useState("")
  const [kubaturaBudynkuM3, setKubaturaBudynkuM3] = useState("")
  const [deltaTK, setDeltaTK] = useState("")

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
      <NaglowekEkranu tytul="Infiltracja powietrza (test szczelności)">
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
          hint="Z testu szczelności (blower door) lub szacunek na podstawie typu konstrukcji."
          value={wymianyPowietrzaNaH}
          onChange={(e) => setWymianyPowietrzaNaH(e.target.value)}
        />
        <Pole
          label="Kubatura budynku"
          unit="m³"
          type="number"
          inputMode="decimal"
          min={0}
          value={kubaturaBudynkuM3}
          onChange={(e) => setKubaturaBudynkuM3(e.target.value)}
        />
        <Pole
          label="Różnica temperatur wewnątrz/na zewnątrz"
          unit="K"
          type="number"
          inputMode="decimal"
          min={0}
          value={deltaTK}
          onChange={(e) => setDeltaTK(e.target.value)}
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
