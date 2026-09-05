/**
 * Ekran A5, Moduł 11 "Montaż baterii" — "Pierwsze uruchomienie + test balansowania"
 * (dawne 9.6, 9.13, docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4).
 */

export type PierwszeUruchomienieInput = {
  /** Pojemność pakietu [Ah] — do wyliczenia prądu testowego 0,1C. */
  pojemnoscAh: number
  /** Napięcie najwyżej naładowanego ogniwa podczas testu [V] — sprawdzane wobec progu Top Balancing. */
  napiecieNajwyzszegoOgniwaV: number
  /** Potwierdzone pozycje checklistu (BMS balansuje, weryfikacja parametrów przed obciążeniem). */
  potwierdzoneIds: string[]
}
