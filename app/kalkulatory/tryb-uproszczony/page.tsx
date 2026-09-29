"use client"

import { useMemo } from "react"
import { calculateTrybUproszczony } from "@/lib/core/modules/kalkulator-mobilny/tryb-uproszczony/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscAh: string
  napiecieV: string
  mocOdbiornikaW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscAh: "100",
  napiecieV: "12",
  mocOdbiornikaW: "50",
}

export default function TrybUproszczonyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("tryb-uproszczony", STAN_POCZATKOWY)
  const { pojemnoscAh, napiecieV, mocOdbiornikaW } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscAh = (a: string | ((p: string) => string)) => setPole("pojemnoscAh", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setMocOdbiornikaW = (a: string | ((p: string) => string)) => setPole("mocOdbiornikaW", a)

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
      <NaglowekEkranu tytul="Tryb uproszczony" ekran="tryb-uproszczony" wynik={result}>
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
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="pojemnosc" />}
        />
        <Pole
          label="Napięcie"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="napiecie" />}
        />
        <Pole
          label="Moc odbiornika"
          unit="W"
          type="number"
          inputMode="decimal"
          value={mocOdbiornikaW}
          onChange={(e) => setMocOdbiornikaW(e.target.value)}
          pomoc={<PomocPola ekran="tryb-uproszczony" pole="moc" />}
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
