"use client"

import { useMemo, useState } from "react"
import { calculateSlabeOgniwo } from "@/lib/core/modules/baterie/slabe-ogniwo/calculator"
import { DOMYSLNA_TOLERANCJA_PCT } from "@/lib/core/modules/baterie/slabe-ogniwo/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function SlabeOgniwoPage() {
  const [pojemnoscZnamionowaAh, setPojemnoscZnamionowaAh] = useState("")
  const [tolerancjaPct, setTolerancjaPct] = useState(String(DOMYSLNA_TOLERANCJA_PCT))

  const result = useMemo(
    () =>
      calculateSlabeOgniwo({
        pojemnoscZnamionowaAh: pojemnoscZnamionowaAh === "" ? 0 : Number(pojemnoscZnamionowaAh),
        tolerancjaPct: tolerancjaPct === "" ? 0 : Number(tolerancjaPct),
      }),
    [pojemnoscZnamionowaAh, tolerancjaPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/slabe-ogniwo" />
      <NaglowekEkranu tytul="Symulacja Słabego Ogniwa (Cell Drift & Balancing)">
        To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł — jedno słabe
        ogniwo ogranicza cały pakiet. Moduł 4, Ekran 8.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność znamionowa ogniwa"
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscZnamionowaAh}
          onChange={(e) => setPojemnoscZnamionowaAh(e.target.value)}
        />
        <Pole
          label="Tolerancja fabryczna"
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={tolerancjaPct}
          onChange={(e) => setTolerancjaPct(e.target.value)}
          hint={`Domyślnie ±${DOMYSLNA_TOLERANCJA_PCT}% wg źródła.`}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć pojemność użyteczną pakietu.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta="Pojemność użyteczna pakietu (najgorszy przypadek)">
          <WynikGlowny>
            {result.value.pojemnoscNajslabszegoAh.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} Ah
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
