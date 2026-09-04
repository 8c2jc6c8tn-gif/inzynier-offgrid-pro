/**
 * Ekran 13, Moduł 3 "Instalacja PV" — "Symulacja zacienienia i wpływu na diody bocznikujące"
 * (scala dawne 2.23, 2.49, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja A-D). Wzorzec D.
 */

export type ZacienienieDiodyBocznikujaceInput = {
  /** Moc znamionowa panelu (STC) [W]. 0 = jeszcze nie wpisano. */
  mocPaneluNominalnaW: number
  /** Liczba zacienionych sekcji panelu (0-3, po jednej diodzie bocznikującej na sekcję). */
  liczbaZacienionychSekcji: number
  /**
   * Liczba paneli połączonych szeregowo w stringu — kontekst do oceny skali problemu na poziomie
   * stringu (patrz assumptions wyniku), NIE do wyliczenia liczbowej straty stringu: źródło opisuje
   * ją jako zależną od konfiguracji, bez podanego wzoru. 0 = jeszcze nie wpisano.
   */
  liczbaPaneliWStringu: number
}
