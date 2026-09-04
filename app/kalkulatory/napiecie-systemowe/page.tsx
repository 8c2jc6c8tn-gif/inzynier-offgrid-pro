"use client"

import { useMemo, useState } from "react"
import { calculateNapiecieSystemowe } from "@/lib/core/modules/baterie/napiecie-systemowe/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function NapiecieSystemowePage() {
  const [mocSzczytowaW, setMocSzczytowaW] = useState("")

  const result = useMemo(
    () => calculateNapiecieSystemowe({ mocSzczytowaW: mocSzczytowaW === "" ? 0 : Number(mocSzczytowaW) }),
    [mocSzczytowaW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/napiecie-systemowe" />
      <NaglowekEkranu tytul="Sugestia napięcia systemowego">
        Wyższe napięcie systemowe = mniejszy prąd przy tej samej mocy = cieńsze, tańsze kable. To
        nie kwestia mody, tylko fizyki (P = V × I). Moduł 4, Ekran 2.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Obciążenie szczytowe"
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocSzczytowaW}
          onChange={(e) => setMocSzczytowaW(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz obciążenie szczytowe, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Rekomendowane napięcie systemowe">
          <WynikGlowny>{result.value.napiecieRekomendowaneV} V</WynikGlowny>
          <p className="mt-3 text-small">
            Prąd przy tym obciążeniu: {result.value.pradPrzy12VA.toFixed(0)} A @12V ·{" "}
            {result.value.pradPrzy24VA.toFixed(0)} A @24V · {result.value.pradPrzy48VA.toFixed(0)} A @48V.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
