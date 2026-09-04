/**
 * Ekran 21, Moduł 4 "Magazyn energii / baterie" — "Pozycjonowanie ogniw (kompresja/spuchnięcie)"
 * (dawne 3.23, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D. Docisk
 * podawany wprost w kgf (nie moment na śrubie) — przeliczenie docisk→moment wymagałoby skoku
 * gwintu i współczynnika tarcia, których źródło nie podaje (tylko jeden przykładowy wynik
 * "3 N·m" dla konkretnego M8, nie ogólny wzór), więc nie liczone.
 */

export type PozycjonowanieOgniwInput = {
  /** Zastosowany docisk na pakiet ogniw [kgf]. 0 = jeszcze nie wpisano. */
  dociskKgf: number
  /** Czy zostawiono min. 1 mm luzu na pęcznienie (dylatację) podczas ładowania. */
  luzNaPeczenie: boolean
}
