"use client"

import { useMemo, useState } from "react"
import { calculateKonfiguratorStringow } from "@/lib/core/modules/pv/konfigurator-stringow/calculator"
import type { KonfiguratorStringowInput } from "@/lib/core/modules/pv/konfigurator-stringow/input"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Mode = KonfiguratorStringowInput["mode"]

const MODE_LABELS: Record<Mode, string> = {
  szereg: "Szereg",
  rownolegle: "Równolegle",
  mieszany: "Mieszany (grupy szeregowe równolegle)",
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
      <NawigacjaEkranu href="/kalkulatory/konfigurator-stringow" />
      <NaglowekEkranu tytul="Konfigurator stringów">
        Szereg dodaje napięcia, równoległe dodaje prądy — to jak łączenie ogniw latarki: jedna za
        drugą (szereg) albo obok siebie (równolegle). Moduł 3, Ekran 11.
      </NaglowekEkranu>

      <PoleSelect label="Tryb" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
        {Object.entries(MODE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </PoleSelect>

      <div className="flex flex-col gap-4">
        <Pole label="Napięcie Vmp panelu" unit="V" type="number" inputMode="decimal" value={vmpV} onChange={(e) => setVmpV(e.target.value)} />
        <Pole label="Prąd Imp panelu" unit="A" type="number" inputMode="decimal" value={impA} onChange={(e) => setImpA(e.target.value)} />

        {mode === "mieszany" ? (
          <>
            <Pole
              label="Paneli w grupie (szereg)"
              unit="szt."
              type="number"
              inputMode="decimal"
              value={panelWGrupie}
              onChange={(e) => setPanelWGrupie(e.target.value)}
            />
            <Pole
              label="Liczba grup (równolegle)"
              unit="szt."
              type="number"
              inputMode="decimal"
              value={liczbaGrup}
              onChange={(e) => setLiczbaGrup(e.target.value)}
            />
          </>
        ) : (
          <Pole
            label="Liczba paneli"
            unit="szt."
            type="number"
            inputMode="decimal"
            value={liczbaPaneli}
            onChange={(e) => setLiczbaPaneli(e.target.value)}
          />
        )}
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <WynikGlowny>
            {result.value.voltageV.toFixed(1)} V &nbsp;/&nbsp; {result.value.currentA.toFixed(2)} A
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
