"use client"

import { useMemo, useState } from "react"
import { calculateModulEv } from "@/lib/core/modules/baterie/modul-ev/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { useTranslate } from "@/lib/i18n/language-context"

export default function ModulEvPage() {
  const t = useTranslate()
  const [energiaDobowaEvKwh, setEnergiaDobowaEvKwh] = useState("")
  const [nadwyzkaPvLatemKwh, setNadwyzkaPvLatemKwh] = useState("")
  const [nadwyzkaPvZimaKwh, setNadwyzkaPvZimaKwh] = useState("")

  const result = useMemo(
    () =>
      calculateModulEv({
        energiaDobowaEvKwh: energiaDobowaEvKwh === "" ? 0 : Number(energiaDobowaEvKwh),
        nadwyzkaPvLatemKwh: nadwyzkaPvLatemKwh === "" ? null : Number(nadwyzkaPvLatemKwh),
        nadwyzkaPvZimaKwh: nadwyzkaPvZimaKwh === "" ? null : Number(nadwyzkaPvZimaKwh),
      }),
    [energiaDobowaEvKwh, nadwyzkaPvLatemKwh, nadwyzkaPvZimaKwh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/modul-ev" />
      <NaglowekEkranu tytul="Moduł EV — ładowanie samochodu elektrycznego">
        EV to dodatkowy „odbiornik” o dużym apetycie — trzeba go policzyć osobno, bo potrafi zjeść
        całą nadwyżkę produkcji. Moduł 4, Ekran 4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Dobowe zapotrzebowanie na ładowanie EV"
          unit="kWh/dobę"
          type="number"
          inputMode="decimal"
          min={0}
          value={energiaDobowaEvKwh}
          onChange={(e) => setEnergiaDobowaEvKwh(e.target.value)}
        />
        <Pole
          label="Nadwyżka produkcji PV latem"
          unit="kWh/dobę"
          type="number"
          inputMode="decimal"
          min={0}
          value={nadwyzkaPvLatemKwh}
          onChange={(e) => setNadwyzkaPvLatemKwh(e.target.value)}
          hint="Docelowo automatycznie z Modułu 3 (instalacja PV) — na razie wpisz ręcznie."
        />
        <Pole
          label="Nadwyżka produkcji PV zimą"
          unit="kWh/dobę"
          type="number"
          inputMode="decimal"
          min={0}
          value={nadwyzkaPvZimaKwh}
          onChange={(e) => setNadwyzkaPvZimaKwh(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Sprawdź wpisane dane — wartości nie mogą być ujemne.</p>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={result.value.pokryteLatem && result.value.pokryteZima ? "ok" : "uwaga"}
          etykieta="Pokrycie ładowania EV nadwyżką PV"
        >
          <WynikGlowny>
            {result.value.pokryteLatem ? "Latem: pokryte" : `Latem: brak ${result.value.brakLatemKwh.toFixed(1)} kWh`}
          </WynikGlowny>
          <p className="mt-1 text-body">
            {result.value.pokryteZima ? "Zimą: pokryte" : `Zimą: brak ${result.value.brakZimaKwh.toFixed(1)} kWh`}
          </p>
          {result.warnings.map((w, i) => (
            <p key={i} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
