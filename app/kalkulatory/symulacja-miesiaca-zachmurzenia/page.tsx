"use client"

import { useMemo } from "react"
import { calculateSymulacjaZachmurzenia } from "@/lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/calculator"
import { LICZBA_DNI_SCENARIUSZA_SUGEROWANA } from "@/lib/core/modules/baterie/symulacja-miesiaca-zachmurzenia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pojemnoscUzytecznaKwh: string
  socStartPct: string
  zapotrzebowanieDoboweKwh: string
  produkcjaNominalnaDobowaKwh: string
  poziomZachmurzeniaPct: string
  liczbaDniScenariusza: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaKwh: "",
  socStartPct: "100",
  zapotrzebowanieDoboweKwh: "",
  produkcjaNominalnaDobowaKwh: "",
  poziomZachmurzeniaPct: "",
  liczbaDniScenariusza: String(LICZBA_DNI_SCENARIUSZA_SUGEROWANA),
}

function formatujGodzine(godzinaW24h: number): string {
  const godziny = Math.floor(godzinaW24h)
  const minuty = Math.round((godzinaW24h - godziny) * 60)
  return `${String(godziny).padStart(2, "0")}:${String(minuty).padStart(2, "0")}`
}

export default function SymulacjaMiesiacaZachmurzeniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("symulacja-miesiaca-zachmurzenia", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    pojemnoscUzytecznaKwh,
    socStartPct,
    zapotrzebowanieDoboweKwh,
    produkcjaNominalnaDobowaKwh,
    poziomZachmurzeniaPct,
    liczbaDniScenariusza,
  } = stan

  const result = useMemo(
    () =>
      calculateSymulacjaZachmurzenia({
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        socStartPct: socStartPct === "" ? 0 : Number(socStartPct),
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        produkcjaNominalnaDobowaKwh: produkcjaNominalnaDobowaKwh === "" ? 0 : Number(produkcjaNominalnaDobowaKwh),
        poziomZachmurzeniaPct: poziomZachmurzeniaPct === "" ? 0 : Number(poziomZachmurzeniaPct),
        liczbaDniScenariusza: liczbaDniScenariusza === "" ? 0 : Number(liczbaDniScenariusza),
      }),
    [
      pojemnoscUzytecznaKwh,
      socStartPct,
      zapotrzebowanieDoboweKwh,
      produkcjaNominalnaDobowaKwh,
      poziomZachmurzeniaPct,
      liczbaDniScenariusza,
    ],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/symulacja-miesiaca-zachmurzenia" />
      <NaglowekEkranu tytul="Symulacja miesiąca zachmurzenia (No-Sun Scenario)">
        Projektujesz system nie na średnią pogodę, tylko na najgorszy realistyczny tydzień w roku
        — to jest istota prawdziwego off-gridu. Moduł 4, Ekran 33.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność użyteczna baterii"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.pojemnoscUzytecznaKwh}
          onChange={(e) => setPole("pojemnoscUzytecznaKwh", e.target.value)}
          hint="Docelowo automatycznie z Ekranu 1 (Dobór pojemności)."
        />
        <Pole
          label="SoC na początku scenariusza"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socStartPct}
          onChange={(e) => setPole("socStartPct", e.target.value)}
        />
        <Pole
          label="Zapotrzebowanie dobowe"
          unit="kWh/dzień"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.zapotrzebowanieDoboweKwh}
          onChange={(e) => setPole("zapotrzebowanieDoboweKwh", e.target.value)}
          hint="Docelowo automatycznie z Modułu 2."
        />
        <Pole
          label="Nominalna produkcja dobowa PV (dzień słoneczny)"
          unit="kWh/dzień"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.produkcjaNominalnaDobowaKwh}
          onChange={(e) => setPole("produkcjaNominalnaDobowaKwh", e.target.value)}
          hint="Docelowo automatycznie z Modułu 3."
        />
        <Pole
          label="Poziom zachmurzenia (% produkcji nominalnej)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.poziomZachmurzeniaPct}
          onChange={(e) => setPole("poziomZachmurzeniaPct", e.target.value)}
          hint="Źródło sugeruje zakres 5–10% dla czarnego scenariusza — brak jednej kanonicznej wartości, ustal świadomie."
        />
        <Pole
          label="Liczba dni scenariusza"
          unit="dni"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stan.liczbaDniScenariusza}
          onChange={(e) => setPole("liczbaDniScenariusza", e.target.value)}
          hint={`Sugerowane ze źródła: ${LICZBA_DNI_SCENARIUSZA_SUGEROWANA} dni — edytowalne.`}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć symulację.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.przetrwaCalyScenariusz ? "Przetrwa cały scenariusz" : "System padnie przed końcem scenariusza"}
        >
          <WynikGlowny>
            {result.value.przetrwaCalyScenariusz
              ? "Brak blackoutu"
              : `Padnie ${result.value.dzienPadnieSystem}. dnia o ${formatujGodzine(result.value.godzinaPadnieSystemW24H ?? 0)}`}
          </WynikGlowny>
          {!result.value.przetrwaCalyScenariusz && (
            <p className="mt-1 text-small">
              Aby przetrwać bez agregatu, potrzebujesz dodatkowych{" "}
              <strong>{result.value.energiaBrakujacaKwh.toFixed(1)} kWh</strong> pojemności baterii.
            </p>
          )}
          <p className="mt-1 text-small">
            {result.value.dobowyDeficytKwh > 0
              ? `Deficyt energii: ${result.value.dobowyDeficytKwh.toFixed(1)} kWh/dzień.`
              : `Nadwyżka energii nawet w tym scenariuszu: ${Math.abs(result.value.dobowyDeficytKwh).toFixed(1)} kWh/dzień.`}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
