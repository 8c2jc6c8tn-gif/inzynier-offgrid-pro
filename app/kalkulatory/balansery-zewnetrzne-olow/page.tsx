"use client"

import { useMemo } from "react"
import { calculateBalanseryZewnetrzneOlow } from "@/lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

/** Schemat: balanser zewnętrzny podłączony równolegle do KAŻDEGO akumulatora w szeregu. */
function BalanseryIlustracja() {
  return (
    <svg
      viewBox="0 0 400 190"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label="Schemat: balanser zewnętrzny podłączony równolegle do każdego akumulatora w szeregu"
    >
      {[0, 1].map((i) => {
        const x = 40 + i * 190
        return (
          <g key={i}>
            <rect x={x} y="90" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
            <text x={x + 45} y="117" textAnchor="middle" className="fill-current text-[9px]">
              Akum. {i + 1}
            </text>
            <text x={x + 8} y="86" className="fill-current text-[9px] font-semibold">+</text>
            <text x={x + 78} y="86" className="fill-current text-[9px] font-semibold">−</text>

            {/* balanser podłączony równolegle nad akumulatorem */}
            <rect x={x + 10} y="24" width="70" height="30" rx="4" className="fill-amber-400/70 stroke-current" />
            <text x={x + 45} y="43" textAnchor="middle" className="fill-current text-[8px] font-medium">
              Balanser
            </text>
            <line x1={x + 15} y1="54" x2={x + 8} y2="90" className="stroke-amber-500" strokeWidth="2" />
            <line x1={x + 75} y1="54" x2={x + 82} y2="90" className="stroke-amber-500" strokeWidth="2" />
          </g>
        )
      })}

      {/* połączenie szeregowe między akumulatorami */}
      <line x1="130" y1="113" x2="230" y2="113" className="stroke-red-500" strokeWidth="3" />
      <line x1="6" y1="113" x2="40" y2="113" className="stroke-current" strokeWidth="2" />
      <line x1="360" y1="113" x2="394" y2="113" className="stroke-current" strokeWidth="2" />

      <text x="200" y="165" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Każdy akumulator w szeregu dostaje własny balanser równoległy —
      </text>
      <text x="200" y="179" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        powtórz dla wszystkich akumulatorów, nie tylko dla dwóch pokazanych.
      </text>
    </svg>
  )
}

type FormularzStan = {
  iloscAkumulatorow: string
  posiadaBalanserZewnetrzny: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  iloscAkumulatorow: "",
  posiadaBalanserZewnetrzny: false,
}

export default function BalanseryZewnetrzneOlowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("balansery-zewnetrzne-olow", STAN_POCZATKOWY)
  const { iloscAkumulatorow, posiadaBalanserZewnetrzny } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setIloscAkumulatorow = (a: string | ((p: string) => string)) => setPole("iloscAkumulatorow", a)
  const setPosiadaBalanserZewnetrzny = (a: boolean | ((p: boolean) => boolean)) => setPole("posiadaBalanserZewnetrzny", a)

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

      <BalanseryIlustracja />

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
