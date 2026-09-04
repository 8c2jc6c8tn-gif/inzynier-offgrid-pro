"use client"

import { useMemo, useState } from "react"
import { calculateNiedopasowaniePaneli } from "@/lib/core/modules/pv/niedopasowanie-paneli/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function NiedopasowaniePaneliPage() {
  const [mocPanel1W, setMocPanel1W] = useState("")
  const [impPanel1A, setImpPanel1A] = useState("")
  const [mocPanel2W, setMocPanel2W] = useState("")
  const [impPanel2A, setImpPanel2A] = useState("")
  const [napiecieWspolneV, setNapiecieWspolneV] = useState("")

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
      <NaglowekEkranu tytul="Niedopasowanie mocy paneli (mismatch)">
        String działa jak zespół wioślarzy — tempo narzuca najsłabszy. Mieszanie mocnych i słabych
        paneli w jednym stringu marnuje potencjał tych mocniejszych. Moduł 3, Ekran 17.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc panelu 1"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPanel1W}
          onChange={(e) => setMocPanel1W(e.target.value)}
        />
        <Pole
          label="Prąd roboczy panelu 1 (Imp)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={impPanel1A}
          onChange={(e) => setImpPanel1A(e.target.value)}
        />
        <Pole
          label="Moc panelu 2"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPanel2W}
          onChange={(e) => setMocPanel2W(e.target.value)}
        />
        <Pole
          label="Prąd roboczy panelu 2 (Imp)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={impPanel2A}
          onChange={(e) => setImpPanel2A(e.target.value)}
        />
        <Pole
          label="Wspólne napięcie robocze stringu (Vmp)"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieWspolneV}
          onChange={(e) => setNapiecieWspolneV(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"} etykieta="Moc rzeczywista stringu">
          <WynikGlowny>{result.value.mocRzeczywistaW.toFixed(0)} W</WynikGlowny>
          <p className="mt-2 text-small">
            Teoretyczna suma: {result.value.mocTeoretycznaW.toFixed(0)} W · strata:{" "}
            {result.value.strataPct.toFixed(1)}% · różnica mocy paneli:{" "}
            {result.value.roznicaMocyPct.toFixed(1)}%.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
