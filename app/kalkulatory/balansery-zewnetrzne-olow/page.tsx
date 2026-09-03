"use client"

import { useMemo, useState } from "react"
import { calculateBalanseryZewnetrzneOlow } from "@/lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function BalanseryZewnetrzneOlowPage() {
  const [iloscAkumulatorow, setIloscAkumulatorow] = useState("")
  const [posiadaBalanserZewnetrzny, setPosiadaBalanserZewnetrzny] = useState(false)

  const result = useMemo(
    () =>
      calculateBalanseryZewnetrzneOlow({
        iloscAkumulatorowWSzeregu: iloscAkumulatorow === "" ? 0 : Number(iloscAkumulatorow),
        posiadaBalanserZewnetrzny,
      }),
    [iloscAkumulatorow, posiadaBalanserZewnetrzny],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasCritical
          ? "blad"
          : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? "Nie da się policzyć — liczba akumulatorów nie może być ujemna"
      : hasCritical
        ? "Brak wymaganego balansera zewnętrznego"
        : result.value.wymaganyBalanser
          ? "Balanser zewnętrzny podłączony"
          : "Balanser niewymagany (pojedynczy akumulator)"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/balansery-zewnetrzne-olow" />
      <NaglowekEkranu tytul="Balansery zewnętrzne">
        Akumulatory kwasowe, w przeciwieństwie do LiFePO4, nie mają wbudowanego „sędziego”
        pilnującego równowagi — trzeba go dodać z zewnątrz, inaczej najsłabszy akumulator ograniczy
        cały zestaw. Moduł 11, Ekran B4 (Ścieżka B — kwasowo-ołowiowa).
      </NaglowekEkranu>

      <Pole
        label="Liczba akumulatorów w szeregu"
        unit="szt."
        type="number"
        inputMode="numeric"
        min={0}
        step="1"
        value={iloscAkumulatorow}
        onChange={(e) => setIloscAkumulatorow(e.target.value)}
      />

      <PoleCheckbox
        id="posiada-balanser"
        label="Balanser zewnętrzny podłączony równolegle do każdego akumulatora"
        checked={posiadaBalanserZewnetrzny}
        onChange={(e) => setPosiadaBalanserZewnetrzny(e.target.checked)}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz liczbę akumulatorów, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
