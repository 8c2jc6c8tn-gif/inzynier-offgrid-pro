"use client"

import { useMemo, useState } from "react"
import { calculateKalkulatoryPomocnicze } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/calculator"
import type { KalkulatoryPomocniczeInput } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/input"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { t } from "@/lib/i18n/t"

type Mode = KalkulatoryPomocniczeInput["mode"]

const MODE_LABELS: Record<Mode, string> = {
  "watt-to-amp": "Moc → Prąd (W → A)",
  "ah-to-wh": "Ah → Wh",
  "wh-to-ah": "Wh → Ah",
  runtime: "Szacowany czas pracy z baterii",
}

export default function KalkulatoryPomocniczePage() {
  const [mode, setMode] = useState<Mode>("watt-to-amp")
  const [powerW, setPowerW] = useState("100")
  const [voltageV, setVoltageV] = useState("12")
  const [efficiency, setEfficiency] = useState("")
  const [capacityAh, setCapacityAh] = useState("100")
  const [energyWh, setEnergyWh] = useState("1200")

  const input: KalkulatoryPomocniczeInput = useMemo(() => {
    const eff = efficiency === "" ? undefined : Number(efficiency)
    switch (mode) {
      case "watt-to-amp":
        return { mode, powerW: Number(powerW), voltageV: Number(voltageV), efficiency: eff }
      case "ah-to-wh":
        return { mode, capacityAh: Number(capacityAh), voltageV: Number(voltageV) }
      case "wh-to-ah":
        return { mode, energyWh: Number(energyWh), voltageV: Number(voltageV) }
      case "runtime":
        return {
          mode,
          capacityAh: Number(capacityAh),
          voltageV: Number(voltageV),
          powerW: Number(powerW),
          efficiency: eff,
        }
    }
  }, [mode, powerW, voltageV, efficiency, capacityAh, energyWh])

  const result = useMemo(() => calculateKalkulatoryPomocnicze(input), [input])

  const poziom: WerdyktPoziom =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pomocnicze" />
      <NaglowekEkranu tytul="Kalkulatory pomocnicze">
        To Twój podręczny „kalkulator kieszonkowy” do szybkich przeliczeń w terenie, bez
        przechodzenia przez pełny proces projektowy. Moduł 2, Ekran 16.
      </NaglowekEkranu>

      <PoleSelect label="Tryb" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
        {Object.entries(MODE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </PoleSelect>

      <div className="flex flex-col gap-4">
        {(mode === "watt-to-amp" || mode === "runtime") && (
          <Pole label="Moc urządzenia" unit="W" type="number" inputMode="decimal" value={powerW} onChange={(e) => setPowerW(e.target.value)} />
        )}
        {(mode === "watt-to-amp" || mode === "ah-to-wh" || mode === "wh-to-ah" || mode === "runtime") && (
          <Pole label="Napięcie systemu" unit="V" type="number" inputMode="decimal" value={voltageV} onChange={(e) => setVoltageV(e.target.value)} />
        )}
        {(mode === "ah-to-wh" || mode === "runtime") && (
          <Pole label="Pojemność" unit="Ah" type="number" inputMode="decimal" value={capacityAh} onChange={(e) => setCapacityAh(e.target.value)} />
        )}
        {mode === "wh-to-ah" && (
          <Pole label="Energia" unit="Wh" type="number" inputMode="decimal" value={energyWh} onChange={(e) => setEnergyWh(e.target.value)} />
        )}
        {(mode === "watt-to-amp" || mode === "runtime") && (
          <Pole
            label="Sprawność układu (opcjonalnie, domyślnie 0,92)"
            unit="0–1"
            type="number"
            inputMode="decimal"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
          />
        )}
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe poniżej.</p>
        ) : (
          <p className="mt-1 text-h1 font-semibold">
            {Number.isFinite(result.value) ? result.value.toFixed(3) : "—"} {result.unit}
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-small opacity-90">
            {result.assumptions.map((a, i) => (
              <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
            ))}
          </ul>
        )}

        {result.warnings.length > 0 && (
          <ul className="mt-2 space-y-1 text-small">
            {result.warnings.map((w) => (
              <li key={w.code}>{w.message ?? t(w.i18nKey ?? w.code, w.params)}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-caption opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
