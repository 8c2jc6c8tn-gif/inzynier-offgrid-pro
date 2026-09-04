"use client"

import { useMemo, useState } from "react"
import { calculateNaporWiatru } from "@/lib/core/modules/pv/napor-wiatru/calculator"
import { CD_TYPOWY_MAX, CD_TYPOWY_MIN } from "@/lib/core/modules/pv/napor-wiatru/constants"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function NaporWiatruPage() {
  const [predkoscWiatruMS, setPredkoscWiatruMS] = useState("")
  const [powierzchniaM2, setPowierzchniaM2] = useState("")
  const [cd, setCd] = useState("")

  const result = useMemo(
    () =>
      calculateNaporWiatru({
        predkoscWiatruMS: predkoscWiatruMS === "" ? 0 : Number(predkoscWiatruMS),
        powierzchniaM2: powierzchniaM2 === "" ? 0 : Number(powierzchniaM2),
        cd: cd === "" ? 0 : Number(cd),
      }),
    [predkoscWiatruMS, powierzchniaM2, cd],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napor-wiatru" />
      <NaglowekEkranu tytul="Aerodynamika — napór wiatru">
        Panel działa trochę jak żagiel — wiatr może go pchać, ale też może pod niego „zajrzeć” i
        ciągnąć do góry jak skrzydło samolotu. Moduł 3, Ekran 6.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Prędkość wiatru"
          unit="m/s"
          type="number"
          inputMode="decimal"
          min={0}
          value={predkoscWiatruMS}
          onChange={(e) => setPredkoscWiatruMS(e.target.value)}
        />
        <Pole
          label="Powierzchnia panelu"
          unit="m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={powierzchniaM2}
          onChange={(e) => setPowierzchniaM2(e.target.value)}
        />
        <Pole
          label="Współczynnik oporu Cd"
          unit="—"
          type="number"
          inputMode="decimal"
          min={0}
          value={cd}
          onChange={(e) => setCd(e.target.value)}
          hint={`Typowo ${CD_TYPOWY_MIN}–${CD_TYPOWY_MAX} dla paneli PV.`}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Siła naporu wiatru na panel">
          <WynikGlowny>{result.value.silaNaporuN.toFixed(0)} N</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
