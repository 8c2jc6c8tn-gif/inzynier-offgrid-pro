"use client"

/**
 * M7/E1 pipeline from the form state to the result — shared by the screen and by the crisis report (M7/E3), which
 * recomputes Screen 1 from its saved draft instead of storing a second copy of the numbers.
 */
import { useMemo } from "react"
import { calculateSymulacjaMrozu } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import { produkcjaDobowaMiesiaca } from "@/lib/core/modules/stress-test/symulacja-mrozu/produkcja-dobowa"
import { profilNaslonecznienia } from "@/lib/core/modules/pv/porownywarka-paneli/uzysk"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { useDaneMrozuZEkranu1 } from "@/lib/ogrzewanie/draft-obciazenia-cieplnego"
import { wejscieSymulacjiMrozu, type StanSymulacjiMrozu } from "./symulacja-mrozu"

export function useWynikSymulacjiMrozu(stan: StanSymulacjiMrozu) {
  const projekt = useLokalizacjaProjektu()
  const { lokalizacja, dane } = projekt
  const ekran1 = useDaneMrozuZEkranu1()

  const nachylenie = liczba(stan.nachylenieDeg)
  const azymut = liczba(stan.azymutDeg)
  const miejscePoprawne = nachylenie !== undefined && nachylenie >= 0 && nachylenie <= 90 && azymut !== undefined && azymut >= 0 && azymut <= 360
  // The heavy step (hourly in-plane irradiance of the TMY) depends only on the location and the plane — not on kWp, PR or the month.
  const naslonecznienie = useMemo(
    () => (lokalizacja && dane && miejscePoprawne ? profilNaslonecznienia(lokalizacja.szerokosc, lokalizacja.dlugosc, dane.dane.rekordy, { nachylenieDeg: nachylenie!, azymutDeg: azymut! }) : null),
    [lokalizacja, dane, miejscePoprawne, nachylenie, azymut],
  )
  const moc = liczba(stan.mocKwp)
  const pr = liczba(stan.pr)
  const miesiac = liczba(stan.miesiac)
  const produkcja = useMemo(
    () =>
      naslonecznienie && dane && moc !== undefined && pr !== undefined && miesiac !== undefined
        ? produkcjaDobowaMiesiaca(naslonecznienie, dane.dane.rekordy.map((r) => r.czasUtcMs), miesiac - 1, moc, pr)
        : [],
    [naslonecznienie, dane, moc, pr, miesiac],
  )
  const result = useMemo(() => calculateSymulacjaMrozu(wejscieSymulacjiMrozu(stan, produkcja, ekran1)), [stan, produkcja, ekran1])
  return { ...projekt, ekran1, produkcja, result }
}
