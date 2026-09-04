"use client"

import { useMemo, useState } from "react"
import { calculatePrzetworniceDcdc } from "@/lib/core/modules/zapotrzebowanie/przetwornice-dcdc/calculator"
import { SPRAWNOSC_TYPOWA_MAX_PCT, SPRAWNOSC_TYPOWA_MIN_PCT } from "@/lib/core/modules/zapotrzebowanie/przetwornice-dcdc/constants"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function PrzetworniceDcdcPage() {
  const [zapotrzebowanieUrzadzeniaW, setZapotrzebowanieUrzadzeniaW] = useState("")
  const [zasilanieBezposrednie, setZasilanieBezposrednie] = useState(false)
  const [sprawnoscPrzetwornicyPct, setSprawnoscPrzetwornicyPct] = useState("")

  const result = useMemo(
    () =>
      calculatePrzetworniceDcdc({
        zapotrzebowanieUrzadzeniaW: zapotrzebowanieUrzadzeniaW === "" ? 0 : Number(zapotrzebowanieUrzadzeniaW),
        zasilanieBezposrednie,
        sprawnoscPrzetwornicyPct: sprawnoscPrzetwornicyPct === "" ? 0 : Number(sprawnoscPrzetwornicyPct),
      }),
    [zapotrzebowanieUrzadzeniaW, zasilanieBezposrednie, sprawnoscPrzetwornicyPct],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przetwornice-dcdc" />
      <NaglowekEkranu tytul="Przetwornice DC/DC">
        Każda zmiana napięcia kosztuje trochę energii — czasem warto zasilić urządzenie
        bezpośrednio z magistrali w jego natywnym napięciu, zamiast przepuszczać prąd przez
        dodatkową przetwornicę. Moduł 2, Ekran 11.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie mocy urządzenia"
          unit="W"
          type="number"
          inputMode="decimal"
          value={zapotrzebowanieUrzadzeniaW}
          onChange={(e) => setZapotrzebowanieUrzadzeniaW(e.target.value)}
        />
        <PoleCheckbox
          id="zasilanie-bezposrednie"
          checked={zasilanieBezposrednie}
          onChange={(e) => setZasilanieBezposrednie(e.target.checked)}
          label="Zasilanie bezpośrednio z magistrali (bez przetwornicy)"
        />
        {!zasilanieBezposrednie && (
          <Pole
            label="Sprawność przetwornicy DC/DC"
            unit="%"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={sprawnoscPrzetwornicyPct}
            onChange={(e) => setSprawnoscPrzetwornicyPct(e.target.value)}
            hint={`Typowo ${SPRAWNOSC_TYPOWA_MIN_PCT}-${SPRAWNOSC_TYPOWA_MAX_PCT}%.`}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane, żeby zobaczyć realne zapotrzebowanie mocy.
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Realne zapotrzebowanie mocy">
          <WynikGlowny>
            {result.value.zapotrzebowanieRealneW.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} W
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
