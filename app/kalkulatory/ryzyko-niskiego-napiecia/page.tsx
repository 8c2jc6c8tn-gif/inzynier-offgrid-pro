"use client"

import { useMemo, useState } from "react"
import { calculateRyzykoNiskiegoNapiecia } from "@/lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function RyzykoNiskiegoNapieciaPage() {
  const [minNapiecieRoboczeV, setMinNapiecieRoboczeV] = useState("")
  const [aktualneNapiecieSystemuV, setAktualneNapiecieSystemuV] = useState("")

  const result = useMemo(
    () =>
      calculateRyzykoNiskiegoNapiecia({
        minNapiecieRoboczeV: minNapiecieRoboczeV === "" ? 0 : Number(minNapiecieRoboczeV),
        aktualneNapiecieSystemuV: aktualneNapiecieSystemuV === "" ? 0 : Number(aktualneNapiecieSystemuV),
      }),
    [minNapiecieRoboczeV, aktualneNapiecieSystemuV],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-niskiego-napiecia" />
      <NaglowekEkranu tytul="Ryzyko wyłączenia pompy przy niskim napięciu">
        Niskie napięcie to cichy zabójca pomp — nie zepsuje się od razu, po prostu przestanie
        działać dokładnie wtedy, gdy jest najbardziej potrzebna. Moduł 6, ekran dodatkowy (dawne
        5.63).
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Minimalne napięcie pracy pompy"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Z karty katalogowej pompy ciepła."
          value={minNapiecieRoboczeV}
          onChange={(e) => setMinNapiecieRoboczeV(e.target.value)}
        />
        <Pole
          label="Aktualne napięcie systemu off-grid"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Docelowo auto z Modułu 4 (live) — dziś wpisz ręcznie."
          value={aktualneNapiecieSystemuV}
          onChange={(e) => setAktualneNapiecieSystemuV(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? "Pompa się wyłączy" : "Margines do progu wyłączenia"}>
          <WynikGlowny>{result.value.marginesV.toFixed(1)} V</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
