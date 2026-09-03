"use client"

import { useMemo, useState } from "react"
import { calculateGestoscElektrolitu } from "@/lib/core/modules/montaz-baterii/gestosc-elektrolitu/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const ETYKIETY: Record<string, string> = {
  pelny: "Akumulator pełny",
  "czesciowo-naladowany": "Naładowany częściowo — zalecane doładowanie",
  rozladowany: "Rozładowany — wymagane doładowanie",
}

export default function GestoscElektrolituPage() {
  const [gestosc, setGestosc] = useState("")

  const result = useMemo(
    () => calculateGestoscElektrolitu({ gestoscGCm3: gestosc === "" ? null : Number(gestosc) }),
    [gestosc],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.value.stan === "pelny"
          ? "ok"
          : "uwaga"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/gestosc-elektrolitu" />
      <NaglowekEkranu tytul="Test pojemności i gęstości elektrolitu">
        Gęstość elektrolitu to bezpośredni wskaźnik stanu naładowania akumulatora kwasowego — to
        jego odpowiednik SoC z BMS, tylko mierzony ręcznie. Moduł 11, Ekran B9 (Ścieżka B —
        kwasowo-ołowiowa, tylko akumulatory z korkami).
      </NaglowekEkranu>

      <Pole
        label="Zmierzona gęstość elektrolitu"
        unit="g/cm³"
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        value={gestosc}
        onChange={(e) => setGestosc(e.target.value)}
        hint="Areometr. Referencje ze źródła: 1,28 = pełny, 1,20 = połowa, 1,12 = rozładowany."
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">Wpisz zmierzoną gęstość, żeby zobaczyć werdykt.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={result.status === "INVALID_INPUT" ? "Nie da się policzyć — gęstość musi być większa od zera" : ETYKIETY[result.value.stan]}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
