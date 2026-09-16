"use client"

import { useMemo, useState } from "react"
import { calculateTrybUproszczony } from "@/lib/core/modules/kalkulator-mobilny/tryb-uproszczony/calculator"
import { WerdyktPanel } from "@/components/werdykt"
import { Pole } from "@/components/ui/pole"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function TrybUproszczonyPage() {
  const t = useTranslate()
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
      <NawigacjaEkranu href="/kalkulatory/tryb-uproszczony" />
      <NaglowekEkranu tytul="Tryb uproszczony">
        To wejście dla kogoś, kto nie chce przechodzić przez pełny proces projektowy — szybka
        odpowiedź na jedno pytanie. Moduł 12, Ekran 1.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność akumulatora"
          unit="Ah"
          type="number"
          inputMode="decimal"
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
        />
        <Pole
          label="Napięcie"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
        />
        <Pole
          label="Moc odbiornika"
          unit="W"
          type="number"
          inputMode="decimal"
          value={mocOdbiornikaW}
          onChange={(e) => setMocOdbiornikaW(e.target.value)}
        />
      </div>

      <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "ok"}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">Nie da się policzyć — sprawdź dane wejściowe powyżej.</p>
        ) : (
          <p className="mt-1 text-h1 font-semibold">
            {result.value.toFixed(1)} {result.unit}
          </p>
        )}

        {result.assumptions.length > 0 && (
          <ul className="mt-2 text-small opacity-90">
            {result.assumptions.map((a, i) => (
              <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-caption opacity-70">{result.formula}</p>
      </WerdyktPanel>
    </main>
  )
}
