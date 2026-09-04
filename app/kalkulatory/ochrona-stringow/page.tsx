"use client"

import { useMemo, useState } from "react"
import { calculateOchronaStringow } from "@/lib/core/modules/pv/ochrona-stringow/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function OchronaStringowPage() {
  const [iscA, setIscA] = useState("")
  const [liczbaStringowRownoleglych, setLiczbaStringowRownoleglych] = useState("")
  const [maZabezpieczeniaPerString, setMaZabezpieczeniaPerString] = useState(false)

  const result = useMemo(
    () =>
      calculateOchronaStringow({
        iscA: iscA === "" ? 0 : Number(iscA),
        liczbaStringowRownoleglych: liczbaStringowRownoleglych === "" ? 0 : Number(liczbaStringowRownoleglych),
        maZabezpieczeniaPerString,
      }),
    [iscA, liczbaStringowRownoleglych, maZabezpieczeniaPerString],
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
    incomplete: "Wypełnij wszystkie pola",
    red: "Zabronione — brak wymaganych zabezpieczeń",
    green: "Dobrany bezpiecznik per string",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-stringow" />
      <NaglowekEkranu tytul="Ochrona stringów">
        Chroń każdy string osobno, żeby awaria jednego nie pociągnęła za sobą reszty instalacji.
        Moduł 3, Ekran 22.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Prąd zwarciowy panelu (Isc)"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={iscA}
          onChange={(e) => setIscA(e.target.value)}
        />
        <Pole
          label="Liczba stringów równoległych"
          unit="szt."
          type="number"
          inputMode="numeric"
          min={0}
          value={liczbaStringowRownoleglych}
          onChange={(e) => setLiczbaStringowRownoleglych(e.target.value)}
        />
        <PoleCheckbox
          id="ma-zabezpieczenia"
          label="Zainstalowane są bezpieczniki/diody blokujące per string"
          checked={maZabezpieczeniaPerString}
          onChange={(e) => setMaZabezpieczeniaPerString(e.target.checked)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>{result.value.bezpiecznikA.toFixed(1)} A</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
