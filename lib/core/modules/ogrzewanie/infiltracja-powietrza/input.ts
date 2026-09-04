/**
 * Ekran 12, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Infiltracja powietrza (test
 * szczelności)" (dawne 5.12, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Wzorzec D).
 */

export type InfiltracjaPowietrzaInput = {
  /** Wynik testu szczelności (blower door) lub szacunek — wymiany powietrza na godzinę [1/h]. 0 = jeszcze nie wpisano. */
  wymianyPowietrzaNaH: number
  /** Kubatura budynku [m³]. 0 = jeszcze nie wpisano. */
  kubaturaBudynkuM3: number
  /** Różnica temperatur wewnątrz/na zewnątrz [K]. null = jeszcze nie wpisano (0K to legalna wartość). */
  deltaTK: number | null
}
