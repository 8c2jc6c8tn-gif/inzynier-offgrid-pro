/**
 * Moduł 7 "Stress-test zimowy" — Ekran 8 "Agregat w mrozie — praca, rozruch, długi postój" (scala
 * dawne 6.9, 6.23, 6.36; docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md). Wzorzec D. Parametry
 * agregatu (czas pracy ciągłej, przerwa, zużycie paliwa, interwał oleju) z instrukcji producenta —
 * user wpisuje; źródło podaje je tylko jako przykład (8 h pracy / 1 h przerwy).
 */

export type PaliwoAgregatu = "diesel-zwykly" | "diesel-arktyczny" | "benzyna" | "inne"

export type AgregatWMrozieInput = {
  paliwo: PaliwoAgregatu | null
  /** Najniższa temperatura w miejscu przechowywania/pracy agregatu [°C]. null = nie wpisano. */
  temperaturaMiejscaC: number | null
  /** Łączny czas pracy potrzebny w scenariuszu (np. tydzień blackoutu) [h]. null = nie wpisano. */
  wymaganyCzasPracyH: number | null
  /** Maksymalny czas pracy ciągłej wg producenta [h]. null = brak limitu / nie podano. */
  maxPracaCiaglaH: number | null
  /** Wymagana przerwa po czasie pracy ciągłej [h]. */
  przerwaH: number | null
  /** Zużycie paliwa przy typowym obciążeniu [l/h]. null = nie podano. */
  zuzyciePaliwaLH: number | null
  /** Interwał wymiany oleju wg producenta [h pracy]. null = nie podano. */
  interwalWymianyOlejuH: number | null
  /** Ile dni agregat stoi bez uruchamiania. null = nie wpisano. */
  dniPostoju: number | null
}
