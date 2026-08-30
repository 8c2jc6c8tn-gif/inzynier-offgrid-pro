"use client"

import { useMemo, useState } from "react"
import { calculateLokalizacja } from "@/lib/core/modules/lokalizacja/lokalizacja-i-klimat/calculator"
import { WerdyktPanel } from "@/components/werdykt"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function LokalizacjaIKlimatPage() {
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
        <ul className="mt-2 text-sm opacity-90">
          {result.assumptions.map((a) => (
            <li key={a}>Założenie: {a}</li>
          ))}
        </ul>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {result.warnings.map((w) => (
            <li key={w.code}>{w.message}</li>
          ))}
        </ul>
      )}
    </>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Lokalizacja i dane klimatyczne</h1>
        <p className="text-sm text-muted-foreground">
          Dane stąd zasilają niemal wszystkie pozostałe moduły — kąt padania słońca, strefę
          wiatrową i śniegową, minima temperaturowe do stress-testów zimowych. Moduł 1, Ekran 1.
          Tryb offline: wpisz dane ręcznie.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Adres / działka (opcjonalnie)</span>
          <input className={inputClass} value={adres} onChange={(e) => setAdres(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Szerokość geograficzna <span className="text-muted-foreground">[°]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={szerokosc}
            onChange={(e) => setSzerokosc(e.target.value)}
            placeholder="np. 52.23"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Długość geograficzna <span className="text-muted-foreground">[°]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={dlugosc}
            onChange={(e) => setDlugosc(e.target.value)}
            placeholder="np. 21.01"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Temperatura minimalna w lokalizacji <span className="text-muted-foreground">[°C]</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={temperaturaMin}
            onChange={(e) => setTemperaturaMin(e.target.value)}
            placeholder="np. -22"
          />
        </label>
      </div>

      {result.status === "INCOMPLETE" ? (
        <div className={cn("rounded-lg border-2 p-4", "border-muted-foreground/40 bg-muted text-muted-foreground")}>
          <p className="font-medium">Uzupełnij współrzędne i temperaturę minimalną.</p>
          {dodatki}
        </div>
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
