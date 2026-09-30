/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 3 "Montaż i obudowa w rozdzielni" (dawne 11.3;
 * docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.3). Wzorzec F — przewodnik z kontrolą.
 * `null` = pytanie bez odpowiedzi (INCOMPLETE, nigdy "OK").
 */

/** Źródło: "IP20 w suchej rozdzielni, IP65 w wilgotnym garażu". */
export type MiejsceMontazuEsp32 = "suche" | "wilgotne"

/** Biblia §9.3: "zaleca montaż na szynie DIN lub płycie montażowej". */
export type SposobMontazuEsp32 = "din" | "plyta" | "inny"

export type MontazObudowaInput = {
  miejsce: MiejsceMontazuEsp32 | null
  /** Kod IP obudowy (np. 20, 54, 55, 65) — z karty obudowy. */
  ipKod: number | null
  montaz: SposobMontazuEsp32 | null
  /** Odstęp obudowy ESP32 od szyn prądowych [cm]. */
  odstepOdSzynCm: number | null
  wentylacja: boolean | null
  izolacjaOdCzesciPodNapieciem: boolean | null
}
