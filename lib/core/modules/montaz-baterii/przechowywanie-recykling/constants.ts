/**
 * Ekran A10, Moduł 11 "Montaż baterii", Ścieżka A (LiFePO4) — "Przechowywanie / recykling /
 * narzędzia diagnostyczne" (dawne 9.18, 9.19, 9.20 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec C — trzy niezależne, uzupełniające się tematy, bez pól wejściowych (docs/standards/08-ui-ux.md,
 * 8.2). Ten ekran nie ma kalkulatora — to czysta treść, dane 1:1 ze źródła.
 */

export type FaktStopka = { id: string; tekst: string }

export const PRZECHOWYWANIE_FAKTY: FaktStopka[] = [
  { id: "soc", tekst: "Docelowy stan naładowania: ok. 50% SoC (ok. 3,2 V/ogniwo)." },
  { id: "temperatura", tekst: "Temperatura przechowywania: 10–25°C." },
  { id: "wilgotnosc", tekst: "Miejsce suche." },
  { id: "bieguny", tekst: "Bieguny zaizolowane taśmą kaptonową." },
]

export const RECYKLING_FAKTY: FaktStopka[] = [
  {
    id: "punkty-zbiorki",
    tekst: "Punkty zbiórki: sklepy specjalistyczne, PSZOK.",
  },
  {
    id: "rozladowanie",
    tekst:
      "Przed oddaniem rozładuj pakiet do 0V. Jedna z metod to kontrolowane zanurzenie w słonej " +
      "wodzie — to metoda kontrolowana, wymagająca zrozumienia ryzyka, nie do wykonania bez " +
      "przygotowania.",
  },
]

export const NARZEDZIA_DIAGNOSTYCZNE_FAKTY: FaktStopka[] = [
  {
    id: "tester-rezystancji",
    tekst: "Tester rezystancji wewnętrznej ogniwa (np. YR1035).",
  },
  {
    id: "zasilacz-laboratoryjny",
    tekst: "Zasilacz laboratoryjny do kontrolowanego balansowania/ratowania ogniw.",
  },
]

export const MIGAWKA =
  "Ogniwo, które nie pracuje, nie jest ogniwem 'wyłączonym' — złe przechowywanie (pełne " +
  "naładowanie, mróz, wilgoć) starzeje je tak samo jak złe użytkowanie."
