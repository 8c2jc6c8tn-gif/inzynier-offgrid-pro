"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { calculateStarzenieDegradacja } from "@/lib/core/modules/baterie/starzenie-degradacja/calculator"
import type { HoryzontLata } from "@/lib/core/modules/baterie/starzenie-degradacja/input"
import {
  DEGRADACJA_TYPOWA_MAX_PCT,
  DEGRADACJA_TYPOWA_MIN_PCT,
} from "@/lib/core/modules/baterie/starzenie-degradacja/constants"
import { useProfilSprzetu } from "@/lib/profil-sprzetu/use-profil-sprzetu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  pojemnoscUzytecznaDzisKwh: string
  horyzontLata: HoryzontLata
  degradacjaRocznaPct: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscUzytecznaDzisKwh: "",
  horyzontLata: 10,
  degradacjaRocznaPct: "",
}

export default function StarzenieDegradacjaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("starzenie-degradacja", STAN_POCZATKOWY)
  const { pojemnoscUzytecznaDzisKwh, horyzontLata, degradacjaRocznaPct } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscUzytecznaDzisKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscUzytecznaDzisKwh", a)
  const setHoryzontLata = (a: HoryzontLata | ((p: HoryzontLata) => HoryzontLata)) => setPole("horyzontLata", a)
  const setDegradacjaRocznaPct = (a: string | ((p: string) => string)) => setPole("degradacjaRocznaPct", a)

  // Profil sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) — jednorazowe auto-wypełnienie
  // z wyniku Ekranu 1 (dobor-pojemnosci), gdy dostępny. Ustawienie stanu bezpośrednio w renderze
  // (nie w useEffect — wzorzec "Adjusting state when a prop changes" z react.dev, bez refów —
  // niedozwolone podczas renderu w tym projekcie), bo `profil` ładuje się asynchronicznie z
  // IndexedDB tylko raz po zamontowaniu: React odrzuca ten render i renderuje ponownie z już
  // wypełnionym polem, bez migotania. `autoWypelnione` pilnuje, żeby to zdarzyło się tylko raz —
  // dalsze ręczne edycje pola nie są nadpisywane wsteczną zmianą profilu.
  const { profil, zapiszBaterie } = useProfilSprzetu()
  const [autoWypelnione, setAutoWypelnione] = useState(false)
  const zEkranu1 = profil.bateria?.pojemnoscUzytecznaDzisKwh
  if (!autoWypelnione && zEkranu1 !== undefined) {
    setAutoWypelnione(true)
    setPojemnoscUzytecznaDzisKwh(String(zEkranu1))
  }

  const result = useMemo(
    () =>
      calculateStarzenieDegradacja({
        pojemnoscUzytecznaDzisKwh: pojemnoscUzytecznaDzisKwh === "" ? 0 : Number(pojemnoscUzytecznaDzisKwh),
        horyzontLata,
        degradacjaRocznaPct: degradacjaRocznaPct === "" ? 0 : Number(degradacjaRocznaPct),
      }),
    [pojemnoscUzytecznaDzisKwh, horyzontLata, degradacjaRocznaPct],
  )

  useEffect(() => {
    if (result.status !== "VALID") return
    zapiszBaterie({
      pojemnoscPoczatkowaZBuforemKwh: result.value.pojemnoscPoczatkowaKwh,
      buforHoryzontLata: horyzontLata,
      pojemnoscZBuforemZaktualizowanoIso: new Date().toISOString(),
    })
  }, [result, horyzontLata, zapiszBaterie])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/starzenie-degradacja" />
      <NaglowekEkranu tytul="Starzenie i degradacja ogniw">
        Kupujesz baterię nie na dziś, tylko na cały okres jej życia — trzeba od razu doliczyć
        zapas na to, że będzie „słabnąć”. Moduł 4, Ekran 6.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Pojemność użyteczna potrzebna dziś"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscUzytecznaDzisKwh}
          onChange={(e) => setPojemnoscUzytecznaDzisKwh(e.target.value)}
          hint={
            autoWypelnione
              ? "Auto z Ekranu 1 (Dobór pojemności baterii) — możesz nadpisać, nie zapisze się to na stałe w Ekranie 1."
              : "Wpisz ręcznie albo policz najpierw Ekran 1 (Dobór pojemności baterii) — wynik zostanie tu podstawiony automatycznie."
          }
        />

        <PoleSelect
          label="Horyzont projektowy"
          value={horyzontLata}
          onChange={(e) => setHoryzontLata(Number(e.target.value) as HoryzontLata)}
        >
          <option value={5}>5 lat</option>
          <option value={10}>10 lat</option>
          <option value={15}>15 lat</option>
        </PoleSelect>

        <Pole
          label="Roczny spadek pojemności"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={degradacjaRocznaPct}
          onChange={(e) => setDegradacjaRocznaPct(e.target.value)}
          hint={`LiFePO4 typowo ${DEGRADACJA_TYPOWA_MIN_PCT}–${DEGRADACJA_TYPOWA_MAX_PCT}% rocznie.`}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Wymagana pojemność początkowa">
          <WynikGlowny>{result.value.pojemnoscPoczatkowaKwh.toFixed(1)} kWh</WynikGlowny>
          <p className="mt-1 text-small">
            Po {horyzontLata} latach zostanie ok.{" "}
            {(result.value.ulamekPozostalyPoHoryzoncie * 100).toFixed(0)}% pojemności początkowej.
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            Ten wynik jest teraz widoczny też na{" "}
            <Link href="/kalkulatory/dobor-pojemnosci-baterii" className="underline">
              Ekranie 1, Dobór pojemności baterii
            </Link>
            .
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
