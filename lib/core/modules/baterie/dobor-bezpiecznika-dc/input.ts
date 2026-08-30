/**
 * Ekran 24, Moduł 4 "Magazyn energii / baterie" — "Dobór bezpiecznika DC (AIC/Class T/NH)"
 * (dawne 3.27 — docs/domena/Tresc_Modul_4_Baterie_Ekrany.md).
 * Wzorzec D — Doradca z werdyktem bezpieczeństwa: to jeden z najpoważniejszych twardych
 * stopów w całym dokumencie (AIC poniżej prądu zwarciowego pakietu rozrywa bezpiecznik
 * łukiem plazmowym), docs/standards/08-ui-ux.md, 8.3-8.4.
 */

export type DoborBezpiecznikaInput = {
  /** Napięcie nominalne baterii/pakietu [V]. */
  napiecieBateriiV: number
  /** Rezystancja wewnętrzna pakietu [Ω] — z pomiaru lub karty katalogowej ogniw. */
  rezystancjaWewnetrznaOhm: number
  /** Zdolność wyłączania (AIC) wybranego bezpiecznika [A], z karty katalogowej. */
  aicBezpiecznikaA: number
}
