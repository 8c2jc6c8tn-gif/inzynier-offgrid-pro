import { describe, expect, it } from "vitest"
import { calculateNiedopasowaniePaneli } from "../calculator"

describe("calculateNiedopasowaniePaneli", () => {
  it("przykład źródła: 400W/11A + 330W/9A, Vmp=40V -> 720W zamiast 730W, strata 1,4%", () => {
    const result = calculateNiedopasowaniePaneli({
      mocPanel1W: 400,
      impPanel1A: 11,
      mocPanel2W: 330,
      impPanel2A: 9,
      napiecieWspolneV: 40,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.mocTeoretycznaW).toBe(730)
    expect(result.value.mocRzeczywistaW).toBe(720)
    expect(result.value.strataPct).toBeCloseTo(1.36986301369863, 6)
    expect(result.value.roznicaMocyPct).toBeCloseTo(17.5, 6)
    expect(result.warnings[0].code).toBe("DUZA-ROZNICA-MOCY")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("mała różnica mocy (poniżej 10%) -> info, VALID", () => {
    const result = calculateNiedopasowaniePaneli({
      mocPanel1W: 400,
      impPanel1A: 11,
      mocPanel2W: 390,
      impPanel2A: 10.7,
      napiecieWspolneV: 36,
    })
    expect(result.value.roznicaMocyPct).toBeCloseTo(2.5, 6)
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].level).toBe("info")
  })

  it("umiarkowana różnica mocy (10-15%) -> warning", () => {
    const result = calculateNiedopasowaniePaneli({
      mocPanel1W: 400,
      impPanel1A: 11,
      mocPanel2W: 350,
      impPanel2A: 9.6,
      napiecieWspolneV: 38,
    })
    expect(result.value.roznicaMocyPct).toBeCloseTo(12.5, 6)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("INCOMPLETE — napięcie wspólne jeszcze nie wpisane", () => {
    const result = calculateNiedopasowaniePaneli({
      mocPanel1W: 400,
      impPanel1A: 11,
      mocPanel2W: 330,
      impPanel2A: 9,
      napiecieWspolneV: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc panelu", () => {
    const result = calculateNiedopasowaniePaneli({
      mocPanel1W: -400,
      impPanel1A: 11,
      mocPanel2W: 330,
      impPanel2A: 9,
      napiecieWspolneV: 40,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
