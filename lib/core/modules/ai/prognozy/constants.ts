import type { GodzinaPrognozy } from "./input"

/**
 * PRZYKŁADOWE dane demonstracyjne — w docelowej implementacji ten ekran czerpie z silnika
 * symulacji rocznej (§15.1 Zasad UX) i prognozy pogody live (§15.3), które nie są jeszcze
 * zbudowane (docs/rejestr-pokrycia.md). Kształt danych (produkcja/zużycie per godzina) jest
 * 1:1 ze źródła (docs/domena/Tresc_Modul_10_AI_Ekrany.md, Ekran 1) — same wartości liczbowe są
 * ilustracyjne, nie realną prognozą żadnej instalacji.
 */
export const SAMPLE_PROGNOZA_24H: GodzinaPrognozy[] = [
  { godzina: 0, produkcjaKw: 0, zuzycieKw: 0.4 },
  { godzina: 3, produkcjaKw: 0, zuzycieKw: 0.3 },
  { godzina: 6, produkcjaKw: 0.2, zuzycieKw: 0.8 },
  { godzina: 9, produkcjaKw: 2.1, zuzycieKw: 1.2 },
  { godzina: 12, produkcjaKw: 3.8, zuzycieKw: 1.0 },
  { godzina: 15, produkcjaKw: 2.6, zuzycieKw: 1.1 },
  { godzina: 18, produkcjaKw: 0.4, zuzycieKw: 2.4 },
  { godzina: 21, produkcjaKw: 0, zuzycieKw: 1.5 },
]
