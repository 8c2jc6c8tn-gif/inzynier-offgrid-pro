/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 2 "Zasilanie ESP32 z magistrali systemowej" (dawne 11.2;
 * docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.2). Wzorzec D. Parametry przetwornicy (maks. napięcie
 * wejściowe, prąd wyjściowy, sprawność) wpisuje user z karty katalogowej — źródło podaje tylko nazwy (MP1584, LM2596).
 */

export type SposobZasilania = "przetwornica" | "bezposrednio"

export type ZasilanieEsp32Input = {
  sposob: SposobZasilania | null
  /** Napięcie nominalne magistrali [V] (12/24/48). */
  napiecieMagistraliV: number | null
  /** Najwyższe napięcie magistrali — przy ładowaniu [V]. null = przyjmij nominalne. */
  napiecieMagistraliMaxV: number | null
  /** Pobór ESP32 + czujników po stronie niskiego napięcia [W]. */
  poborMocyW: number | null
  /** Napięcie wyjściowe przetwornicy [V] (5 lub 3,3). */
  napiecieWyjscioweV: number | null
  /** Maks. napięcie wejściowe przetwornicy z karty [V]. */
  napiecieWejscioweMaxV: number | null
  /** Maks. prąd wyjściowy przetwornicy z karty [A]. */
  pradWyjsciowyMaxA: number | null
  /** Sprawność przetwornicy [%]. */
  sprawnoscPct: number | null
}
