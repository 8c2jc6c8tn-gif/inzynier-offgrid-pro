"use client"

import { useMemo, useState } from "react"
import { calculateColdCRate } from "@/lib/core/modules/baterie/cold-c-rate/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const POZIOM_ZE_STREFY: Record<string, WerdyktPoziom> = {
  blokada: "blad",
  "limit-01c": "uwaga",
  "limit-02c": "uwaga",
  "luka-zrodla": "uwaga",
  "pelny-prad": "ok",
}

const ETYKIETA_ZE_STREFY: Record<string, string> = {
  blokada: "Ładowanie zablokowane — za zimno",
  "limit-01c": "Ładowanie ograniczone do 0,1C",
  "limit-02c": "Ładowanie ograniczone do 0,2C",
  "luka-zrodla": "Zakres nieokreślony w źródle",
  "pelny-prad": "Brak ograniczenia od strony temperatury",
}

export default function ColdCRatePage() {
  const t = useTranslate()
  const [temperaturaOgniwaC, setTemperaturaOgniwaC] = useState("")
  const [pojemnoscAh, setPojemnoscAh] = useState("")

  const result = useMemo(
    () =>
      calculateColdCRate({
        temperaturaOgniwaC: temperaturaOgniwaC === "" ? null : Number(temperaturaOgniwaC),
        pojemnoscAh: pojemnoscAh === "" ? 0 : Number(pojemnoscAh),
      }),
    [temperaturaOgniwaC, pojemnoscAh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cold-c-rate" />
      <NaglowekEkranu tytul="Ograniczenie prądu ładowania w mrozie">
        W lodówce miód ledwo płynie. W baterii jony litu też poruszają się wolniej na mrozie —
        ładowanie zbyt szybkie w zimnie trwale uszkadza ogniwa (osadzanie litu metalicznego).
        Moduł 4, Ekran 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Temperatura ogniwa"
          unit="°C"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={temperaturaOgniwaC}
          onChange={(e) => setTemperaturaOgniwaC(e.target.value)}
          hint="Live z BMS. 0°C jest prawidłowym pomiarem."
        />
        <Pole
          label="Pojemność pakietu"
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscAh}
          onChange={(e) => setPojemnoscAh(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz temperaturę i pojemność, żeby zobaczyć limit.</p>
      ) : (
        <WerdyktPanel
          poziom={POZIOM_ZE_STREFY[result.value.strefa]}
          etykieta={ETYKIETA_ZE_STREFY[result.value.strefa]}
        >
          {result.value.maxPradA !== null && (
            <WynikGlowny>{result.value.maxPradA.toLocaleString("pl-PL")} A</WynikGlowny>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
