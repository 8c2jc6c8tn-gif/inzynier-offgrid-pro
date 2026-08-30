"use client"

import { useMemo, useState } from "react"
import { calculateKonfiguratorStringow } from "@/lib/core/modules/pv/konfigurator-stringow/calculator"
import type { KonfiguratorStringowInput } from "@/lib/core/modules/pv/konfigurator-stringow/input"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"

type Mode = KonfiguratorStringowInput["mode"]

const MODE_LABELS: Record<Mode, string> = {
  szereg: "Szereg",
  rownolegle: "Równolegle",
  mieszany: "Mieszany (grupy szeregowe równolegle)",
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

export default function KonfiguratorStringowPage() {
  const [mode, setMode] = useState<Mode>("szereg")
  const [vmpV, setVmpV] = useState("40")
  const [impA, setImpA] = useState("11")
  const [liczbaPaneli, setLiczbaPaneli] = useState("8")
  const [panelWGrupie, setPanelWGrupie] = useState("4")
  const [liczbaGrup, setLiczbaGrup] = useState("2")

  const input: KonfiguratorStringowInput = useMemo(() => {
    if (mode === "mieszany") {
      return {
        mode,
        vmpV: Number(vmpV),
        impA: Number(impA),
        panelWGrupie: Number(panelWGrupie),
        liczbaGrup: Number(liczbaGrup),
      }
    }
    return { mode, vmpV: Number(vmpV), impA: Number(impA), liczbaPaneli: Number(liczbaPaneli) }
  }, [mode, vmpV, impA, liczbaPaneli, panelWGrupie, liczbaGrup])

  const result = useMemo(() => calculateKonfiguratorStringow(input), [input])

  const poziom: WerdyktPoziom =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Konfigurator stringów</h1>
        <p className="text-sm text-muted-foreground">
          Szereg dodaje napięcia, równoległe dodaje prądy — to jak łączenie ogniw latarki: jedna
          za drugą (szereg) albo obok siebie (równolegle). Moduł 3, Ekran 11.
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
        <Field label="Napięcie Vmp panelu" unit="V" value={vmpV} onChange={setVmpV} />
        <Field label="Prąd Imp panelu" unit="A" value={impA} onChange={setImpA} />

        {mode === "mieszany" ? (
          <>
            <Field
              label="Paneli w grupie (szereg)"
              unit="szt."
              value={panelWGrupie}
              onChange={setPanelWGrupie}
            />
            <Field
              label="Liczba grup (równolegle)"
              unit="szt."
              value={liczbaGrup}
              onChange={setLiczbaGrup}
            />
          </>
        ) : (
          <Field label="Liczba paneli" unit="szt." value={liczbaPaneli} onChange={setLiczbaPaneli} />
        )}
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="mt-1 text-2xl font-semibold">
            {result.value.voltageV.toFixed(1)} V &nbsp;/&nbsp; {result.value.currentA.toFixed(2)} A
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
