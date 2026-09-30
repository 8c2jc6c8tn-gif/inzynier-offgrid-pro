/**
 * Moduł 9 — Katalogi 2–4 (docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md; Biblia v2.0 §9.21–§9.28, §9.31, §9.36–§9.39,
 * §9.46–§9.48). Tu tylko identyfikatory pozycji w kolejności źródła — treść (technologia, dane doboru, uwaga Biblii)
 * jest tekstem dla użytkownika i leży w `lib/i18n/ui/m09-esp32.ts` (PL/EN/RU).
 */
export const KATALOGI_ESP32 = {
  /** Katalog 2 — Aktuatory / wyjścia sterujące (dawne 11.21–11.26). */
  aktuatory: ["przekaznik-230", "mosfet-dc", "pwm", "ssr", "stycznik", "efuse"],
  /** Katalog 3 — Protokoły komunikacji (dawne 11.27, 11.28, 11.31, 11.46, 11.47, 11.48). */
  protokoly: ["rs485-modbus", "can", "wifi-bt", "lora", "ethernet", "mqtt-tls"],
  /** Katalog 4 — Interfejs lokalny (dawne 11.36–11.39). */
  "interfejs-lokalny": ["wyswietlacz", "dioda-rgb", "przyciski", "buzzer"],
} as const

export type KatalogEsp32 = keyof typeof KATALOGI_ESP32
export const NAZWY_KATALOGOW_ESP32 = Object.keys(KATALOGI_ESP32) as KatalogEsp32[]
