import { describe, expect, it } from "vitest"
import { calculateStratyOkablowanieDc } from "../calculator"

describe("calculateStratyOkablowanieDc", () => {
  it("przykład źródła: 30m, 15A, 4mm² -> strata 6% (przy Vmp=65,625V wyprowadzonym z przykładu)", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: 30,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 4,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.strataProcentowa).toBeCloseTo(6, 6)
  })

  it("przykład źródła: 30m, 15A, 6mm² -> strata 4%", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: 30,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 6,
    })
    expect(result.value.strataProcentowa).toBeCloseTo(4, 6)
  })

  it("przykład źródła: 30m, 15A, 10mm² -> strata 2,4% (poniżej celu 3% -> VALID)", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: 30,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 10,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.strataProcentowa).toBeCloseTo(2.4, 6)
  })

  it("porównanie przekrojów zawiera 4 standardowe wartości (4/6/10/16 mm²)", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: 30,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 4,
    })
    expect(result.value.porownaniePrzekrojow).toHaveLength(4)
    expect(result.value.porownaniePrzekrojow.map((p) => p.przekrojMm2)).toEqual([4, 6, 10, 16])
    expect(result.value.porownaniePrzekrojow[2].strataProcentowa).toBeCloseTo(2.4, 6)
  })

  it("INCOMPLETE — przekrój jeszcze nie wpisany", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: 30,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna długość kabla", () => {
    const result = calculateStratyOkablowanieDc({
      dlugoscKablaM: -10,
      pradA: 15,
      napiecieV: 65.625,
      przekrojMm2: 4,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
