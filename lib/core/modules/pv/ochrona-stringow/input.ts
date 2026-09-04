/**
 * Ekran 22, Moduł 3 "Instalacja PV" — "Ochrona stringów (bezpieczniki, diody blokujące)"
 * (dawne 2.38, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzorzec D.
 */

export type OchronaStringowInput = {
  /** Prąd zwarciowy panelu (Isc) [A]. 0 = jeszcze nie wpisano. */
  iscA: number
  /** Liczba stringów połączonych równolegle. 0 = jeszcze nie wpisano. */
  liczbaStringowRownoleglych: number
  /** Czy zainstalowane są bezpieczniki/diody blokujące per string. */
  maZabezpieczeniaPerString: boolean
}
