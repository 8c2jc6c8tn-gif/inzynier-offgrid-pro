"use client"

import { useMemo, useState } from "react"
import { calculateKalkulatoryPomocnicze } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/calculator"
import type { KalkulatoryPomocniczeInput } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/input"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"

type Mode = KalkulatoryPomocniczeInput["mode"]

const MODE_LABELS: Record<Mode, string> = {
  "watt-to-amp": "Moc → Prąd (W → A)",
  "ah-to-wh": "Ah → Wh",
  "wh-to-ah": "Wh → Ah",
  runtime: "Szacowany czas pracy z baterii",
}

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

function Field({
  label,
  unit,
  value,
  onChange,
}: {
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
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
    </label>
  )
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
      <div>
        <h1 className="text-xl font-semibold">Kalkulatory pomocnicze</h1>
        <p className="text-sm text-muted-foreground">
          To Twój podręczny „kalkulator kieszonkowy” do szybkich przeliczeń w terenie, bez
          przechodzenia przez pełny proces projektowy. Moduł 2, Ekran 16.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Tryb</span>
        <select
          className={inputClass}
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          {Object.entries(MODE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-4">
        {(mode === "watt-to-amp" || mode === "runtime") && (
          <Field label="Moc urządzenia" unit="W" value={powerW} onChange={setPowerW} />
        )}
        {(mode === "watt-to-amp" || mode === "ah-to-wh" || mode === "wh-to-ah" || mode === "runtime") && (
          <Field label="Napięcie systemu" unit="V" value={voltageV} onChange={setVoltageV} />
        )}
        {(mode === "ah-to-wh" || mode === "runtime") && (
          <Field label="Pojemność" unit="Ah" value={capacityAh} onChange={setCapacityAh} />
        )}
        {mode === "wh-to-ah" && <Field label="Energia" unit="Wh" value={energyWh} onChange={setEnergyWh} />}
        {(mode === "watt-to-amp" || mode === "runtime") && (
          <Field
            label="Sprawność układu (opcjonalnie, domyślnie 0,92)"
            unit="0–1"
            value={efficiency}
            onChange={setEfficiency}
          />
        )}
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe poniżej.</p>
        ) : (
          <p className="mt-1 text-2xl font-semibold">
            {Number.isFinite(result.value) ? result.value.toFixed(3) : "—"} {result.unit}
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
