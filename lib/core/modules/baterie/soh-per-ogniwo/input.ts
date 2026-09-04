/**
 * Ekran 14, Moduł 4 "Magazyn energii / baterie" — "SoH (State of Health) — prognoza żywotności"
 * (scala dawne 3.16, 3.33, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B, punkt 2 —
 * "Diagnostyka per ogniwo"). Zbudowana wyłącznie ta warstwa — punkt 1 ("SoH ogólny pakietu",
 * metoda coulombowska z historii cykli/temperatury/DoD) wymaga ciągłego logowania danych z
 * BMS w czasie, którego ta apka nie ma; nie da się policzyć z jednorazowych danych wejściowych
 * bez wymyślania modelu degradacji.
 */

export type SohPerOgniwoInput = {
  /** Rezystancja wewnętrzna ogniwa fabrycznie (nowe) [mΩ]. 0 = jeszcze nie wpisano. */
  rezystancjaFabrycznaMOhm: number
  /** Aktualnie zmierzona rezystancja wewnętrzna ogniwa [mΩ]. 0 = jeszcze nie wpisano. */
  rezystancjaAktualnaMOhm: number
}
