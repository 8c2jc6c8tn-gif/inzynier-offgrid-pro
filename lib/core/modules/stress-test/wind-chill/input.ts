/**
 * Moduł 7 "Stress-test zimowy" — "Wind Chill — wpływ wiatru na zapotrzebowanie na ciepło"
 * (dawne 6.26→7.24, docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md, Ekran 17). Wzorzec D.
 * Najsilniejszy niezależny kandydat klastra stress-test (docs/rejestr-pokrycia.md) — nie
 * wymaga danych z innych modułów, tylko wiatr i temperatura.
 */

export type WindChillInput = {
  /** Temperatura powietrza [°C]. null = jeszcze nie wpisano (0°C to legalna wartość). */
  temperaturaC: number | null
  /** Prędkość wiatru na wysokości 10m [km/h]. 0 = jeszcze nie wpisano. */
  predkoscWiatruKmh: number
}
