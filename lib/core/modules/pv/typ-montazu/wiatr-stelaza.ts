import { balastProjektowyEquKg } from "../eurokod-0/rownowaga"
import {
  bazoweCisnienieWiatruPa,
  CF_TABLICA_PIONOWA,
  CF_WIATA_KROK_DEG,
  CF_WIATA_MAX_KAT_DEG,
  cfOdrywaniaWiaty,
  KAT_PIONOWY_DEG,
  silaWiatruN,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
  type KategoriaTerenu,
  type StrefaWiatrowa,
} from "../eurokod-1/wiatr"
import { CSCD_STELAZ, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../zloty-srodek/constants"

export type WiatrPelny = {
  strefaWiatrowa: StrefaWiatrowa
  wysokoscNpmM: number
  kategoriaTerenu: KategoriaTerenu
  wspolczynnikPhi: number
}

export type WiatrDlaKata = {
  /** Wysokość górnej krawędzi nad terenem ze = h (7.3 (8)) [m]. */
  zeM: number
  qpPa: number
  /** |cf| — odrywanie (0–30°) albo siła pozioma (90°); `null` = brak danych normowych. */
  cf: number | null
  silaWiatruN: number | null
  /** Design ballast m = γQ·Fw/(γG,inf·g), PN-EN 1990 EQU — tylko 0–30° (siła odrywająca); pion i 31–89° → `null`. */
  balastKg: number | null
}

/** Podniesienie górnej krawędzi nad dolną: h = L × sin(α) (źródło, Ekran 2, tryb "Dach płaski / grunt"). */
export function podniesienieKrawedziM(dlugoscWzdluzSpaduM: number, katDeg: number): number {
  return dlugoscWzdluzSpaduM * Math.sin((katDeg * Math.PI) / 180)
}

/** Kąt leży między wierszami Tablicy 7.6 (co 5°) — wtedy bierzemy bardziej niekorzystny węzeł. */
export function katPosredniTablicy(katDeg: number): boolean {
  return katDeg <= CF_WIATA_MAX_KAT_DEG && katDeg % CF_WIATA_KROK_DEG !== 0
}

/**
 * Siła wiatru i balast dla stelaża = wiaty jednospadowej (D26) — ten sam tor co M3/E9:
 * Fw = cscd·cf·ce(ze)·qb·Aref, m = γQ·Fw/(γG,inf·g) (PN-EN 1990, EQU).
 */
export function wiatrDlaKata(w: WiatrPelny, katDeg: number, zeM: number, powierzchniaM2: number): WiatrDlaKata {
  const qpPa = szczytoweCisnieniePa(bazoweCisnienieWiatruPa(w.strefaWiatrowa, w.wysokoscNpmM), wspolczynnikEkspozycji(w.kategoriaTerenu, zeM))
  const cf = katDeg === KAT_PIONOWY_DEG ? CF_TABLICA_PIONOWA : cfOdrywaniaWiaty(katDeg, w.wspolczynnikPhi)
  const sila = cf === null ? null : silaWiatruN(CSCD_STELAZ, cf, qpPa, powierzchniaM2)
  const balastKg = sila !== null && katDeg <= CF_WIATA_MAX_KAT_DEG ? balastProjektowyEquKg(sila, PRZYSPIESZENIE_ZIEMSKIE_M_S2) : null
  return { zeM, qpPa, cf, silaWiatruN: sila, balastKg }
}
