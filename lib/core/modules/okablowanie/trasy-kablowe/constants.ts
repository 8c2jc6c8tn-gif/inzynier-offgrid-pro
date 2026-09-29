/**
 * Ekran 19, Moduł 5 "Okablowanie i zabezpieczenia" — "Trasy kablowe — prowadzenie i separacja"
 * (dawne 4.22 — docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md).
 * Wzorzec F — przewodnik z ilustracją: reguła przestrzenna, rysunek + zasada, bez pól
 * wejściowych (docs/standards/08-ui-ux.md, 8.2). Ten ekran nie ma kalkulatora — to
 * czysta treść, dane 1:1 ze źródła.
 */

export type TrasaRule = {
  id: string
  tytul: string
  opis: string
}

export const TRASY_KABLOWE_RULES: TrasaRule[] = [
  {
    id: "dc",
    tytul: "Trasa DC",
    opis: "Najkrótszą możliwą drogą, w cieniu (unikaj nagrzewania kabla słońcem).",
  },
  {
    id: "ac",
    tytul: "Trasa AC",
    opis: "Prosto do rozdzielni, bez zbędnych zakrętów.",
  },
  {
    id: "sygnalowe",
    tytul: "Kable sygnałowe",
    opis: "Prowadzone oddzielnie, min. 10–20 cm od kabli DC i AC.",
  },
  {
    id: "promien-giecia",
    tytul: "Promień gięcia",
    opis: "4–5× średnica kabla solarnego — ciaśniejszy zakręt uszkadza izolację i żyły.",
  },
]
