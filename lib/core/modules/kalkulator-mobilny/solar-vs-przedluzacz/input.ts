/**
 * Ekran 29, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Koszt małego zestawu solarnego vs przedłużacz"
 * (dawne 8.56, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.44). Wzorzec B.
 * Wszystkie kwoty i zużycie od usera — aplikacja nie ma cennika kabli ani zestawów (Dyrektywa #1).
 */
export type SolarVsPrzedluzaczInput = {
  /** Jednorazowy koszt przedłużacza/linii (kabel, wykop, zabezpieczenia) [zł]. */
  kosztPrzedluzaczaZl: number
  /** Zużycie energii w roku [kWh/rok]. */
  zuzycieKwhRok: number
  /** Cena energii z sieci [zł/kWh] (brutto, z opłatami zmiennymi). */
  cenaEnergiiZlKwh: number
  /** Stałe opłaty sieciowe za rok [zł/rok]; 0 = brak (np. prąd od sąsiada rozliczany tylko za kWh). */
  oplatyStaleZlRok: number
  /** Koszt zestawu solarnego (panel, akumulator, regulator, montaż) [zł]. */
  kosztZestawuZl: number
  /** Roczny koszt utrzymania zestawu (np. odłożone na wymianę akumulatora) [zł/rok]; 0 = brak. */
  eksploatacjaZestawuZlRok: number
  /** Horyzont porównania [lat]. */
  horyzontLat: number
}
