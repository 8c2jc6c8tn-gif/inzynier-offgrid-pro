/**
 * Ekran 13, Moduł 5 "Okablowanie i zabezpieczenia" — "Selektywność zabezpieczeń" (dawne 4.12,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec C — źródło opisuje KONCEPCJĘ
 * (porównanie krzywych czasowo-prądowych zabezpieczeń), ale nie podaje ani wzoru, ani progu
 * liczbowego (np. stosunku prądów znamionowych) do automatycznego wyliczenia selektywności —
 * rzeczywista ocena wymaga rzeczywistych krzywych wyzwalania konkretnych, dobranych zabezpieczeń
 * (baza komponentów, której ten projekt jeszcze nie ma). Zgodnie z 8.2 ("sekcja ma treść ≠ ma
 * computable wzór"): treść informacyjna, nie kalkulator udający precyzję, której źródło nie daje.
 */

export type ZasadaSelektywnosci = {
  id: string
  tytul: string
  opis: string
}

export const ZASADY: ZasadaSelektywnosci[] = [
  {
    id: "hierarchia",
    tytul: "Hierarchia zabezpieczeń",
    opis:
      "Każdy obwód ma zabezpieczenie najbliżej odbiornika, w rozdzielni pośredniej i główne u " +
      "źródła — trzy poziomy, nie jeden wspólny bezpiecznik dla wszystkiego.",
  },
  {
    id: "krzywe",
    tytul: "Krzywe czasowo-prądowe",
    opis:
      "Przy zwarciu ma zadziałać TYLKO najbliższe zabezpieczenie — sprawdza się to porównując " +
      "rzeczywiste krzywe wyzwalania (charakterystyki) dobranych zabezpieczeń, nie samą wartość " +
      "prądu znamionowego. Krzywe podaje producent konkretnego modelu.",
  },
  {
    id: "brak-selektywnosci",
    tytul: "Skutek braku selektywności",
    opis: "Zwarcie w jednym obwodzie (np. gniazdko) wyłącza zabezpieczenie główne — cały system, nie tylko awaryjny obwód.",
  },
]

export const PRZYKLAD =
  "Przy zwarciu 500 A w obwodzie gniazd zadziała tylko bezpiecznik 16 A. Główny 125 A nie " +
  "wyłączy się — reszta domu działa dalej."

export const MIGAWKA =
  "Jak pęknie jedna rura, nie zakręcasz głównego zaworu w całym domu. Tak samo z prądem — ma " +
  "zadziałać tylko ten bezpiecznik, który jest najbliżej awarii."
