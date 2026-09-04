/**
 * Ekran 26, Moduł 3 "Instalacja PV" — "Straty na złączkach MC4 w praktyce" (dawne 2.46,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Wzorzec C z elementami D).
 */

export type StratyZlaczkiMc4Input = {
  /**
   * Rezystancja pojedynczej złączki MC4 [mΩ]. Źródło podaje zakres, nie pojedynczą liczbę:
   * dobry stan 0,5-2 mΩ, luźna/zaśniedziała nawet 10× więcej — pole wymaga ręcznego wpisania
   * (D16, `rejestr-decyzji.md`), nie ukrytego domyślnego. 0 = jeszcze nie wpisano.
   */
  rezystancjaZlaczkiMOhm: number
  /** Liczba złączek MC4 w rozpatrywanej trasie (szeregowo, ten sam prąd przez wszystkie). 0 = jeszcze nie wpisano. */
  liczbaZlaczek: number
  /** Prąd płynący przez złączki [A]. 0 = jeszcze nie wpisano. */
  pradA: number
}
