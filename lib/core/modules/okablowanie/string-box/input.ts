/**
 * Ekran 22, Moduł 5 "Okablowanie i zabezpieczenia" — "String Box / Array Box"
 * (dawne 4.28, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type StringBoxInput = {
  /** Liczba stringów PV do podłączenia. */
  liczbaStringow: number
  /** Liczba wejść DC skrzynki (deklarowana przez producenta/dobrana). */
  liczbaWejscSkrzynki: number
  /** Prąd znamionowy bezpiecznika stringowego wybranego do montażu [A] — zalecany zakres 15-20 A/string. */
  bezpiecznikStringowyA: number
  /** Czy skrzynka ma stopień ochrony IP66 (wymóg przy montażu na wolnym powietrzu). */
  maSkrzynkeIp66: boolean
}
