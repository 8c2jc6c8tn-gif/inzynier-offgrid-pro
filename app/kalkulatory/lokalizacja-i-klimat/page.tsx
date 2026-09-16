"use client"

import { useMemo, useState } from "react"
import { calculateLokalizacja } from "@/lib/core/modules/lokalizacja/lokalizacja-i-klimat/calculator"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole } from "@/components/ui/pole"
import { StanPusty } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function LokalizacjaIKlimatPage() {
  const t = useTranslate()
  const [adres, setAdres] = useState("")
  const [szerokosc, setSzerokosc] = useState("")
  const [dlugosc, setDlugosc] = useState("")
  const [temperaturaMin, setTemperaturaMin] = useState("")

  const result = useMemo(
    () =>
      calculateLokalizacja({
        adres: adres || undefined,
        szerokoscGeograficzna: szerokosc === "" ? undefined : Number(szerokosc),
        dlugoscGeograficzna: dlugosc === "" ? undefined : Number(dlugosc),
        temperaturaMinimalnaC: temperaturaMin === "" ? undefined : Number(temperaturaMin),
      }),
    [adres, szerokosc, dlugosc, temperaturaMin],
  )

  const dodatki = (
    <>
      {result.assumptions.length > 0 && (
        <ul className="mt-2 text-small opacity-90">
          {result.assumptions.map((a, i) => (
            <li key={typeof a === "string" ? a : a.kod + i}>Założenie: {typeof a === "string" ? a : t(a.kod, a.params)}</li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-small">
          {result.warnings.map((w) => (
            <li key={w.code}>{w.message}</li>
          ))}
        </ul>
      )}
    </>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/lokalizacja-i-klimat" />
      <NaglowekEkranu tytul="Lokalizacja i dane klimatyczne">
        Dane stąd zasilają niemal wszystkie pozostałe moduły — kąt padania słońca, strefę
        wiatrową i śniegową, minima temperaturowe do stress-testów zimowych. Moduł 1, Ekran 1.
        Tryb offline: wpisz dane ręcznie.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Adres / działka (opcjonalnie)" value={adres} onChange={(e) => setAdres(e.target.value)} />
        <Pole
          label="Szerokość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          value={szerokosc}
          onChange={(e) => setSzerokosc(e.target.value)}
          placeholder="np. 52.23"
        />
        <Pole
          label="Długość geograficzna"
          unit="°"
          type="number"
          inputMode="decimal"
          value={dlugosc}
          onChange={(e) => setDlugosc(e.target.value)}
          placeholder="np. 21.01"
        />
        <Pole
          label="Temperatura minimalna w lokalizacji"
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMin}
          onChange={(e) => setTemperaturaMin(e.target.value)}
          placeholder="np. -22"
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <StanPusty tytul="Uzupełnij współrzędne i temperaturę minimalną.">{dodatki}</StanPusty>
      ) : (
        <WerdyktPanel
          poziom={result.status === "INVALID_INPUT" ? "blad" : "ok"}
          etykieta={
            result.status === "INVALID_INPUT"
              ? "Sprawdź dane — jedna z wartości jest poza możliwym zakresem"
              : "Profil lokalizacji zapisany"
          }
        >
          {dodatki}
        </WerdyktPanel>
      )}
    </main>
  )
}
