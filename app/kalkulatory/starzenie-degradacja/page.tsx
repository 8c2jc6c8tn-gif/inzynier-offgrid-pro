"use client"

import { useMemo, useState } from "react"
import { calculateStarzenieDegradacja } from "@/lib/core/modules/baterie/starzenie-degradacja/calculator"
import type { HoryzontLata } from "@/lib/core/modules/baterie/starzenie-degradacja/input"
import {
  DEGRADACJA_TYPOWA_MAX_PCT,
  DEGRADACJA_TYPOWA_MIN_PCT,
} from "@/lib/core/modules/baterie/starzenie-degradacja/constants"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function StarzenieDegradacjaPage() {
  const [pojemnoscUzytecznaDzisKwh, setPojemnoscUzytecznaDzisKwh] = useState("")
  const [horyzontLata, setHoryzontLata] = useState<HoryzontLata>(10)
  const [degradacjaRocznaPct, setDegradacjaRocznaPct] = useState("")

  const result = useMemo(
    () =>
      calculateStarzenieDegradacja({
        pojemnoscUzytecznaDzisKwh: pojemnoscUzytecznaDzisKwh === "" ? 0 : Number(pojemnoscUzytecznaDzisKwh),
        horyzontLata,
        degradacjaRocznaPct: degradacjaRocznaPct === "" ? 0 : Number(degradacjaRocznaPct),
      }),
    [pojemnoscUzytecznaDzisKwh, horyzontLata, degradacjaRocznaPct],
  )

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
          hint="Docelowo automatycznie z Ekranu 1 (Dobór pojemności baterii) — na razie wpisz ręcznie."
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
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
