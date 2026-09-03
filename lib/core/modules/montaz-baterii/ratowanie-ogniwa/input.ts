/**
 * Ekran A9, Moduł 11 "Montaż baterii" — "Ratowanie głęboko rozładowanego ogniwa" (dawne 9.17,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md, ścieżka LiFePO4). Wzorzec D — próg
 * decyzyjny na podstawie zmierzonego napięcia (0V / niskie-niezerowe / >1,5V).
 */

export type RatowanieOgniwaInput = {
  /** Zmierzone napięcie ogniwa [V]. `null` = jeszcze nie zmierzono — 0 jest prawidłowym, krytycznym wynikiem pomiaru, nie placeholderem. */
  napiecieOgniwaV: number | null
}
