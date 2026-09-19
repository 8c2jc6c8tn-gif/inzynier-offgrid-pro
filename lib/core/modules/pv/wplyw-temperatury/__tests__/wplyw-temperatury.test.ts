import { describe, expect, it } from "vitest"
import { calculateWplywTemperatury } from "../calculator"

describe("calculateWplywTemperatury", () => {
  it("przykład źródła: 35°C + przyrost 25°C -> panel 60°C, γ=-0,43 -> strata ok. 15%", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: 35,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.43,
      mocNominalnaW: 450,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.temperaturaPanelaC).toBe(60)
    expect(result.value.strataPct).toBeCloseTo(15.05, 6)
    expect(result.value.mocRzeczywistaW).toBeCloseTo(450 * 0.8495, 6)
  })

  it("temperatura referencyjna STC (panel=25°C) -> brak straty, moc = nominalna", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: 0,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.4,
      mocNominalnaW: 400,
    })
    expect(result.value.temperaturaPanelaC).toBe(25)
    expect(result.value.strataPct).toBeCloseTo(0, 9)
    expect(result.value.mocRzeczywistaW).toBeCloseTo(400, 9)
  })

  it("zimny dzień (panel < 25°C) -> ujemna strata, czyli zysk mocy", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: -10,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.4,
      mocNominalnaW: 400,
    })
    expect(result.value.temperaturaPanelaC).toBe(15)
    expect(result.value.strataPct).toBeLessThan(0)
    expect(result.value.mocRzeczywistaW).toBeGreaterThan(400)
  })

  it("INCOMPLETE — temperatura otoczenia jeszcze nie wpisana (null)", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: null,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.4,
      mocNominalnaW: 400,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc nominalna", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: 35,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.4,
      mocNominalnaW: -100,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): UTRATA-MOCY ma i18nKey+params, assumption to {kod}", () => {
    const result = calculateWplywTemperatury({
      temperaturaOtoczeniaC: 35,
      przyrostTemperaturyC: 25,
      gammaPctNaC: -0.43,
      mocNominalnaW: 450,
    })
    expect(result.warnings[0].i18nKey).toBe("UTRATA-MOCY")
    expect(result.warnings[0].params).toEqual({ temperatura: "60", strata: "15.0" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "PRZYROST-TEMP-I-GAMMA-RECZNIE" }])
  })
})
