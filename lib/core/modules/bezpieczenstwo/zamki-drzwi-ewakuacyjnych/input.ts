/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 3 "Siłowniki drzwi i zamki elektromagnetyczne"
 * (dawne 11.51; docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.3). Wzorzec D.
 * Sprawdzenie konfiguracji drzwi ewakuacyjnych — nie sterowanie (to warstwa ESP32/M9).
 * Dane bezpieczeństwa (zasilanie awaryjne, przycisk, kontaktron) domyślnie `false` — nigdy ukryty "tak".
 */

export type TypZamka = "elektromagnetyczny" | "elektrozaczep" | "silownik"

/** Stan drzwi przy zaniku zasilania: fail-safe (otwiera) / fail-secure (blokuje) / nieznany. */
export type ZachowaniePrzyZaniku = "otwiera" | "blokuje" | "nie-wiem"

export type ZamkiDrzwiEwakuacyjnychInput = {
  typZamka: TypZamka | null
  zachowaniePrzyZanikuZasilania: ZachowaniePrzyZaniku | null
  /** Zamek/sterownik zasilany z UPS lub własnego akumulatora. */
  maZasilanieAwaryjne: boolean
  /**
   * Manual mechanical release that opens the door with no power (lever handle, panic bar, key override) — D53:
   * the owner accepts fail-secure only with emergency power OR such a release. Optional: drafts and AI calls
   * from before D53 lack it (read as false).
   */
  maOtwarcieReczneMechaniczne?: boolean
  /** Przycisk ewakuacyjny zwalniający blokadę ręcznie. */
  maPrzyciskEwakuacyjny: boolean
  /** Zwalnianie blokady po sygnale alarmu pożarowego (centrala/czujki). */
  zwalnianiePoAlarmiePozarowym: boolean
  /** Kontaktron potwierdzający stan otwarcia drzwi. */
  maKontaktron: boolean
}
