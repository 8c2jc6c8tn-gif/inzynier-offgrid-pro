/**
 * Ekran 23, Moduł 5 "Okablowanie i zabezpieczenia" — "Separacja EMC" (dawne 4.29,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec F — przewodnik z ilustracją: reguła
 * przestrzenna, rysunek + zasada, bez pól wejściowych (docs/standards/08-ui-ux.md, 8.2). Ten
 * ekran nie ma kalkulatora — to czysta treść, dane 1:1 ze źródła.
 */

export type SeparacjaEmcRule = {
  id: string
  tytul: string
  opis: string
}

export const SEPARACJA_EMC_RULES: SeparacjaEmcRule[] = [
  {
    id: "odstep",
    tytul: "Minimalny odstęp",
    opis: "10–20 cm między kablami silnoprądowymi (DC/AC) a sygnałowymi (sieć, czujniki).",
  },
  {
    id: "krzyzowanie",
    tytul: "Krzyżowanie",
    opis: "Tylko pod kątem prostym (90°) — nigdy równolegle na dłuższym odcinku.",
  },
  {
    id: "ftp",
    tytul: "Kabel sygnałowy blisko falownika",
    opis: "Zalecana ekranowana skrętka FTP — najsilniejsze pole magnetyczne jest tuż przy falowniku.",
  },
]
