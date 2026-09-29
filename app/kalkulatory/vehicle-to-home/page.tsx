"use client"

import { useMemo } from "react"
import { calculateVehicleToHome } from "@/lib/core/modules/baterie/vehicle-to-home/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"

type FormularzStan = {
  wspieraV2h: boolean
  pojemnoscBaterEvKwh: string
  rezerwaNaDojazdKwh: string
  sprawnoscEfektywnaPct: string
  kosztWymianyBateriiZl: string
  liczbaCykli: string
}

const STAN_POCZATKOWY: FormularzStan = {
  wspieraV2h: false,
  pojemnoscBaterEvKwh: "",
  rezerwaNaDojazdKwh: "",
  sprawnoscEfektywnaPct: "",
  kosztWymianyBateriiZl: "",
  liczbaCykli: "",
}

export default function VehicleToHomePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("vehicle-to-home", STAN_POCZATKOWY)
  const { wspieraV2h, pojemnoscBaterEvKwh, rezerwaNaDojazdKwh, sprawnoscEfektywnaPct, kosztWymianyBateriiZl, liczbaCykli } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setWspieraV2h = (a: boolean | ((p: boolean) => boolean)) => setPole("wspieraV2h", a)
  const setPojemnoscBaterEvKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscBaterEvKwh", a)
  const setRezerwaNaDojazdKwh = (a: string | ((p: string) => string)) => setPole("rezerwaNaDojazdKwh", a)
  const setSprawnoscEfektywnaPct = (a: string | ((p: string) => string)) => setPole("sprawnoscEfektywnaPct", a)
  const setKosztWymianyBateriiZl = (a: string | ((p: string) => string)) => setPole("kosztWymianyBateriiZl", a)
  const setLiczbaCykli = (a: string | ((p: string) => string)) => setPole("liczbaCykli", a)

  const result = useMemo(
    () =>
      calculateVehicleToHome({
        wspieraV2h,
        pojemnoscBaterEvKwh: pojemnoscBaterEvKwh === "" ? 0 : Number(pojemnoscBaterEvKwh),
        rezerwaNaDojazdKwh: rezerwaNaDojazdKwh === "" ? 0 : Number(rezerwaNaDojazdKwh),
        sprawnoscEfektywnaPct: sprawnoscEfektywnaPct === "" ? 0 : Number(sprawnoscEfektywnaPct),
        kosztWymianyBateriiZl: kosztWymianyBateriiZl === "" ? 0 : Number(kosztWymianyBateriiZl),
        liczbaCykli: liczbaCykli === "" ? 0 : Number(liczbaCykli),
      }),
    [wspieraV2h, pojemnoscBaterEvKwh, rezerwaNaDojazdKwh, sprawnoscEfektywnaPct, kosztWymianyBateriiZl, liczbaCykli],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/vehicle-to-home" />
      <NaglowekEkranu tytul="Vehicle-to-Home (V2H)" ekran="vehicle-to-home" wzor={result.formula}>
        Auto może być powerbankiem na kółkach, ale to zużywa jego baterię trakcyjną — warto
        policzyć, czy to się opłaca, zanim zrobisz to w praktyce. Moduł 4, Ekran 19.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="wspiera-v2h"
          label="Falownik i auto wspierają V2H (nie tylko V2L)"
          checked={wspieraV2h}
          onChange={(e) => setWspieraV2h(e.target.checked)}
        />
        <Pole
          label="Pojemność baterii trakcyjnej EV"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscBaterEvKwh}
          onChange={(e) => setPojemnoscBaterEvKwh(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="pojemnosc" />}
        />
        <Pole
          label="Rezerwa na dojazd"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezerwaNaDojazdKwh}
          onChange={(e) => setRezerwaNaDojazdKwh(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="rezerwa" />}
        />
        <Pole
          label="Sprawność efektywna (degradacja + straty)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscEfektywnaPct}
          onChange={(e) => setSprawnoscEfektywnaPct(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="sprawnosc" />}
        />
        <Pole
          label="Koszt wymiany baterii trakcyjnej"
          unit="zł"
          type="number"
          inputMode="decimal"
          min={0}
          value={kosztWymianyBateriiZl}
          onChange={(e) => setKosztWymianyBateriiZl(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="kosztWymiany" />}
        />
        <Pole
          label="Liczba cykli życia baterii trakcyjnej"
          unit="cykli"
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaCykli}
          onChange={(e) => setLiczbaCykli(e.target.value)}
          pomoc={<PomocPola ekran="vehicle-to-home" pole="cykle" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"}
          etykieta="Realnie dostępna pojemność / koszt"
        >
          <WynikGlowny>{result.value.pojemnoscRealnaKwh.toFixed(1)} kWh</WynikGlowny>
          <p className="mt-2 text-small">
            Koszt 1 kWh z baterii EV: {result.value.kosztZaKwh.toFixed(2)} zł.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
