"use client"

import { useMemo } from "react"
import { calculateScenariuszAutomatyzacji } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/calculator"
import type { ScenariuszAutomatyzacjiInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/automatyzacja/input"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"

export function AutomatyzacjaTab({
  input,
  onChange,
  sumaStandbyW,
}: {
  input: ScenariuszAutomatyzacjiInput
  onChange: (v: ScenariuszAutomatyzacjiInput) => void
  sumaStandbyW: number
}) {
  const result = useMemo(() => calculateScenariuszAutomatyzacji(input), [input])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Porównaj standby w normalnym trybie ze standby w wybranym scenariuszu automatyzacji (nocny tryb
        czuwania, nieobecność, praca z domu, weekend, urlop) — to jeden generyczny silnik dla wszystkich tych
        scenariuszy, nie osobny kalkulator na każdy z nich.
      </p>

      {sumaStandbyW > 0 && (
        <button
          type="button"
          onClick={() => onChange({ ...input, standbyReferencyjnyW: sumaStandbyW })}
          className="self-start text-caption text-muted-foreground underline hover:text-foreground"
        >
          Wpisz jako referencyjny sumę z Katalogu + Pomiaru ({sumaStandbyW.toFixed(1)} W)
        </button>
      )}

      <Pole
        label="Standby referencyjny (tryb normalny)"
        unit="W"
        type="number"
        inputMode="decimal"
        value={input.standbyReferencyjnyW || ""}
        onChange={(e) => onChange({ ...input, standbyReferencyjnyW: Number(e.target.value) })}
      />
      <Pole
        label="Standby w scenariuszu"
        unit="W"
        hint="np. nocny tryb czuwania, nieobecność, praca z domu, weekend, urlop"
        type="number"
        inputMode="decimal"
        value={input.standbyWScenariuszuW || ""}
        onChange={(e) => onChange({ ...input, standbyWScenariuszuW: Number(e.target.value) })}
      />

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul="Wpisz standby referencyjny i standby w wybranym scenariuszu." />
      ) : (
        <WerdyktPanel poziom={poziomZStatusu(result.status)}>
          <WynikGlowny>{result.value.redukcjaDobowaKwh.toFixed(2)} kWh/dobę mniej</WynikGlowny>
          <p className="mt-1 text-small">Redukcja poboru: {result.value.redukcjaW.toFixed(1)} W</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="rounded-md border border-dashed p-3 text-caption text-muted-foreground">
        <p>
          Redukcja poboru falownika nocą — patrz ekran{" "}
          <span className="font-medium">Pobór własny falownika</span> (Moduł 2), bez powielania tej logiki tutaj.
        </p>
        <p className="mt-2">
          Detekcja urządzeń always-on, integracja z API smart-plugów i harmonogram wg obecności wymagają realnej
          integracji sprzętowej — poza zakresem tego kalkulatora offline-first.
        </p>
      </div>
    </div>
  )
}
