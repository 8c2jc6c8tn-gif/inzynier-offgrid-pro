/**
 * Progi 1:1 ze źródła (Ekran 5, Sekcja B, punkt 2).
 */

/** Poniżej tej temperatury BMS włącza grzałki przed ładowaniem. */
export const PROG_TEMPERATURY_GRZANIA_C = 5

/** Poniżej tego SoC grzanie z baterii jest wstrzymywane (brak PV). Powyżej — grzanie z baterii dozwolone. */
export const PROG_SOC_WSTRZYMANIA_PCT = 30

export const PRZYKLADY_BILANSU_GRZANIA = [
  "Magazyn w garażu nieogrzewanym — zimą dolicz ok. 0,6 kWh/dobę na grzanie ogniw (przykład ze źródła).",
  "Typowy dodatkowy bilans w styczniu: ok. 0,5 kWh/dobę (przykład ze źródła).",
]
