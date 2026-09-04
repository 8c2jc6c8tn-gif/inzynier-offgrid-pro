/**
 * Ekran 8, Moduł 4 "Magazyn energii / baterie" — "Symulacja Słabego Ogniwa (Cell Drift &
 * Balancing)" (dawne 3.8, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D.
 * "Liczba ogniw w szeregu" z Sekcji A świadomie nie stała się polem tego prostego wzoru —
 * pojemność użyteczna pakietu (w Ah) jest ograniczona pojemnością NAJSŁABSZEGO ogniwa
 * niezależnie od liczby ogniw w szeregu (połączenie szeregowe), a napięcie ogniwa (do
 * przeliczenia na kWh) nie jest wymienione w Sekcji A — wynik podany w Ah i %, nie w kWh.
 */

export type SlabeOgniwoInput = {
  /** Pojemność znamionowa ogniwa [Ah]. 0 = jeszcze nie wpisano. */
  pojemnoscZnamionowaAh: number
  /** Tolerancja fabryczna [%] — domyślnie ±3% wg źródła. 0 = jeszcze nie wpisano. */
  tolerancjaPct: number
}
