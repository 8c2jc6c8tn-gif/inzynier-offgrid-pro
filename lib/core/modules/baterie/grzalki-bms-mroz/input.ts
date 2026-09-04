/**
 * Ekran 5, Moduł 4 "Magazyn energii / baterie" — "Grzałki BMS i ochrona przed mrozem" (scala
 * dawne 3.5, 3.14, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B, punkt 2 — "Logika
 * decyzyjna, skąd brać prąd na grzanie"). Ten ekran implementuje wyłącznie punkt 2 (drzewo
 * decyzyjne źródła prądu na grzanie) — punkt 1 (bilans dobowy grzania, np. "0,5 kWh/dobę w
 * styczniu") NIE jest liczony: źródło nie podaje wzoru wiążącego temperaturę/czas z ilością
 * energii, tylko dwa ilustracyjne przykłady liczbowe (styczeń, nieogrzewany garaż) — pokazane w
 * UI jako informacja, nie jako wynik obliczenia z danych użytkownika.
 */

export type ProdukcjaPv = "" | "tak" | "nie"

export type GrzalkiBmsMrozInput = {
  /** Najniższa spodziewana temperatura przy baterii [°C]. `null` = jeszcze nie wpisano. */
  temperaturaMinC: number | null
  /** Bieżący SoC baterii [%]. 0 = jeszcze nie wpisano. */
  socPct: number
  /** Czy w tej chwili jest produkcja PV. "" = jeszcze nie wybrano. */
  produkcjaPv: ProdukcjaPv
}
