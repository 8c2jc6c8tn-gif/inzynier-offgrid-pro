/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 6 "Konfiguracja niezawodności systemu" (scala dawne 11.29, 11.30,
 * 11.32, 11.33, 11.34, 11.35, 11.49, 11.50; docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.49). Wzorzec D —
 * binarne ustawienia systemowe. Wszystkie domyślnie `false`.
 */

export type FunkcjaNiezawodnosci =
  | "kartaSd"
  | "rtc"
  | "podtrzymanieZasilania"
  | "watchdog"
  | "izolacjaGalwaniczna"
  | "ochronaPrzepieciowa"
  | "ota"
  | "redundancjaMasterSlave"

export type NiezawodnoscEsp32Input = Record<FunkcjaNiezawodnosci, boolean> & {
  /** OTA: weryfikacja podpisu cyfrowego przed instalacją. */
  otaPodpis: boolean
  /** OTA: weryfikacja sumy kontrolnej. */
  otaSumaKontrolna: boolean
  /** OTA: powrót do poprzedniej wersji w razie błędu. */
  otaRollback: boolean
}
