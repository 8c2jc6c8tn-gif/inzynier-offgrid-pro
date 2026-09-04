import { describe, expect, it } from "vitest"
import { calculateNapiecieSystemowe } from "../calculator"

describe("calculateNapiecieSystemowe", () => {
  it("przykład źródła: 4800W -> rekomendacja 48V, prąd 400A@12V i 100A@48V dokładnie", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 4800 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieRekomendowaneV).toBe(48)
    expect(result.value.pradPrzy12VA).toBeCloseTo(400, 9)
    expect(result.value.pradPrzy48VA).toBeCloseTo(100, 9)
    expect(result.value.pradPrzy24VA).toBeCloseTo(200, 9)
  })

  it("mała instalacja: 800W (<1000W) -> rekomendacja 12V", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 800 })
    expect(result.value.napiecieRekomendowaneV).toBe(12)
  })

  it("pasmo środkowe: 2000W -> rekomendacja 24V", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 2000 })
    expect(result.value.napiecieRekomendowaneV).toBe(24)
  })

  it("przypadek graniczny: dokładnie 1000W -> jeszcze 24V (próg to <1000W)", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 1000 })
    expect(result.value.napiecieRekomendowaneV).toBe(24)
  })

  it("przypadek graniczny: dokładnie 3000W -> jeszcze 24V (próg to >3000W)", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 3000 })
    expect(result.value.napiecieRekomendowaneV).toBe(24)
  })

  it("przypadek graniczny: 3000,01W -> już 48V", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 3000.01 })
    expect(result.value.napiecieRekomendowaneV).toBe(48)
  })

  it("INCOMPLETE — moc jeszcze nie wpisana", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc", () => {
    const result = calculateNapiecieSystemowe({ mocSzczytowaW: -100 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
