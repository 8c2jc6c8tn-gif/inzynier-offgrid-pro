import { describe, expect, it } from "vitest"
import { calculatePrzydzialPinow } from "../calculator"
import type { PrzypisaniePinu } from "../input"

const PRZYKLAD: PrzypisaniePinu[] = [
  { gpio: 21, funkcja: "i2c-sda", opis: "" },
  { gpio: 22, funkcja: "i2c-scl", opis: "" },
  { gpio: 34, funkcja: "adc", opis: "pomiar napięcia" },
  { gpio: 16, funkcja: "uart-tx", opis: "" },
]

describe("calculatePrzydzialPinow (M9/E5, dawne 11.5)", () => {
  it("przykład źródła (GPIO21 SDA, 22 SCL, 34 ADC, 16 UART TX) → bez konfliktów", () => {
    const w = calculatePrzydzialPinow({ piny: PRZYKLAD, wifiAktywne: false })
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ liczbaPrzypisan: 4, liczbaKonfliktow: 0 })
  })

  it("dwie różne funkcje na GPIO16 → 🔴 z listą", () => {
    const w = calculatePrzydzialPinow({ piny: [...PRZYKLAD, { gpio: 16, funkcja: "pwm", opis: "wentylator" }], wifiAktywne: false })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["PIN-KONFLIKT", "critical"]])
    expect(w.warnings[0]!.params).toEqual({ gpio: 16, opisy: "uart-tx, pwm (wentylator)" })
  })

  it("dwa czujniki na tej samej magistrali I2C/1-Wire — dozwolone; dwa CS SPI albo dwa ADC na jednym pinie — konflikt", () => {
    const wspolne = calculatePrzydzialPinow({
      piny: [...PRZYKLAD, { gpio: 21, funkcja: "i2c-sda", opis: "BME280" }, { gpio: 4, funkcja: "1-wire", opis: "" }, { gpio: 4, funkcja: "1-wire", opis: "" }],
      wifiAktywne: false,
    })
    expect(wspolne.warnings).toEqual([])
    const cs = calculatePrzydzialPinow({ piny: [{ gpio: 5, funkcja: "spi-cs", opis: "" }, { gpio: 5, funkcja: "spi-cs", opis: "" }], wifiAktywne: false })
    expect(cs.warnings[0]!.code).toBe("PIN-KONFLIKT")
  })

  it("ADC przy Wi-Fi → info o ADC2 (nie konflikt)", () => {
    const w = calculatePrzydzialPinow({ piny: PRZYKLAD, wifiAktywne: true })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["PIN-ADC-WIFI", "info"]])
    expect(w.status).toBe("VALID")
  })

  it("brak pinów → INCOMPLETE; GPIO −1 → INVALID_INPUT", () => {
    expect(calculatePrzydzialPinow({ piny: [{ gpio: null, funkcja: "adc", opis: "" }], wifiAktywne: false }).status).toBe("INCOMPLETE")
    expect(calculatePrzydzialPinow({ piny: [{ gpio: -1, funkcja: "adc", opis: "" }], wifiAktywne: false }).status).toBe("INVALID_INPUT")
  })
})
