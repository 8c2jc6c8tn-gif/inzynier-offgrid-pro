/**
 * Ekran 9, Moduł 4 "Magazyn energii / baterie" — "Detekcja zwarcia i e-Fuse" (dawne 3.9,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D. Prąd zwarciowy liczony
 * tym samym wzorem co Ekran 24 (Dobór bezpiecznika DC) — wzorzec "echo".
 */

export type DetekcjaZwarciaEFuseInput = {
  /** Napięcie nominalne baterii/pakietu [V]. 0 = jeszcze nie wpisano. */
  napiecieBateriiV: number
  /** Rezystancja wewnętrzna pakietu [Ω]. 0 = jeszcze nie wpisano. */
  rezystancjaWewnetrznaOhm: number
  /** Zdolność łączeniowa pojedynczych tranzystorów BMS (z karty katalogowej) [A]. 0 = jeszcze nie wpisano. */
  zdolnoscLaczeniowaTranzystorowA: number
}
