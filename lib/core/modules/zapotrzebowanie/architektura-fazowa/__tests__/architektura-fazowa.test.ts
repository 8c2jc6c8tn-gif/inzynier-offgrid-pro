import { describe, expect, it } from "vitest"
import { calculateArchitekturaFazowa } from "../calculator"

describe("calculateArchitekturaFazowa", () => {
  it("przykład źródła (L1=4200W, L2=L3=2000W) -> suma 8200W, asymetria ~52,4%", () => {
    const result = calculateArchitekturaFazowa({ mocL1W: 4200, mocL2W: 2000, mocL3W: 2000 })
    expect(result.value.sumaW).toBe(8200)
    expect(result.value.maxFazaW).toBe(4200)
    expect(result.value.minFazaW).toBe(2000)
    expect(result.value.asymetriaPct).toBeCloseTo(52.38095238095238, 6)
    expect(result.status).toBe("VALID")
    expect(result.warnings).toEqual([])
  })

  it("obciążenie równe na wszystkich fazach -> asymetria 0%", () => {
    const result = calculateArchitekturaFazowa({ mocL1W: 2000, mocL2W: 2000, mocL3W: 2000 })
    expect(result.value.asymetriaPct).toBe(0)
  })

  it("instalacja 1-fazowa (całość na L1) -> asymetria 100%", () => {
    const result = calculateArchitekturaFazowa({ mocL1W: 3000, mocL2W: 0, mocL3W: 0 })
    expect(result.value.asymetriaPct).toBe(100)
    expect(result.status).toBe("VALID")
  })

  it("wartość ujemna -> INVALID_INPUT, bez message", () => {
    const result = calculateArchitekturaFazowa({ mocL1W: -100, mocL2W: 0, mocL3W: 0 })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("wszystkie fazy = 0 (jeszcze nie wpisano) -> INCOMPLETE", () => {
    const result = calculateArchitekturaFazowa({ mocL1W: 0, mocL2W: 0, mocL3W: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })
})
