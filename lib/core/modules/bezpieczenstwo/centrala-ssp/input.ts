/**
 * Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — Ekran 5 "Wejścia dla centrali sygnalizacji pożaru" (dawne 11.53;
 * docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Biblia v2.0 §8.5). Wzorzec D. Sprawdzenie integracji ESP32
 * z centralą SSP — które sygnały sterownik odbiera i czy centrala zgłasza awarię. Flagi domyślnie `false`.
 */

export type InterfejsCentrali = "styki" | "rs485"

export type StanCentrali = "dozor" | "awaria"

export type CentralaSspInput = {
  interfejs: InterfejsCentrali | null
  stanCentrali: StanCentrali | null
  odbieraAlarm: boolean
  odbieraAwarie: boolean
  odbieraRozbrojenie: boolean
  logujeZdarzenia: boolean
}
