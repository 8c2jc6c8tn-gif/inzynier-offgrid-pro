"use client"

import { useMemo } from "react"
import { calculatePreHeat } from "@/lib/core/modules/stress-test/pre-heat/calculator"
import type { PreHeatInput, ZrodloEnergiiPreHeat } from "@/lib/core/modules/stress-test/pre-heat/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PoleLiczbowe = Exclude<keyof PreHeatInput, "zrodloEnergii">
type FormularzStan = Record<PoleLiczbowe, string> & { zrodloEnergii: ZrodloEnergiiPreHeat | "" }

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscCieplnaKwhK: "",
  podniesienieTempDomuK: "",
  stratyCieplaKw: "",
  pojemnoscBojleraL: "",
  podniesienieTempBojleraK: "",
  cop: "",
  zrodloEnergii: "",
  nadwyzkaPvKwh: "",
}

const POLA: { pole: PoleLiczbowe; label: string; unit: string }[] = [
  { pole: "pojemnoscCieplnaKwhK", label: "Pojemność cieplna budynku", unit: "kWh/K" },
  { pole: "podniesienieTempDomuK", label: "O ile podnieść temperaturę w domu", unit: "K" },
  { pole: "stratyCieplaKw", label: "Straty ciepła przy nadchodzącym mrozie", unit: "kW" },
  { pole: "pojemnoscBojleraL", label: "Pojemność bojlera (opcjonalnie)", unit: "l" },
  { pole: "podniesienieTempBojleraK", label: "O ile podgrzać bojler", unit: "K" },
  { pole: "cop", label: "COP ogrzewania", unit: "" },
  { pole: "nadwyzkaPvKwh", label: "Nadwyżka PV w dniu przed mrozem (opcjonalnie)", unit: "kWh" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function PreHeatPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pre-heat", STAN_POCZATKOWY)
  const result = useMemo(() => {
    const { zrodloEnergii, ...liczby } = stan
    return calculatePreHeat({
      ...(Object.fromEntries(Object.entries(liczby).map(([k, v]) => [k, liczba(v)])) as Record<PoleLiczbowe, number | null>),
      zrodloEnergii: zrodloEnergii === "" ? null : zrodloEnergii,
    })
  }, [stan])
  const { cieploDomuKwh, cieploBojleraKwh, energiaElektrycznaKwh, buforGodzin } = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pre-heat" />
      <NaglowekEkranu tytul="Pre-Heat — ciepło na zapas" ekran="pre-heat" wzor={result.formula}>
        Ładuj ciepło, zanim przyjdzie mróz — przegrzej dom i bojler w słoneczny dzień przed frontem, a nie w trakcie, kiedy
        będzie już za późno i za drogo. Moduł 7, Ekran 18.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={label}
            unit={unit || undefined}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="pre-heat" pole={pole} />}
          />
        ))}
        <PoleSelect
          label="Skąd energia na przegrzanie?"
          value={stan.zrodloEnergii}
          onChange={(e) => setStan((prev) => ({ ...prev, zrodloEnergii: e.target.value as FormularzStan["zrodloEnergii"] }))}
          pomoc={<PomocPola ekran="pre-heat" pole="zrodloEnergii" />}
        >
          <option value="">— wybierz —</option>
          <option value="pv-dzien">Nadwyżka PV w dzień</option>
          <option value="agregat">Agregat</option>
          <option value="bateria-noc">Bateria, w nocy</option>
        </PoleSelect>
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz pojemność cieplną, podniesienie temperatury, COP i źródło energii.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? "Nie grzej nocą z baterii" : hasWarning ? "Za mało nadwyżki PV" : "Plan przegrzania"}
        >
          {buforGodzin !== null ? (
            <WynikGlowny>+{f1(buforGodzin)} h buforu cieplnego</WynikGlowny>
          ) : (
            cieploDomuKwh !== null && <WynikGlowny>{f1(cieploDomuKwh)} kWh ciepła w masie domu</WynikGlowny>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {cieploDomuKwh !== null && <li>Ciepło w masie domu: {f1(cieploDomuKwh)} kWh</li>}
            {cieploBojleraKwh !== null && <li>Ciepło w bojlerze: {f1(cieploBojleraKwh)} kWh</li>}
            {energiaElektrycznaKwh !== null && <li>Zużyjesz prądu: {f1(energiaElektrycznaKwh)} kWh</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
