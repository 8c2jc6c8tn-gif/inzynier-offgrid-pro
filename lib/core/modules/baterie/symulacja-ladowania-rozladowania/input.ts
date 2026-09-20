/**
 * Ekran 3, Moduł 4 "Magazyn energii / baterie" — "Symulacja czasu ładowania/rozładowania"
 * (dawne 3.3, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D.
 *
 * Źródło (Sekcja A) wymienia jako wejście "moc ładowania z PV (z Modułu 3)" i "profil obciążenia
 * (z Modułu 2)" — oba cross-modułowe, ekrany źródłowe jeszcze nie istnieją w kodzie (rejestr
 * pokrycia). Uproszczone tu do średnich mocy (nie pełnego profilu godzinowego) — ten sam wzorzec
 * uproszczenia co Ekran 1 (dobor-pojemnosci) dla "auto z Modułu 2". Pola ręcznego wpisu, z
 * podpowiedzią o docelowym auto-uzupełnieniu.
 */

export type SymulacjaLadowaniaInput = {
  /** Pojemność użyteczna baterii [kWh]. 0 = jeszcze nie wpisano. */
  pojemnoscUzytecznaKwh: number
  /** Aktualny/zakładany SoC na początku dnia [%], 0–100. */
  socStartPct: number
  /** Średnia moc ładowania netto z PV w ciągu dnia [kW] — 0 dopuszczalne (dzień bez słońca). */
  mocLadowaniaKw: number
  /** Średnia moc rozładowania w nocy (profil obciążenia) [kW]. 0 = jeszcze nie wpisano. */
  mocRozladowaniaKw: number
  /** Długość dostępnego okna ładowania (naświetlenie) [godz.], 0 = jeszcze nie wpisano. */
  dlugoscDniaGodz: number
  /** Próg ostrzegawczy SoC do sprawdzenia przetrwania nocy [%], 0–100. */
  socProgPct: number
}
