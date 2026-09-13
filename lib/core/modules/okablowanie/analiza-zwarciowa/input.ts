/**
 * Ekran 12, Moduł 5 "Okablowanie i zabezpieczenia" — "Analiza zwarciowa" (dawne 4.11,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type AnalizaZwarciowaInput = {
  /** Napięcie baterii [V]. 0 = jeszcze nie wpisano. */
  napiecieBateriiV: number
  /** Rezystancja wewnętrzna baterii [Ω]. 0 = jeszcze nie wpisano. */
  rezystancjaWewnetrznaBateriiOhm: number
  /** Prąd zwarciowy panelu (Isc) [A]. 0 = jeszcze nie wpisano. */
  iscPanelaA: number
  /** Liczba stringów PV połączonych równolegle. 0 = jeszcze nie wpisano. */
  liczbaStringowRownoleglych: number
  /** Zdolność wyłączania (AIC) sprawdzanego zabezpieczenia [A]. 0 = nie sprawdzane. */
  aicZabezpieczeniaA: number
}
