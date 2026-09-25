"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StanPusty } from "@/components/ui/stany"
import type { ZapisTmy } from "@/lib/lokalizacja/dane-tmy"
import type { LokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useOnline } from "@/lib/lokalizacja/use-online"

const f3 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 3 })

/**
 * Sekcja "Dane nasłonecznienia" — lokalizacja projektu i pobranie PVGIS TMY (raz online, potem
 * offline). Wydzielona z Ekranu 4 M1; ta sama treść na każdym ekranie, który jej potrzebuje.
 */
export function SekcjaDanychNaslonecznienia({
  lokalizacja,
  dane,
  tmy,
}: {
  lokalizacja: LokalizacjaProjektu | null
  dane: ZapisTmy | null
  tmy: { pobiera: boolean; blad: string | null; pobierz: (szerokosc: number, dlugosc: number) => Promise<void> }
}) {
  const online = useOnline()
  return (
    <section className="flex flex-col gap-2 rounded-lg border p-4">
      <h2 className="font-semibold">Dane nasłonecznienia</h2>
      {!lokalizacja ? (
        <StanPusty tytul="Brak lokalizacji — zbierz model działki (Ekran 2) albo wpisz współrzędne na Ekranie 1.">
          <div className="flex gap-3">
            <Link href="/kalkulatory/skaner-dzialki" className="underline">
              → Ekran 2
            </Link>
            <Link href="/kalkulatory/lokalizacja-i-klimat" className="underline">
              → Ekran 1
            </Link>
          </div>
        </StanPusty>
      ) : (
        <>
          <p className="text-small">
            Lokalizacja: {f3(lokalizacja.szerokosc)}°, {f3(lokalizacja.dlugosc)}° — z: {lokalizacja.zrodlo}
          </p>
          {dane ? (
            <p className="text-small text-muted-foreground">
              Typowy rok meteorologiczny PVGIS ({dane.dane.meta.bazaPromieniowania}, lata {dane.dane.meta.rokOd}–{dane.dane.meta.rokDo}),
              zapisany na urządzeniu {new Date(dane.pobrano).toLocaleDateString("pl-PL")} — działa offline.
            </p>
          ) : (
            <p className="text-small text-muted-foreground">
              Potrzebne godzinowe dane nasłonecznienia z PVGIS (Komisja Europejska) — pobierane raz, potem zapisane na
              urządzeniu.
            </p>
          )}
          <Button
            variant={dane ? "outline" : "default"}
            className="min-h-11"
            disabled={tmy.pobiera || !online}
            onClick={() => tmy.pobierz(lokalizacja.szerokosc, lokalizacja.dlugosc)}
          >
            {tmy.pobiera ? "Pobieram z PVGIS…" : dane ? "Pobierz ponownie" : "Pobierz dane nasłonecznienia (PVGIS)"}
          </Button>
          {!online && !dane && <p className="text-small">Brak połączenia — pobierz dane, gdy będziesz online.</p>}
          {tmy.blad && <p className="text-small text-werdykt-blad-foreground">{tmy.blad}</p>}
        </>
      )}
    </section>
  )
}
