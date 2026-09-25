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
