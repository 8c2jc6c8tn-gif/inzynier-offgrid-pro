"use client"

import { useMemo } from "react"
import { calculateBuforRozbudowy } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/calculator"
import { OPCJE_BUFORA_PCT } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/constants"
import type { BuforRozbudowyInput } from "@/lib/core/modules/zapotrzebowanie/bufor-rozbudowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  zapotrzebowanieCalkowiteKwh: string
  buforPct: BuforRozbudowyInput["buforPct"]
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieCalkowiteKwh: "",
  buforPct: 0,
}

export default function BuforRozbudowyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bufor-rozbudowe", STAN_POCZATKOWY)
  const { zapotrzebowanieCalkowiteKwh, buforPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieCalkowiteKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieCalkowiteKwh", a)
  const setBuforPct = (
    a: BuforRozbudowyInput["buforPct"] | ((p: BuforRozbudowyInput["buforPct"]) => BuforRozbudowyInput["buforPct"]),
  ) => setPole("buforPct", a)

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
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
