"use client"

import { useMemo, useState } from "react"
import { calculateDoborBezpiecznika } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

function Field({
  label,
  unit,
  value,
  onChange,
  hint,
}: {
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">
        {label} <span className="text-muted-foreground">[{unit}]</span>
      </span>
      <input
        type="number"
        inputMode="decimal"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

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
      <div>
        <h1 className="text-xl font-semibold">Dobór bezpiecznika DC</h1>
        <p className="text-sm text-muted-foreground">
          Bezpiecznik musi umieć ugasić pożar elektryczny, a nie tylko się przepalić — źle
          dobrany pod względem AIC sam staje się źródłem łuku elektrycznego. Moduł 4, Ekran 24.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Field
          label="Napięcie baterii"
          unit="V"
          value={napiecieBateriiV}
          onChange={setNapiecieBateriiV}
        />
        <Field
          label="Rezystancja wewnętrzna pakietu"
          unit="Ω"
          value={rezystancjaWewnetrznaOhm}
          onChange={setRezystancjaWewnetrznaOhm}
          hint="Z pomiaru lub karty katalogowej ogniw."
        />
        <Field
          label="AIC wybranego bezpiecznika"
          unit="A"
          value={aicBezpiecznikaA}
          onChange={setAicBezpiecznikaA}
          hint="Zdolność wyłączania, z karty katalogowej bezpiecznika."
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {result.status !== "INVALID_INPUT" && (
          <p className="mt-1 text-2xl font-semibold">
            I_zw = {result.value.pradZwarciowyA.toLocaleString("pl-PL")} A
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-sm opacity-90">
            {result.assumptions.map((a) => (
              <li key={a}>Założenie: {a}</li>
            ))}
          </ul>
        )}

        {result.warnings.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {result.warnings.map((w) => (
              <li key={w.code}>{w.message}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-xs opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
