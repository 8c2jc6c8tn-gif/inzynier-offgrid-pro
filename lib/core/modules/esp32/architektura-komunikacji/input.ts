/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 4 "Architektura komunikacji" (dawne 11.4;
 * docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.4). Wzorzec D. Połączenia ESP32 z urządzeniami wpisuje user;
 * Biblia: „sprawdza konflikty adresów i prędkości transmisji”.
 */

export type ProtokolPolaczenia = "rs485" | "can" | "wifi" | "ethernet" | "bluetooth" | "lora"

export type PolaczenieEsp32 = {
  nazwa: string
  protokol: ProtokolPolaczenia
  /** Transceiver między GPIO a magistralą (MAX485, SN65HVD230…). Domyślnie false. */
  maTransceiver: boolean
  /** Adres urządzenia na magistrali RS485/Modbus. null = nie dotyczy / nie wpisano. */
  adres: number | null
  /** Prędkość transmisji [bit/s]. null = nie wpisano. */
  predkoscBps: number | null
}

export type ArchitekturaKomunikacjiInput = {
  polaczenia: PolaczenieEsp32[]
}
