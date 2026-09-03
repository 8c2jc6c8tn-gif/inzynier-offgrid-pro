"use client"

import { useMemo, useState } from "react"
import { calculateDoborPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import {
  DOD_LIFEPO4_TYPOWY_MAX_PCT,
  DOD_LIFEPO4_TYPOWY_MIN_PCT,
  SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT,
} from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function DoborPojemnosciBateriiPage() {
  const [zapotrzebowanieDoboweKwh, setZapotrzebowanieDoboweKwh] = useState("")
  const [dniAutonomii, setDniAutonomii] = useState("")
  const [sprawnoscFalownikaPct, setSprawnoscFalownikaPct] = useState(
    String(SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT),
  )
  const [dodPct, setDodPct] = useState("")

  const result = useMemo(
    () =>
      calculateDoborPojemnosci({
        zapotrzebowanieDoboweKwh: zapotrzebowanieDoboweKwh === "" ? 0 : Number(zapotrzebowanieDoboweKwh),
        dniAutonomii: dniAutonomii === "" ? 0 : Number(dniAutonomii),
        sprawnoscFalownikaPct: sprawnoscFalownikaPct === "" ? 0 : Number(sprawnoscFalownikaPct),
        dodPct: dodPct === "" ? 0 : Number(dodPct),
      }),
    [zapotrzebowanieDoboweKwh, dniAutonomii, sprawnoscFalownikaPct, dodPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-pojemnosci-baterii" />
      <NaglowekEkranu tytul="Dobór pojemności baterii">
        Bateria nigdy nie jest w 100% „użyteczna” — część pojemności to bufor bezpieczeństwa,
        żeby nie skracać jej życia głębokim rozładowywaniem. Moduł 4, Ekran 1.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie dobowe"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieDoboweKwh}
          onChange={(e) => setZapotrzebowanieDoboweKwh(e.target.value)}
          hint="Docelowo automatycznie z Modułu 2 (bilans obciążeń) — na razie wpisz ręcznie."
        />
        <Pole
          label="Dni autonomii"
          unit="dni"
          type="number"
          inputMode="decimal"
          min={0}
          value={dniAutonomii}
          onChange={(e) => setDniAutonomii(e.target.value)}
          hint="Ile dni bez słońca system ma wytrzymać wyłącznie na baterii. Docelowo z Modułu 2, Ekran 7."
        />
        <Pole
          label="Sprawność falownika"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={sprawnoscFalownikaPct}
          onChange={(e) => setSprawnoscFalownikaPct(e.target.value)}
          hint={`Sugerowany start: ${SPRAWNOSC_FALOWNIKA_SUGEROWANA_PCT}% — edytowalne, nie ukryty domyślny.`}
        />
        <Pole
          label="DoD (głębokość rozładowania)"
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={dodPct}
          onChange={(e) => setDodPct(e.target.value)}
          hint={`Dla LiFePO4 typowo ${DOD_LIFEPO4_TYPOWY_MIN_PCT}–${DOD_LIFEPO4_TYPOWY_MAX_PCT}% — reszta to bufor chroniący żywotność.`}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Wymagana pojemność użyteczna">
          <WynikGlowny>{result.value.pojemnoscUzytecznaKwh.toFixed(1)} kWh</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
