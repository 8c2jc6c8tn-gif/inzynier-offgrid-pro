"use client"

import { useMemo, useState } from "react"
import { calculateDoborBezpiecznika } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function DoborBezpiecznikaDcPage() {
  const [napiecieBateriiV, setNapiecieBateriiV] = useState("48")
  const [rezystancjaWewnetrznaOhm, setRezystancjaWewnetrznaOhm] = useState("0.01")
  const [aicBezpiecznikaA, setAicBezpiecznikaA] = useState("20000")

  const result = useMemo(
    () =>
      calculateDoborBezpiecznika({
        napiecieBateriiV: Number(napiecieBateriiV),
        rezystancjaWewnetrznaOhm: Number(rezystancjaWewnetrznaOhm),
        aicBezpiecznikaA: Number(aicBezpiecznikaA),
      }),
    [napiecieBateriiV, rezystancjaWewnetrznaOhm, aicBezpiecznikaA],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : hasCritical
        ? "red"
        : hasWarning
          ? "yellow"
          : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    red: "Zabronione",
    yellow: "Dopuszczalne, ale poniżej zalecanego minimum",
    green: "Zalecane",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-bezpiecznika-dc" />
      <NaglowekEkranu tytul="Dobór bezpiecznika DC">
        Bezpiecznik musi umieć ugasić pożar elektryczny, a nie tylko się przepalić — źle dobrany
        pod względem AIC sam staje się źródłem łuku elektrycznego. Moduł 4, Ekran 24.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie baterii"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieBateriiV}
          onChange={(e) => setNapiecieBateriiV(e.target.value)}
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="Ω"
          type="number"
          inputMode="decimal"
          value={rezystancjaWewnetrznaOhm}
          onChange={(e) => setRezystancjaWewnetrznaOhm(e.target.value)}
          hint="Z pomiaru lub karty katalogowej ogniw."
        />
        <Pole
          label="AIC wybranego bezpiecznika"
          unit="A"
          type="number"
          inputMode="decimal"
          value={aicBezpiecznikaA}
          onChange={(e) => setAicBezpiecznikaA(e.target.value)}
          hint="Zdolność wyłączania, z karty katalogowej bezpiecznika."
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {result.status !== "INVALID_INPUT" && (
          <WynikGlowny>I_zw = {result.value.pradZwarciowyA.toLocaleString("pl-PL")} A</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
