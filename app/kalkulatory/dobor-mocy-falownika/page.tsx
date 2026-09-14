"use client"

import { useMemo, useState } from "react"
import { calculateDoborMocyFalownika } from "@/lib/core/modules/okablowanie/dobor-mocy-falownika/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function DoborMocyFalownikaPage() {
  const [mocSzczytowaW, setMocSzczytowaW] = useState("")
  const [mocPozornaVa, setMocPozornaVa] = useState("")
  const [wspolczynnikJednoczesnosci, setWspolczynnikJednoczesnosci] = useState("0.7")
  const [mocFalownikaWybranaW, setMocFalownikaWybranaW] = useState("")

  const result = useMemo(
    () =>
      calculateDoborMocyFalownika({
        mocSzczytowaW: mocSzczytowaW === "" ? 0 : Number(mocSzczytowaW),
        mocPozornaVa: mocPozornaVa === "" ? 0 : Number(mocPozornaVa),
        wspolczynnikJednoczesnosci: wspolczynnikJednoczesnosci === "" ? 0 : Number(wspolczynnikJednoczesnosci),
        mocFalownikaWybranaW: mocFalownikaWybranaW === "" ? 0 : Number(mocFalownikaWybranaW),
      }),
    [mocSzczytowaW, mocPozornaVa, wspolczynnikJednoczesnosci, mocFalownikaWybranaW],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wypełnij moc szczytową i współczynnik jednoczesności",
    red: "Falownik za słaby — ryzyko wyłączeń przy rozruchach",
    green: "Moc falownika dobrana poprawnie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-mocy-falownika" />
      <NaglowekEkranu tytul="Dobór mocy falownika">
        Falownik musi wytrzymać nie tylko normalną pracę, ale ten ułamek sekundy, gdy silnik
        lodówki czy pompy rusza z miejsca — wtedy pobiera nawet 5-7× więcej prądu niż normalnie.
        Moduł 5, Ekran 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Moc szczytowa odbiorników"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocSzczytowaW}
          onChange={(e) => setMocSzczytowaW(e.target.value)}
        />
        <Pole
          label="Moc pozorna odbiorników (opcjonalnie)"
          unit="VA"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocPozornaVa}
          onChange={(e) => setMocPozornaVa(e.target.value)}
        />
        <Pole
          label="Współczynnik jednoczesności"
          unit=""
          type="number"
          inputMode="decimal"
          min={0}
          step={0.05}
          value={wspolczynnikJednoczesnosci}
          onChange={(e) => setWspolczynnikJednoczesnosci(e.target.value)}
        />
        <Pole
          label="Moc rozważanego falownika (opcjonalnie, do sprawdzenia)"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocFalownikaWybranaW}
          onChange={(e) => setMocFalownikaWybranaW(e.target.value)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>Zalecana moc falownika: {Math.round(result.value.mocFalownikaZalecanaW)} W</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
