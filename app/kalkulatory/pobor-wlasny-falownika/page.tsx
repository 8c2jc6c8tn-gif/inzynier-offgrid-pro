"use client"

import { useMemo, useState } from "react"
import { calculatePoborWlasnyFalownika } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/calculator"
import { DOMYSLNY_POBOR_JALOWY_W } from "@/lib/core/modules/zapotrzebowanie/pobor-wlasny-falownika/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function PoborWlasnyFalownikaPage() {
  const [poborJalowyW, setPoborJalowyW] = useState("")

  const result = useMemo(
    () => calculatePoborWlasnyFalownika({ poborJalowyW: poborJalowyW === "" ? 0 : Number(poborJalowyW) }),
    [poborJalowyW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pobor-wlasny-falownika" />
      <NaglowekEkranu tytul="Pobór własny falownika">
        Falownik sam w sobie coś zużywa, tylko żeby być gotowym do pracy — to niewidoczny, ale
        realny koszt stały, o którym łatwo zapomnieć przy liczeniu bilansu. Moduł 2, Ekran 9.
      </NaglowekEkranu>

      <Pole
        label="Pobór w stanie jałowym"
        unit="W"
        type="number"
        inputMode="decimal"
        value={poborJalowyW}
        onChange={(e) => setPoborJalowyW(e.target.value)}
        hint={`Typowo 20-100W. Domyślnie ${DOMYSLNY_POBOR_JALOWY_W}W, jeśli model nieznany.`}
      />

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz pobór jałowy, żeby zobaczyć stały koszt bilansu.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">Pobór nie może być ujemny.</p>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta="Stały koszt bilansu dobowego">
          <WynikGlowny>
            {result.value.strataDobowaKwh.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} kWh/dobę
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
