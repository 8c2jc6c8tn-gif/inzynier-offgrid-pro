"use client"

import { useMemo, useState } from "react"
import { calculateSezonowosc } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/calculator"
import type { TypSezonowosci } from "@/lib/core/modules/zapotrzebowanie/sezonowosc/input"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"

const ETYKIETY_TYPU: Record<TypSezonowosci, string> = {
  caloroczny: "Całoroczny",
  sezonowy: "Sezonowy (tylko w wybranych miesiącach)",
  weekendowy: "Weekendowy",
}

export default function SezonowoscPage() {
  const [zapotrzebowanieKwhDoba, setZapotrzebowanieKwhDoba] = useState("")
  const [typ, setTyp] = useState<TypSezonowosci>("caloroczny")
  const [miesiacOd, setMiesiacOd] = useState("")
  const [miesiacDo, setMiesiacDo] = useState("")
  const [aktualnyMiesiac, setAktualnyMiesiac] = useState("")
  const [czyWeekend, setCzyWeekend] = useState(false)

  const result = useMemo(
    () =>
      calculateSezonowosc({
        zapotrzebowanieKwhDoba: zapotrzebowanieKwhDoba === "" ? 0 : Number(zapotrzebowanieKwhDoba),
        typ,
        miesiacOd: miesiacOd === "" ? 0 : Number(miesiacOd),
        miesiacDo: miesiacDo === "" ? 0 : Number(miesiacDo),
        aktualnyMiesiac: aktualnyMiesiac === "" ? 0 : Number(aktualnyMiesiac),
        czyWeekend,
      }),
    [zapotrzebowanieKwhDoba, typ, miesiacOd, miesiacDo, aktualnyMiesiac, czyWeekend],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sezonowosc" />
      <NaglowekEkranu tytul="Sezonowość i tryb wakacyjny">
        Nie każde urządzenie pracuje cały rok — dobry bilans uwzględnia, że klimatyzacja zimą stoi
        wyłączona, a odśnieżarka latem w ogóle nie istnieje. Moduł 2, Ekran 6.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie urządzenia (w okresie aktywności)"
          unit="kWh/dobę"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieKwhDoba}
          onChange={(e) => setZapotrzebowanieKwhDoba(e.target.value)}
        />
        <PoleSelect label="Typ sezonowości" value={typ} onChange={(e) => setTyp(e.target.value as TypSezonowosci)}>
          {(Object.keys(ETYKIETY_TYPU) as TypSezonowosci[]).map((t) => (
            <option key={t} value={t}>
              {ETYKIETY_TYPU[t]}
            </option>
          ))}
        </PoleSelect>

        {typ === "sezonowy" && (
          <>
            <Pole
              label="Miesiąc początku sezonu"
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={miesiacOd}
              onChange={(e) => setMiesiacOd(e.target.value)}
              hint="Np. klimatyzacja: czerwiec = 6."
            />
            <Pole
              label="Miesiąc końca sezonu"
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={miesiacDo}
              onChange={(e) => setMiesiacDo(e.target.value)}
              hint="Np. klimatyzacja: wrzesień = 9."
            />
            <Pole
              label="Sprawdzany miesiąc"
              unit="1-12"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={aktualnyMiesiac}
              onChange={(e) => setAktualnyMiesiac(e.target.value)}
            />
          </>
        )}

        {typ === "weekendowy" && (
          <PoleCheckbox
            id="czy-weekend"
            label="Sprawdzany dzień to weekend"
            checked={czyWeekend}
            onChange={(e) => setCzyWeekend(e.target.checked)}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Sprawdź wpisane dane — miesiąc musi być z przedziału 1–12.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={result.value.aktywne ? "Aktywne w tym okresie" : "Nieaktywne w tym okresie"}>
          <WynikGlowny>{result.value.zapotrzebowanieWliczoneKwhDoba.toFixed(2)} kWh/dobę</WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
        </WerdyktPanel>
      )}
    </main>
  )
}
