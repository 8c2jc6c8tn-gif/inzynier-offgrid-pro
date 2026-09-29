"use client"

import { useMemo } from "react"
import { calculateBlackout } from "@/lib/core/modules/stress-test/blackout/calculator"
import type { BlackoutInput } from "@/lib/core/modules/stress-test/blackout/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof BlackoutInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscKwh: "",
  socStartPct: "100",
  socMinPct: "",
  sprawnoscFalownikaPct: "",
  zuzycieDoboweKwh: "",
  dniScenariusza: "14",
  agregatKwhDoba: "",
}

const POLA: { pole: keyof BlackoutInput; label: string; unit: string }[] = [
  { pole: "pojemnoscKwh", label: "Pojemność baterii (znamionowa)", unit: "kWh" },
  { pole: "socStartPct", label: "SoC na początku", unit: "%" },
  { pole: "socMinPct", label: "Krytyczne minimum SoC", unit: "%" },
  { pole: "sprawnoscFalownikaPct", label: "Sprawność falownika", unit: "%" },
  { pole: "zuzycieDoboweKwh", label: "Zużycie dobowe w mrozie", unit: "kWh/dobę" },
  { pole: "dniScenariusza", label: "Dni bez słońca", unit: "dni" },
  { pole: "agregatKwhDoba", label: "Energia z agregatu (opcjonalnie)", unit: "kWh/dobę" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function BlackoutPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("blackout", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateBlackout(
        Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as BlackoutInput,
      ),
    [stan],
  )
  const { energiaDostepnaKwh, dniPrzetrwania, dzienAwarii, dodatkowaPojemnoscKwh, redukcjaZuzyciaPct } = result.value
  const padnie = dzienAwarii !== null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/blackout" />
      <NaglowekEkranu tytul="Blackout — dni bez słońca" ekran="blackout" wzor={result.formula}>
        Test najgorszego koszmaru: dwa tygodnie bez słońca w mrozie. Jeśli system przeżyje ten scenariusz, przeżyje właściwie
        wszystko inne. Moduł 7, Ekran 4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={label}
            unit={unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="blackout" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz pojemność, SoC, sprawność, zużycie i liczbę dni.</p>
      ) : (
        <WerdyktPanel poziom={padnie ? "uwaga" : "ok"} etykieta={padnie ? `System padnie ${dzienAwarii}. dnia` : "System przetrwa scenariusz"}>
          <WynikGlowny>{dniPrzetrwania === null ? "Agregat pokrywa zużycie" : `${f1(dniPrzetrwania)} dnia na baterii`}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {energiaDostepnaKwh !== null && <li>Energia do minimum: {f1(energiaDostepnaKwh)} kWh</li>}
            {padnie && dodatkowaPojemnoscKwh !== null && <li>Brakuje: {f0(Math.ceil(dodatkowaPojemnoscKwh))} kWh baterii</li>}
            {padnie && redukcjaZuzyciaPct !== null && <li>albo ograniczenie zużycia o {f0(Math.ceil(redukcjaZuzyciaPct))}%</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
