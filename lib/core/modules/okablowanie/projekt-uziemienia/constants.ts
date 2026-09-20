import type { CelUziemienia } from "./input"

/** Docelowa maksymalna rezystancja uziomu wg celu — wartości 1:1 ze źródła (Sekcja B). */
export const DOCELOWA_REZYSTANCJA_OM: Record<CelUziemienia, number> = {
  odgromowa: 10,
  "przeciwporazeniowa": 30,
  "czula-elektronika": 5,
}

export const ETYKIETA_CELU: Record<CelUziemienia, string> = {
  odgromowa: "Instalacja odgromowa (< 10 Ω)",
  "przeciwporazeniowa": "Ochrona przeciwporażeniowa (< 30 Ω)",
  "czula-elektronika": "Czuła elektronika (< 5 Ω)",
}

/** Maksymalna sensowna liczba prętów w jednym rzędzie prostym — powyżej tego układ wymaga realnego
 * projektu geodezyjnego terenu (nachylenie, przeszkody), nie samego liczenia. */
export const MAX_SENSOWNA_LICZBA_PRETOW = 20
