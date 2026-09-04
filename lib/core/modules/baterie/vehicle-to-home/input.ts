/**
 * Ekran 19, Moduł 4 "Magazyn energii / baterie" — "Vehicle-to-Home (V2H)" (dawne 3.21,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzorzec D.
 *
 * "Rezerwa na dojazd, degradacja, straty" — trzy słowa źródła bez rozbicia na osobne wzory;
 * modelowane jako rezerwa (wprost odejmowana) + jeden łączny współczynnik sprawności/degradacji
 * (wpisywany ręcznie, nie wymyślony). Przykład źródła (80 kWh → 40 kWh) nie jest jednoznacznie
 * odtwarzalny bez znajomości podziału na te trzy składowe — kalkulator liczy poprawnie dla
 * dowolnych własnych wartości użytkownika, nie wymusza dopasowania do przykładu.
 */

export type VehicleToHomeInput = {
  /** Czy falownik i auto wspierają V2H (nie tylko V2L). */
  wspieraV2h: boolean
  /** Pojemność baterii trakcyjnej EV [kWh]. 0 = jeszcze nie wpisano. */
  pojemnoscBaterEvKwh: number
  /** Rezerwa zostawiana na dojazd (nieoddawana do domu) [kWh]. 0 = jeszcze nie wpisano (0 kWh to też legalna wartość — brak rezerwy). */
  rezerwaNaDojazdKwh: number
  /** Łączna sprawność efektywna (degradacja + straty konwersji) [%]. 0 = jeszcze nie wpisano. */
  sprawnoscEfektywnaPct: number
  /** Koszt wymiany baterii trakcyjnej [zł] — proxy kosztu zużycia. 0 = jeszcze nie wpisano. */
  kosztWymianyBateriiZl: number
  /** Liczba cykli życia baterii trakcyjnej. 0 = jeszcze nie wpisano. */
  liczbaCykli: number
}
