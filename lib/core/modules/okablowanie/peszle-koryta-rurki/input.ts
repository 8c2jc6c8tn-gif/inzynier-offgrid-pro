/**
 * Ekran 24, Moduł 5 "Okablowanie i zabezpieczenia" — "Peszle, koryta, rurki"
 * (dawne 4.31, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec B.
 */

export type MiejsceMontazu = "wewnatrz" | "na-scianie-zewnatrz" | "w-ziemi" | "przemyslowe"

export type PeszleKorytaRurkiInput = {
  miejsceMontazu: MiejsceMontazu | null
}
