/**
 * Ekran B12, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Przechowywanie /
 * recykling / narzędzia" (dawne 10.18, 10.19, 10.20 — docs/zrodla/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Wzorzec C — trzy niezależne, uzupełniające się tematy, bez pól wejściowych. Ten ekran nie ma
 * kalkulatora — to czysta treść, dane 1:1 ze źródła. Dwa fakty oznaczone 🔴 w źródle (mróz,
 * zakaz wylewania kwasu) dopisane też do docs/rejestr-twardych-stopow.md.
 */

export type FaktStopka = { id: string; tekst: string; hardStop?: boolean }

export const PRZECHOWYWANIE_FAKTY: FaktStopka[] = [
  {
    id: "pelne-naladowanie",
    tekst:
      "W pełni naładowany (w przeciwieństwie do LiFePO4!) — zapobiega zamarzaniu elektrolitu i " +
      "siarczanowaniu.",
  },
  { id: "miejsce", tekst: "Chłodne, suche miejsce." },
  {
    id: "mroz",
    tekst:
      "Przechowywanie rozładowanego akumulatora kwasowego w mrozie — elektrolit o niskiej " +
      "gęstości zamarza i pęka obudowa.",
    hardStop: true,
  },
]

export const RECYKLING_FAKTY: FaktStopka[] = [
  { id: "punkty-zbiorki", tekst: "Punkty zbiórki: sklepy specjalistyczne, PSZOK." },
  {
    id: "kaucja",
    tekst: "Kaucja — zwrot pieniędzy przy oddaniu starego akumulatora przy zakupie nowego.",
  },
  {
    id: "zakaz-wylewania",
    tekst: "Kategoryczny zakaz wylewania kwasu do kanalizacji lub gruntu.",
    hardStop: true,
  },
]

export const NARZEDZIA_FAKTY: FaktStopka[] = [
  { id: "areometr", tekst: "Areometr." },
  { id: "miernik-napiecia", tekst: "Miernik napięcia." },
  { id: "klucze-izolowane", tekst: "Klucze izolowane." },
  { id: "szczotka-do-klem", tekst: "Szczotka do klem." },
  { id: "wazelina-techniczna", tekst: "Wazelina techniczna." },
  { id: "ladowarka-odsiarczajaca", tekst: "Ładowarka z funkcją odsiarczania." },
  {
    id: "woda-destylowana",
    tekst: "Woda destylowana (uzupełnianie poziomu elektrolitu).",
  },
]
