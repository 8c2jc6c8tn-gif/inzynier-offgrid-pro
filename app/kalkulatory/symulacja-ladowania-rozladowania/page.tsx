"use client"

import { useMemo } from "react"
import { calculateSymulacjaLadowania } from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/calculator"
import {
  DLUGOSC_DNIA_SUGEROWANA_GODZ,
  SOC_PROG_SUGEROWANY_PCT,
} from "@/lib/core/modules/baterie/symulacja-ladowania-rozladowania/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pojemnoscUzytecznaKwh: string
  socStartPct: string
  mocLadowaniaKw: string
  mocRozladowaniaKw: string
  dlugoscDniaGodz: string
  socProgPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaKwh: "",
  socStartPct: "",
  mocLadowaniaKw: "",
  mocRozladowaniaKw: "",
  dlugoscDniaGodz: String(DLUGOSC_DNIA_SUGEROWANA_GODZ),
  socProgPct: String(SOC_PROG_SUGEROWANY_PCT),
}

export default function SymulacjaLadowaniaRozladowaniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("symulacja-ladowania-rozladowania", STAN_POCZATKOWY)

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: string) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const {
    pojemnoscUzytecznaKwh,
    socStartPct,
    mocLadowaniaKw,
    mocRozladowaniaKw,
    dlugoscDniaGodz,
    socProgPct,
  } = stan

  const result = useMemo(
    () =>
      calculateSymulacjaLadowania({
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        socStartPct: socStartPct === "" ? 0 : Number(socStartPct),
        mocLadowaniaKw: mocLadowaniaKw === "" ? 0 : Number(mocLadowaniaKw),
        mocRozladowaniaKw: mocRozladowaniaKw === "" ? 0 : Number(mocRozladowaniaKw),
        dlugoscDniaGodz: dlugoscDniaGodz === "" ? 0 : Number(dlugoscDniaGodz),
        socProgPct: socProgPct === "" ? 0 : Number(socProgPct),
      }),
    [pojemnoscUzytecznaKwh, socStartPct, mocLadowaniaKw, mocRozladowaniaKw, dlugoscDniaGodz, socProgPct],
  )

  const poziom = result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "blad"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/symulacja-ladowania-rozladowania" />
      <NaglowekEkranu
        tytul="Symulacja czasu ładowania/rozładowania"
        ekran="symulacja-ladowania-rozladowania"
        wynik={result}
      >
        Pokazuje, czy Twoja bateria i produkcja PV są w ogóle zsynchronizowane z Twoim zużyciem —
        czy zdąży naładować się w ciągu dnia i czy przetrwa do rana. Moduł 4, Ekran 3.
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
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="pojemnosc" />}
        />
        <Pole
          label="SoC na początku dnia"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socStartPct}
          onChange={(e) => setPole("socStartPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="socStart" />}
        />
        <Pole
          label="Średnia moc ładowania z PV"
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocLadowaniaKw}
          onChange={(e) => setPole("mocLadowaniaKw", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="mocLadowania" />}
        />
        <Pole
          label="Długość okna ładowania (naświetlenia)"
          unit="godz."
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={stan.dlugoscDniaGodz}
          onChange={(e) => setPole("dlugoscDniaGodz", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="oknoLadowania" />}
        />
        <Pole
          label="Średnia moc rozładowania w nocy"
          unit="kW"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.mocRozladowaniaKw}
          onChange={(e) => setPole("mocRozladowaniaKw", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="mocNoc" />}
        />
        <Pole
          label="Próg ostrzegawczy SoC"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.socProgPct}
          onChange={(e) => setPole("socProgPct", e.target.value)}
          pomoc={<PomocPola ekran="symulacja-ladowania-rozladowania" pole="progSoc" params={{ progSoc: SOC_PROG_SUGEROWANY_PCT }} />}
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
          etykieta={result.value.przetrwaCalaNoc ? "Przetrwa całą noc" : "Nie przetrwa do rana"}
        >
          <WynikGlowny>
            {Number.isFinite(result.value.godzinDoPelna)
              ? `Pełna po ${result.value.godzinDoPelna.toFixed(1)} godz.`
              : "Nie naładuje się dziś"}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {result.value.zdazyNaladowacPrzedZachodem
              ? "Zdąży naładować się w pełni przed zachodem słońca."
              : `Do zachodu SoC osiągnie tylko ${result.value.socOZachodzieSlonca.toFixed(0)}%.`}
          </p>
          <p className="mt-1 text-small">
            Próg {stan.socProgPct}% SoC osiągnie po{" "}
            <strong>{result.value.godzinDoProguWNocy.toFixed(1)} godz.</strong> od zachodu słońca.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
