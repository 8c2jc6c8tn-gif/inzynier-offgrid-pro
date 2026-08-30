/**
 * Ekran 1, Moduł 10 "AI i prognozy" — "Prognozy" (scala dawne: 12.1, 12.2, 12.3, 12.4, 12.5, 12.43
 * — docs/domena/Tresc_Modul_10_AI_Ekrany.md). Wzorzec G — raport: interfejs użytkownika dla
 * silnika symulacji rocznej (§15.1) i prognozy pogody live (§15.3), nie osobny kalkulator, tylko
 * wizualizacja tego, co te dwa fundamenty już obliczyły.
 */

export type GodzinaPrognozy = {
  godzina: number
  produkcjaKw: number
  zuzycieKw: number
}
