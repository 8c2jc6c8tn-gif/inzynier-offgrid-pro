"use client"

import { useMemo, useState } from "react"
import { calculateBuforCiepla } from "@/lib/core/modules/ogrzewanie/bufor-ciepla/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function BuforCieplaPage() {
  const [mocPompyKw, setMocPompyKw] = useState("")
  const [pojemnoscBuforaL, setPojemnoscBuforaL] = useState("")

  const result = useMemo(
    () =>
      calculateBuforCiepla({
        mocPompyKw: mocPompyKw === "" ? 0 : Number(mocPompyKw),
        pojemnoscBuforaL: pojemnoscBuforaL === "" ? 0 : Number(pojemnoscBuforaL),
      }),
    [mocPompyKw, pojemnoscBuforaL],
  )

  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bufor-ciepla" />
      <NaglowekEkranu tytul="Bufor ciepła — dobór pojemności">
        Bufor to termos dla ciepła — gromadzi je, gdy jest „tanio” (słońce świeci), i oddaje, gdy
        jest „drogo” (noc, chmury). Moduł 6, Ekran 14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc pompy ciepła"
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPompyKw}
          onChange={(e) => setMocPompyKw(e.target.value)}
        />
        <Pole
          label="Posiadana/planowana pojemność bufora"
          unit="l"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscBuforaL}
          onChange={(e) => setPojemnoscBuforaL(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta="Zalecana pojemność bufora">
          <WynikGlowny>{result.value.zalecanaPojemnoscL.toFixed(0)} l</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
