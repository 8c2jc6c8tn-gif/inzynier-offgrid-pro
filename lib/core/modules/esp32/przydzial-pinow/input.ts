/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — Ekran 5 "Konfiguracja GPIO/ADC/I2C/SPI/UART" (dawne 11.5;
 * docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md, Biblia v2.0 §9.5). Wzorzec D. Przydział pinów wpisuje user — aplikacja
 * sprawdza konflikty; mapa pinów ESP32 (które piny to ADC1/ADC2) nie jest w źródle, więc nie jest przydzielana automatycznie.
 */

export type FunkcjaPinu =
  | "i2c-sda"
  | "i2c-scl"
  | "spi-mosi"
  | "spi-miso"
  | "spi-sck"
  | "spi-cs"
  | "uart-tx"
  | "uart-rx"
  | "adc"
  | "1-wire"
  | "pwm"
  | "wejscie"
  | "wyjscie"

export type PrzypisaniePinu = {
  gpio: number | null
  funkcja: FunkcjaPinu
  opis: string
}

export type PrzydzialPinowInput = {
  piny: PrzypisaniePinu[]
  /** Wi-Fi aktywne w trakcie pomiarów (ogranicza ADC2 — Biblia §9.5). */
  wifiAktywne: boolean
}
