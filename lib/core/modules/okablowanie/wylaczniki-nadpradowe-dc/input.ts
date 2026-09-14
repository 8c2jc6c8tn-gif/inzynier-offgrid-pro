/**
 * Ekran 14, Moduł 5 "Okablowanie i zabezpieczenia" — "Wyłączniki nadprądowe DC"
 * (dawne 4.13, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type WylacznikiNadpradoweDcInput = {
  /** Prąd znamionowy obwodu [A]. 0 = jeszcze nie wpisano. */
  pradA: number
  /** Napięcie DC obwodu [V]. 0 = jeszcze nie wpisano. */
  napiecieV: number
  /** Liczba biegunów wyłącznika. 0 = jeszcze nie wpisano. */
  liczbaBiegunow: number
  /** Czy wyłącznik ma certyfikację do pracy w DC (gaszenie łuku stałoprądowego). */
  certyfikowanyDoDc: boolean
  /** Zdolność wyłączania (AIC) wyłącznika [A]. 0 = nie podano — sprawdzenie pomijane. */
  aicA: number
  /** Prąd zwarciowy w tym punkcie [A] (docelowo z Ekranu 12). 0 = nie podano. */
  pradZwarciowyA: number
}
