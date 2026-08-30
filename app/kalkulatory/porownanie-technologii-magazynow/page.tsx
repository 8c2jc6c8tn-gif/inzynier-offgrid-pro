"use client"

import { useMemo, useState } from "react"
import { calculatePorownanieTechnologii } from "@/lib/core/modules/baterie/porownanie-technologii/calculator"
import { CENA_STARTOWA_LABELS } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import { WerdyktPanel } from "@/components/werdykt"
import { cn } from "@/lib/utils"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"

const inputClass =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function PorownanieTechnologiiMagazynowPage() {
  const [pojemnoscKwh, setPojemnoscKwh] = useState("")

  const result = useMemo(
    () =>
      calculatePorownanieTechnologii({
        pojemnoscKwh: pojemnoscKwh === "" ? undefined : Number(pojemnoscKwh),
      }),
    [pojemnoscKwh],
  )

  const isInvalid = result.status === "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/porownanie-technologii-magazynow" />
      <div>
        <h1 className="text-xl font-semibold">Porównanie technologii magazynów</h1>
        <p className="text-sm text-muted-foreground">
          Cena zakupu to nie to samo co koszt w całym cyklu życia — trzeba doliczyć wagę
          (konstrukcja podłogi), obsługę i realną liczbę cykli. Moduł 4, Ekran 30.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">
          Planowana pojemność magazynu (opcjonalnie){" "}
          <span className="text-muted-foreground">[kWh]</span>
        </span>
        <input
          type="number"
          inputMode="decimal"
          className={cn(inputClass, "max-w-xs")}
          placeholder="np. 45 — bez wpisania: porównanie na 1 kWh"
          value={pojemnoscKwh}
          onChange={(e) => setPojemnoscKwh(e.target.value)}
        />
      </label>

      {isInvalid ? (
        <WerdyktPanel poziom="blad" etykieta={result.warnings[0]?.message} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Technologia</th>
                <th className="p-3 font-medium">Cena startowa</th>
                <th className="p-3 font-medium">Cykle (przy DoD)</th>
                <th className="p-3 font-medium">Sprawność</th>
                <th className="p-3 font-medium">Waga/kWh</th>
                <th className="p-3 font-medium">Obsługa</th>
                <th className="p-3 font-medium">Energia w cyklu życia</th>
              </tr>
            </thead>
            <tbody>
              {result.value.map((tech) => (
                <tr key={tech.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{tech.label}</td>
                  <td className="p-3">{CENA_STARTOWA_LABELS[tech.cenaStartowa]}</td>
                  <td className="p-3">{tech.cyklePrzyDodOpis}</td>
                  <td className="p-3">{tech.sprawnoscPct === null ? "—" : `${tech.sprawnoscPct}%`}</td>
                  <td className="p-3">{tech.wagaKgPerKwhOpis}</td>
                  <td className="p-3">{tech.obsluga}</td>
                  <td className="p-3 font-mono">{tech.energiaCalkowitaKwh.toLocaleString("pl-PL")} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.assumptions.length > 0 && (
        <ul className="text-sm text-muted-foreground">
          {result.assumptions.map((a) => (
            <li key={a}>Założenie: {a}</li>
          ))}
        </ul>
      )}

      <p className="font-mono text-xs text-muted-foreground">{result.formula}</p>
    </main>
  )
}
