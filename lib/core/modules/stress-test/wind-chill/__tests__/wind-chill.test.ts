import { describe, expect, it } from "vitest"
import { calculateWindChill } from "../calculator"

describe("calculateWindChill", () => {
  it("-10°C, 40 km/h -> -20,77°C (zweryfikowane niezależnie w Node, zgodne z przykładem źródła '-20°C')", () => {
    const result = calculateWindChill({ temperaturaC: -10, predkoscWiatruKmh: 40 })
    expect(result.status).toBe("VALID")
    expect(result.value.temperaturaOdczuwalnaC).toBeCloseTo(-20.765268854802784, 9)
  })

  it("-20°C, 30 km/h -> -32,57°C (zweryfikowane niezależnie w Node)", () => {
    const result = calculateWindChill({ temperaturaC: -20, predkoscWiatruKmh: 30 })
    expect(result.value.temperaturaOdczuwalnaC).toBeCloseTo(-32.56804447632105, 9)
  })

  it("0°C, 20 km/h -> -5,24°C (zweryfikowane niezależnie w Node)", () => {
    const result = calculateWindChill({ temperaturaC: 0, predkoscWiatruKmh: 20 })
    expect(result.value.temperaturaOdczuwalnaC).toBeCloseTo(-5.242223279780932, 9)
  })

  it("temperatura powyżej progu (15°C) -> OUT_OF_SCOPE, POZA-ZAKRESEM-WZORU-WIND-CHILL", () => {
    const result = calculateWindChill({ temperaturaC: 15, predkoscWiatruKmh: 20 })
    expect(result.status).toBe("OUT_OF_SCOPE")
    const w = result.warnings[0]
    expect(w.code).toBe("POZA-ZAKRESEM-WZORU-WIND-CHILL")
    expect(w.message).toBeUndefined()
  })

  it("wiatr poniżej progu ważności wzoru (2 km/h) -> OUT_OF_SCOPE", () => {
    const result = calculateWindChill({ temperaturaC: -5, predkoscWiatruKmh: 2 })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("temperatura dokładnie na progu (10°C) -> jeszcze VALID (próg włączny)", () => {
    const result = calculateWindChill({ temperaturaC: 10, predkoscWiatruKmh: 20 })
    expect(result.status).toBe("VALID")
  })

  it("prędkość wiatru ujemna -> INVALID_INPUT, bez message", () => {
    const result = calculateWindChill({ temperaturaC: -10, predkoscWiatruKmh: -5 })
    expect(result.status).toBe("INVALID_INPUT")
    const w = result.warnings[0]
    expect(w.i18nKey).toBe("WARTOSC-UJEMNA")
    expect(w.message).toBeUndefined()
  })

  it("temperatura=null (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateWindChill({ temperaturaC: null, predkoscWiatruKmh: 20 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("prędkość wiatru=0 (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateWindChill({ temperaturaC: -10, predkoscWiatruKmh: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("assumptions — WIND-CHILL-WZOR-NWS, bez params, bez message", () => {
    const result = calculateWindChill({ temperaturaC: -10, predkoscWiatruKmh: 40 })
    expect(result.assumptions).toEqual([{ kod: "WIND-CHILL-WZOR-NWS" }])
  })
})
