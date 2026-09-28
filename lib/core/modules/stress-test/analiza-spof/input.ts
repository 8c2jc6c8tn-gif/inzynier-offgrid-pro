/**
 * Moduł 7 "Stress-test zimowy" — Ekran 10 "Analiza SPOF (Single Point of Failure)" (dawne 6.12;
 * docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Lista komponentów wpisywana ręcznie (docelowo auto ze
 * wszystkich modułów — brak wspólnego profilu sprzętu dla całego systemu); redundancję deklaruje user.
 */

export type TypKomponentu = "bms" | "falownik" | "bezpiecznik-glowny" | "mppt" | "pompa-ciepla" | "pompa" | "czujnik" | "inne"

export type KomponentSystemu = {
  nazwa: string
  typ: TypKomponentu
  /** Jest redundancja: drugi egzemplarz, obejście, zapas albo źródło awaryjne. Domyślnie false. */
  maRedundancje: boolean
}

export type AnalizaSpofInput = {
  komponenty: KomponentSystemu[]
}
