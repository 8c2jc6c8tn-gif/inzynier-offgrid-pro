"use client"

import { useMemo, useState } from "react"
import { calculateBuforRozbudowy } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/calculator"
import { OPCJE_BUFORA_PCT } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/constants"
import type { BuforRozbudowyInput } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/input"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"

export default function BuforRozbudowyPage() {
  const [zapotrzebowanieCalkowiteKwh, setZapotrzebowanieCalkowiteKwh] = useState("")
  const [buforPct, setBuforPct] = useState<BuforRozbudowyInput["buforPct"]>(0)

  const result = useMemo(
    () =>
      calculateBuforRozbudowy({
        zapotrzebowanieCalkowiteKwh: zapotrzebowanieCalkowiteKwh === "" ? 0 : Number(zapotrzebowanieCalkowiteKwh),
        buforPct,
      }),
    [zapotrzebowanieCalkowiteKwh, buforPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bufor-rozbudowe" />
      <NaglowekEkranu tytul="Bufor na rozbudowę">
        Projektując system tylko pod dzisiejsze potrzeby, gwarantujesz sobie, że za 2 lata będzie
        za mały — bufor to świadoma decyzja, ile „zapasu na przyszłość” wbudować od razu. Moduł 2,
        Ekran 13.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Całkowite zapotrzebowanie dobowe (bez bufora)"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={zapotrzebowanieCalkowiteKwh}
          onChange={(e) => setZapotrzebowanieCalkowiteKwh(e.target.value)}
        />
        <PoleSelect
          label="Bufor na rozbudowę"
          value={buforPct}
          onChange={(e) => setBuforPct(Number(e.target.value) as BuforRozbudowyInput["buforPct"])}
        >
          {OPCJE_BUFORA_PCT.map((opcja) => (
            <option key={opcja} value={opcja}>
              {opcja}%
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz całkowite zapotrzebowanie, żeby zobaczyć wynik z buforem.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Zapotrzebowanie nie może być ujemne.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Zapotrzebowanie z buforem">
          <WynikGlowny>
            {result.value.zapotrzebowanieZBuforemKwh.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} kWh/dobę
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
