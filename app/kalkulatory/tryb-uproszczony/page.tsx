"use client"

import { useMemo, useState } from "react"
import { calculateTrybUproszczony } from "@/lib/core/modules/kalkulator-mobilny/tryb-uproszczony/calculator"
import { WerdyktPanel } from "@/components/werdykt"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function TrybUproszczonyPage() {
  const [pojemnoscAh, setPojemnoscAh] = useState("100")
  const [napiecieV, setNapiecieV] = useState("12")
  const [mocOdbiornikaW, setMocOdbiornikaW] = useState("50")

  const result = useMemo(
    () =>
      calculateTrybUproszczony({
        pojemnoscAh: Number(pojemnoscAh),
        napiecieV: Number(napiecieV),
        mocOdbiornikaW: Number(mocOdbiornikaW),
      }),
    [pojemnoscAh, napiecieV, mocOdbiornikaW],
  )


  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Tryb uproszczony</h1>
        <p className="text-sm text-muted-foreground">
          To wejście dla kogoś, kto nie chce przechodzić przez pełny proces projektowy — szybka
          odpowiedź na jedno pytanie. Moduł 12, Ekran 1.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Pojemność akumulatora <span className="text-muted-foreground">[Ah]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={pojemnoscAh}
            onChange={(e) => setPojemnoscAh(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Napięcie <span className="text-muted-foreground">[V]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={napiecieV}
            onChange={(e) => setNapiecieV(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Moc odbiornika <span className="text-muted-foreground">[W]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={mocOdbiornikaW}
            onChange={(e) => setMocOdbiornikaW(e.target.value)}
          />
        </label>
      </div>

      <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "ok"}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="mt-1 text-2xl font-semibold">{result.value.toFixed(1)} {result.unit}</p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-sm opacity-90">
            {result.assumptions.map((a) => (
              <li key={a}>Założenie: {a}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-xs opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
