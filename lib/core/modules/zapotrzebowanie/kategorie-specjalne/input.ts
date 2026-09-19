/**
 * Moduł 2 "Zapotrzebowanie" — Ekran 15 "Kategorie specjalne — warsztat/gospodarstwo/oświetlenie
 * terenowe" (dawne 1.27, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md, linie 164-171).
 * Wzorzec A (przełącznik kategorii). Świadomie BEZ domyślnych mocy urządzeń — źródło nie podaje
 * liczb, tylko nazwy przykładowych urządzeń dla jednej z trzech kategorii (Warsztat), więc
 * pozycje są w całości ręcznym wpisem użytkownika.
 */

export type Kategoria = "warsztat" | "gospodarstwo" | "oswietlenie-terenowe"

export type PozycjaKategorii = {
  id: string
  nazwa: string
  mocW: number
  czasMin: number
}

export type KategorieSpecjalneInput = {
  kategoria: Kategoria
  pozycje: PozycjaKategorii[]
}
