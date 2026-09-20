/**
 * Ekran 8, Moduł 5 "Okablowanie i zabezpieczenia" — "Przepust powietrza pod panelami"
 * (dawne 4.4, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D-lite.
 */

export type PrzepustPowietrzaInput = {
  /** Planowana szczelina wentylacyjna pod panelami [cm]. null = jeszcze nie wpisano. */
  szczelinaCm: number | null
}
