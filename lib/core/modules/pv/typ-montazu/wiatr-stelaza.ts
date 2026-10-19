import {
  bazoweCisnienieWiatruPa,
  CF_WIATA_KROK_DEG,
  CF_WIATA_MAX_KAT_DEG,
  szczytoweCisnieniePa,
  wspolczynnikEkspozycji,
  type KategoriaTerenu,
  type StrefaWiatrowa,
} from "../eurokod-1/wiatr"
import { silaIBalastWiatru } from "../wiatr-powyzej-30/sila-i-balast"

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
  /** |cf| — odrywanie (0–89°) albo siła pozioma (90°); `null` = brak współczynnika. */
  cf: number | null
  silaWiatruN: number | null
  /**
   * Design ballast m = max(0, γQ·Fw/(γG,inf·g) − G), PN-EN 1990 EQU — siła odrywająca: 0–30° wg normy, powyżej 30° do 89° jako
   * SZACUNEK aplikacji (`szacunek`); pion (90°) → `null` (siła pozioma). G = masa paneli i stelaża (D29), gdy podana; inaczej 0.
   */
  balastKg: number | null
  /** `true` = współczynnik siły i balast to szacunek aplikacji (powyżej 30° do 90° wyłącznie), nie wynik normy. */
  szacunek: boolean
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
 * Fw = cscd·cf·ce(ze)·qb·Aref, m = max(0, γQ·Fw/(γG,inf·g) − G) (PN-EN 1990, EQU; G — D29).
 */
export function wiatrDlaKata(w: WiatrPelny, katDeg: number, zeM: number, powierzchniaM2: number, masaWlasnaKg = 0): WiatrDlaKata {
  const qpPa = szczytoweCisnieniePa(bazoweCisnienieWiatruPa(w.strefaWiatrowa, w.wysokoscNpmM), wspolczynnikEkspozycji(w.kategoriaTerenu, zeM))
  const s = silaIBalastWiatru(katDeg, w.wspolczynnikPhi, qpPa, powierzchniaM2, masaWlasnaKg)
  return { zeM, qpPa, cf: s?.cf ?? null, silaWiatruN: s?.silaN ?? null, balastKg: s?.balastKg ?? null, szacunek: s?.szacunek ?? false }
}
