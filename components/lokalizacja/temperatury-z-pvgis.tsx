"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useOnline } from "@/lib/lokalizacja/use-online"

const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/**
 * Monthly mean outdoor temperatures from the saved PVGIS TMY of the project location (T2m, ERA5)
 * — fills the "months" fields of heat screens (M6/E1) instead of typing them. Values are inserted
 * into editable fields, never used silently: the user sees and can correct them.
 */
export function TemperaturyZPvgis({ onWstaw }: { onWstaw: (temperatury: number[]) => void }) {
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const online = useOnline()
  if (!wczytano) return null

  if (!lokalizacja) {
    return (
      <p className="text-small text-muted-foreground">
        Temperatury może wstawić aplikacja z danych PVGIS dla Twojej lokalizacji — najpierw wpisz współrzędne na{" "}
        <Link href="/kalkulatory/lokalizacja-i-klimat" className="underline">
          Ekranie 1 Lokalizacji
        </Link>{" "}
        albo zbierz{" "}
        <Link href="/kalkulatory/skaner-dzialki" className="underline">
          model działki
        </Link>
        .
      </p>
    )
  }

  const temperatury = dane?.dane.temperaturyMiesieczneC
  if (dane && temperatury) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border p-3">
        <p className="text-small">
          Średnie miesięczne temperatury powietrza z typowego roku meteorologicznego PVGIS (baza {dane.dane.meta.bazaMeteo},
          lata {dane.dane.meta.rokOd}–{dane.dane.meta.rokDo}) dla lokalizacji projektu: od {f1(Math.min(...temperatury))} do{" "}
          {f1(Math.max(...temperatury))} °C.
        </p>
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => onWstaw(temperatury)}>
          Wstaw temperatury z PVGIS
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <p className="text-small text-muted-foreground">
        {dane
          ? `Dane PVGIS zapisane ${new Date(dane.pobrano).toLocaleDateString("pl-PL")} nie zawierają temperatur (starsza wersja zapisu) — pobierz je ponownie.`
          : "Temperatury może wstawić aplikacja z danych PVGIS (Komisja Europejska) dla lokalizacji projektu — pobierane raz, potem zapisane na urządzeniu."}
      </p>
      <Button
        variant="outline"
        className="min-h-11 w-fit"
        disabled={tmy.pobiera || !online}
        onClick={() => tmy.pobierz(lokalizacja.szerokosc, lokalizacja.dlugosc)}
      >
        {tmy.pobiera ? "Pobieram z PVGIS…" : "Pobierz dane PVGIS"}
      </Button>
      {!online && <p className="text-small">Brak połączenia — pobierz dane, gdy będziesz online.</p>}
      {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
    </div>
  )
}
