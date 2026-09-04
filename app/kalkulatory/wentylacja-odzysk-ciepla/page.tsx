"use client"

import { useMemo, useState } from "react"
import { calculateWentylacjaOdzyskCiepla } from "@/lib/core/modules/ogrzewanie/wentylacja-odzysk-ciepla/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function WentylacjaOdzyskCieplaPage() {
  const [wydajnoscCentraliM3H, setWydajnoscCentraliM3H] = useState("")
  const [sprawnoscRekuperatoraPct, setSprawnoscRekuperatoraPct] = useState("")
  const [deltaTK, setDeltaTK] = useState("")
  const [poborWentylatorowW, setPoborWentylatorowW] = useState("")

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
      <NaglowekEkranu tytul="System wentylacji z odzyskiem ciepła">
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
        <Pole
          label="Stały pobór mocy wentylatorów"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Typowo 50-100 W."
          value={poborWentylatorowW}
          onChange={(e) => setPoborWentylatorowW(e.target.value)}
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
