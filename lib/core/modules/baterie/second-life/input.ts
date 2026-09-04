/**
 * Ekran 17, Moduł 4 "Magazyn energii / baterie" — "Analiza Second-Life (baterie z EV)" (dawne
 * 3.19, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec B. Szacunek SoH na
 * podstawie wieku LUB przebiegu — źródło podaje oba jako alternatywne metody ("~2-3%/rok LUB
 * ~1%/10 000 km"), użytkownik wybiera, którą ma dane do zastosowania. Dolna granica zakresu
 * wieku (2%/rok) — ten sam wzorzec konserwatywnego wyboru co Ekran 6 (Starzenie i degradacja).
 */

export type MetodaSzacunkuSoh = "" | "wiek" | "przebieg"

export type SecondLifeInput = {
  /** Deklarowana pojemność baterii z EV [kWh]. 0 = jeszcze nie wpisano. */
  pojemnoscDeklarowanaKwh: number
  /** Cena zakupu [zł]. 0 = jeszcze nie wpisano. */
  cenaZakupuZl: number
  metodaSzacunku: MetodaSzacunkuSoh
  /** Wiek baterii [lata] — używane tylko gdy metodaSzacunku === "wiek". 0 = jeszcze nie wpisano. */
  wiekLata: number
  /** Przebieg pojazdu [km] — używane tylko gdy metodaSzacunku === "przebieg". 0 = jeszcze nie wpisano. */
  przebiegKm: number
  /** Cena nowej baterii LiFePO4 [zł/kWh] do porównania. `null` = nie podano (porównanie pominięte). */
  cenaNowejLiFePO4ZlZaKwh: number | null
}
