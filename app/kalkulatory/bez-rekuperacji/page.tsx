"use client"

import { useMemo } from "react"
import { calculateBezRekuperacji } from "@/lib/core/modules/stress-test/bez-rekuperacji/calculator"
import type { BezRekuperacjiInput } from "@/lib/core/modules/stress-test/bez-rekuperacji/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof BezRekuperacjiInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  strumienM3H: "",
  sprawnoscOdzyskuPct: "",
  tempWewnC: "20",
  tempZewnC: "",
  tempZamarzaniaWymiennikaC: "",
  tempZaNagrzewnicaC: "",
}

const POLA: { pole: keyof BezRekuperacjiInput; label: string; unit: string }[] = [
  { pole: "strumienM3H", label: "Wydajność centrali", unit: "m³/h" },
  { pole: "sprawnoscOdzyskuPct", label: "Sprawność odzysku", unit: "%" },
  { pole: "tempWewnC", label: "Temperatura wewnątrz", unit: "°C" },
  { pole: "tempZewnC", label: "Najniższa temperatura na zewnątrz", unit: "°C" },
  { pole: "tempZamarzaniaWymiennikaC", label: "Granica zamarzania wymiennika (instrukcja)", unit: "°C" },
  { pole: "tempZaNagrzewnicaC", label: "Temperatura za nagrzewnicą wstępną (instrukcja)", unit: "°C" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function BezRekuperacjiPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bez-rekuperacji", STAN_POCZATKOWY)
  const result = useMemo(
    () => calculateBezRekuperacji(Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as BezRekuperacjiInput),
    [stan],
  )
  const { dodatkowaStrataKw, dodatkowaEnergiaKwhDoba, mocNagrzewnicyW } = result.value
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bez-rekuperacji" />
      <NaglowekEkranu tytul="Rekuperacja zamarzła" ekran="bez-rekuperacji" wzor={result.formula}>
        Wentylacja to płuca domu — gdy rekuperator zamarznie, dom traci ciepło albo zaczyna się „dusić”. Ile to kosztuje i
        jak mocnej nagrzewnicy trzeba. Moduł 7, Ekran 20.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={label}
            unit={unit}
            type="number"
            inputMode="decimal"
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="bez-rekuperacji" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz wydajność, sprawność i obie temperatury.</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={hasWarning ? "Wymiennik może zamarznąć" : "Skutki pracy bez odzysku"}>
          {dodatkowaStrataKw !== null && <WynikGlowny>+{f2(dodatkowaStrataKw)} kW strat bez odzysku</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {dodatkowaEnergiaKwhDoba !== null && <li>Na dobę: +{f2(dodatkowaEnergiaKwhDoba)} kWh ciepła</li>}
            {mocNagrzewnicyW !== null && <li>Nagrzewnica wstępna: {f0(mocNagrzewnicyW)} W</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
