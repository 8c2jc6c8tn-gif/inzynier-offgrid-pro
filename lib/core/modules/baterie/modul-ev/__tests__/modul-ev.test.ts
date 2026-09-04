import { describe, expect, it } from "vitest"
import { calculateModulEv } from "../calculator"

describe("calculateModulEv", () => {
  it("przykład źródła: 10 kWh/dobę EV, nadwyżka latem pokrywa, zimą brakuje", () => {
    const result = calculateModulEv({
      energiaDobowaEvKwh: 10,
      nadwyzkaPvLatemKwh: 12,
      nadwyzkaPvZimaKwh: 3,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.pokryteLatem).toBe(true)
    expect(result.value.brakLatemKwh).toBe(0)
    expect(result.value.pokryteZima).toBe(false)
    expect(result.value.brakZimaKwh).toBeCloseTo(7, 9)
  })

  it("VALID — pokryte w obu sezonach", () => {
    const result = calculateModulEv({
      energiaDobowaEvKwh: 5,
      nadwyzkaPvLatemKwh: 10,
      nadwyzkaPvZimaKwh: 6,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pokryteLatem).toBe(true)
    expect(result.value.pokryteZima).toBe(true)
  })

  it("zima bez żadnej nadwyżki PV (0 kWh) — legalna wartość, cały brak liczony", () => {
    const result = calculateModulEv({
      energiaDobowaEvKwh: 8,
      nadwyzkaPvLatemKwh: 8,
      nadwyzkaPvZimaKwh: 0,
    })
    expect(result.value.brakZimaKwh).toBe(8)
    expect(result.value.pokryteZima).toBe(false)
  })

  it("INCOMPLETE — nadwyżka zimowa jeszcze nie wpisana (null)", () => {
    const result = calculateModulEv({
      energiaDobowaEvKwh: 10,
      nadwyzkaPvLatemKwh: 12,
      nadwyzkaPvZimaKwh: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna energia EV", () => {
    const result = calculateModulEv({
      energiaDobowaEvKwh: -1,
      nadwyzkaPvLatemKwh: 12,
      nadwyzkaPvZimaKwh: 3,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
