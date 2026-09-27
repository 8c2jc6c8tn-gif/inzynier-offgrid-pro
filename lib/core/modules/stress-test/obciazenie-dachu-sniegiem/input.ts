/**
 * Moduł 7 "Stress-test zimowy" — Ekran 23 "Obciążenie dachu lodem i śniegiem" (dawne 6.34→7.32,
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Obciążenie normowe wg PN-EN 1991-1-3
 * z Załącznikiem krajowym NB; strefę i wysokość n.p.m. wpisuje user (Moduł 1 nie wyznacza strefy).
 */
import type { EkspozycjaTerenu, RodzajSniegu, StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"

export type ObciazenieDachuSniegiemInput = {
  /** Strefa obciążenia śniegiem gruntu z mapy NB.1. null = jeszcze nie wybrano. */
  strefa: StrefaSniegowa | null
  /** Wysokość nad poziomem morza [m]. null = jeszcze nie wpisano (0 i wartości ujemne — Żuławy — są legalne). */
  wysokoscNpmM: number | null
  /** Kąt spadku dachu [°]. null = jeszcze nie wpisano (0° = dach płaski, legalne). */
  katDachuDeg: number | null
  ekspozycja: EkspozycjaTerenu
  /** Barierki przeciwśnieżne, inne przeszkody albo attyka na dolnej krawędzi dachu. */
  barierkiLubAttyka: boolean
  /** Dopuszczalne obciążenie śniegiem z projektu konstrukcji — wartość charakterystyczna [kN/m²]. 0 = nie podano. */
  nosnoscDachuKnM2: number
  /** Zmierzona grubość warstwy śniegu/lodu na dachu [cm]. 0 = nie mierzono. */
  gruboscWarstwyCm: number
  /** Rodzaj zalegającego śniegu (Tablica E.1). null = nie wybrano. */
  rodzajSniegu: RodzajSniegu | null
}
