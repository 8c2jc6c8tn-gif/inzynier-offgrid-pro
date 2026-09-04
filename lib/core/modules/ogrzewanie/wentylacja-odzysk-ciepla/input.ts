/**
 * Ekran 3, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "System wentylacji z odzyskiem
 * ciepła" (scala dawne 5.3, 5.23, 5.24, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B
 * punkt 1: "Podstawowy bilans"). Wzorzec D. Buduje tylko podstawowy bilans cieplno-elektryczny
 * (5.3) — projekt strumieni per pomieszczenie (5.23) i logika bypassu letniego (5.24) wymagają
 * danych/reguł nieobecnych w źródle jako wzór, świadomie pominięte.
 */

export type WentylacjaOdzyskCieplaInput = {
  /** Wydajność centrali wentylacyjnej [m³/h]. 0 = jeszcze nie wpisano. */
  wydajnoscCentraliM3H: number
  /**
   * Sprawność rekuperatora [%] — źródło: "z bazy komponentów", tu pole ręcznego wpisu (D16),
   * bez ukrytego domyślnego. 0 = jeszcze nie wpisano.
   */
  sprawnoscRekuperatoraPct: number
  /** Różnica temperatur wewnątrz/na zewnątrz [K]. null = jeszcze nie wpisano (0K to legalna wartość). */
  deltaTK: number | null
  /**
   * Stały pobór mocy wentylatorów centrali [W]. Źródło podaje zakres (50-100 W), nie pojedynczą
   * liczbę — pole ręcznego wpisu (D16). 0 = jeszcze nie wpisano.
   */
  poborWentylatorowW: number
}
