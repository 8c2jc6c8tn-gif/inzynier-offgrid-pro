/**
 * PN-EN 1991-1-3 (Eurokod 1, obciążenie śniegiem), Tablica 5.2 — współczynnik kształtu dachu μ1
 * dla dachu jednopołaciowego (`docs/zrodla/norma-PN-EN-1991-1-3/04-obciazenie-sniegiem-dachow-rozdzial-5.md`).
 * Obowiązuje, gdy nic nie blokuje zsuwania się śniegu (dolna krawędź bez przeszkody).
 */
export const MU1_PLASKI = 0.8
export const MU1_KAT_POCZATKU_SPADKU_DEG = 30
export const MU1_KAT_ZEROWY_DEG = 60

export function wspolczynnikKsztaltuMu1(katDeg: number): number {
  if (katDeg <= MU1_KAT_POCZATKU_SPADKU_DEG) return MU1_PLASKI
  if (katDeg < MU1_KAT_ZEROWY_DEG) {
    return (MU1_PLASKI * (MU1_KAT_ZEROWY_DEG - katDeg)) / (MU1_KAT_ZEROWY_DEG - MU1_KAT_POCZATKU_SPADKU_DEG)
  }
  return 0
}

/**
 * Tablica 5.2, uwaga pod tablicą: barierki przeciwśnieżne, inne przeszkody albo attyka na dolnej
 * krawędzi — współczynnik kształtu dachu nie mniejszy niż 0,8.
 */
export const MU_MIN_Z_BARIERKAMI = 0.8

export type StrefaSniegowa = 1 | 2 | 3 | 4 | 5

/**
 * Załącznik krajowy NB, Tablica NB.1 — wartość charakterystyczna obciążenia śniegiem gruntu s_k
 * [kN/m²] w Polsce, A = wysokość nad poziomem morza [m]
 * (`docs/zrodla/norma-PN-EN-1991-1-3/01-zalacznik-krajowy-NA-NB.md`).
 */
export function obciazenieSniegiemGruntuSk(strefa: StrefaSniegowa, wysokoscNpmM: number): number {
  switch (strefa) {
    case 1:
      return Math.max(0.007 * wysokoscNpmM - 1.4, 0.7)
    case 2:
      return 0.9
    case 3:
      return Math.max(0.006 * wysokoscNpmM - 0.6, 1.2)
    case 4:
      return 1.6
    case 5:
      return Math.max(0.93 * Math.exp(0.00134 * wysokoscNpmM), 2.0)
  }
}

export type EkspozycjaTerenu = "wystawiony" | "normalny" | "osloniety"

/** Tablica 5.1 — zalecane wartości współczynnika ekspozycji C_e. */
export const WSPOLCZYNNIK_EKSPOZYCJI_CE: Record<EkspozycjaTerenu, number> = {
  wystawiony: 0.8,
  normalny: 1.0,
  osloniety: 1.2,
}

/** 5.2(8) — współczynnik termiczny C_t dla dachów o U ≤ 1 W/(m²K) i „wszystkich innych przypadków”. */
export const WSPOLCZYNNIK_TERMICZNY_CT = 1.0

/** NB1.12 — nawisy śnieżne na krawędzi dachu zalecane powyżej tej wysokości n.p.m. [m] i w całej strefie 4. */
export const NAWISY_WYSOKOSC_PROG_M = 300
export const NAWISY_STREFA: StrefaSniegowa = 4

export type RodzajSniegu = "swiezy" | "osiadly" | "stary" | "mokry"

/** Załącznik E, Tablica E.1 — średni ciężar objętościowy śniegu [kN/m³] (min–max; jedna wartość → min = max). */
export const CIEZAR_OBJETOSCIOWY_SNIEGU: Record<RodzajSniegu, { min: number; max: number }> = {
  swiezy: { min: 1.0, max: 1.0 },
  osiadly: { min: 2.0, max: 2.0 },
  stary: { min: 2.5, max: 3.5 },
  mokry: { min: 4.0, max: 4.0 },
}
