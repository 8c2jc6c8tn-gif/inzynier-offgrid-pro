"use client"

import { useMemo, useState } from "react"
import { calculateKociolElektryczny } from "@/lib/core/modules/ogrzewanie/kociol-elektryczny/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function KociolElektrycznyPage() {
  const [zapotrzebowanieCieplneKwh, setZapotrzebowanieCieplneKwh] = useState("")
  const [copPompy, setCopPompy] = useState("")
  const [cenaZaKwhZl, setCenaZaKwhZl] = useState("")

  const result = useMemo(
    () =>
      calculateKociolElektryczny({
        zapotrzebowanieCieplneKwh: zapotrzebowanieCieplneKwh === "" ? 0 : Number(zapotrzebowanieCieplneKwh),
        copPompy: copPompy === "" ? 0 : Number(copPompy),
        cenaZaKwhZl: cenaZaKwhZl === "" ? 0 : Number(cenaZaKwhZl),
      }),
    [zapotrzebowanieCieplneKwh, copPompy, cenaZaKwhZl],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kociol-elektryczny" />
      <NaglowekEkranu tytul="Kocioł elektryczny vs pompa ciepła">
        Kocioł elektryczny ma sprawność blisko 100%, ale to nie to samo co tanie ogrzewanie —
        pompa ciepła nie produkuje ciepła z prądu, tylko przenosi je z zewnątrz, więc zużywa
        kilka razy mniej. Moduł 6, ekran dodatkowy (dawne 5.33).
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie na ciepło do pokrycia"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieCieplneKwh}
          onChange={(e) => setZapotrzebowanieCieplneKwh(e.target.value)}
        />
        <Pole
          label="COP pompy ciepła"
          unit="-"
          type="number"
          inputMode="decimal"
          min={0}
          hint="Typowe pompy powietrze-woda: 1,5-6, zależnie od temperatury."
          value={copPompy}
          onChange={(e) => setCopPompy(e.target.value)}
        />
        <Pole
          label="Cena energii elektrycznej"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={cenaZaKwhZl}
          onChange={(e) => setCenaZaKwhZl(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Oszczędność z pompy ciepła">
          <WynikGlowny>{result.value.oszczednoscZl.toFixed(2)} zł</WynikGlowny>
          <p className="mt-2 text-small">
            Pompa: {result.value.energiaPompyKwh.toFixed(1)} kWh ({result.value.kosztPompyZl.toFixed(2)} zł) ·
            kocioł: {result.value.energiaKotlaKwh.toFixed(1)} kWh ({result.value.kosztKotlaZl.toFixed(2)} zł) ·
            kocioł zużywa {result.value.mnoznikZuzycia.toFixed(1)}× więcej prądu.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
