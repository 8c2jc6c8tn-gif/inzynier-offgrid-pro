/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 8 "Klapy pożarowe i wentylacja — sprzęt i kontrola AI" (scala
 * dawne 11.56 + 12.56; docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.8, §8.14). Wzorzec D.
 * Sprawdzenie reakcji wentylacji na pożar. Przewietrzanie i reset klap po ugaszeniu (12.56) — logika sterownika, poza
 * zakresem. Flagi domyślnie `false`.
 */

export type WentylacjaBudynku = "brak" | "mechaniczna"

export type KlapyPozaroweInput = {
  /** Wentylacja mechaniczna / rekuperacja z kanałami. null = nie wybrano. */
  wentylacja: WentylacjaBudynku | null
  /** Rekuperacja/wentylacja wyłączana sygnałem pożaru. */
  wentylacjaWylaczanaPrzyPozarze: boolean
  /** Klapy odcinające w kanałach zamykane po wykryciu pożaru. */
  klapyZamykanePrzyPozarze: boolean
  /** Sygnalizacja stanu klap (otwarte/zamknięte). */
  sygnalizacjaStanuKlap: boolean
  /** Wentylacja oddymiająca w strefie zagrożonej. */
  maOddymianie: boolean
}
