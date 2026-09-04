import { describe, expect, it } from "vitest"
import { calculateSohPerOgniwo } from "../calculator"

describe("calculateSohPerOgniwo", () => {
  it("VALID — wzrost poniżej progu krytycznego", () => {
    const result = calculateSohPerOgniwo({ rezystancjaFabrycznaMOhm: 0.3, rezystancjaAktualnaMOhm: 0.36 })
    expect(result.status).toBe("VALID")
    expect(result.value.wzrostPct).toBeCloseTo(20, 6)
    expect(result.value.doWymiany).toBe(false)
  })

  it("VALID_WITH_WARNINGS — wzrost dokładnie na progu krytycznym (50%)", () => {
    const result = calculateSohPerOgniwo({ rezystancjaFabrycznaMOhm: 0.3, rezystancjaAktualnaMOhm: 0.45 })
    expect(result.value.wzrostPct).toBeCloseTo(50, 6)
    expect(result.value.doWymiany).toBe(true)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const w = result.warnings.find((w) => w.code === "OGNIWO-DO-WYMIANY")
    expect(w?.level).toBe("critical")
  })

  it("VALID_WITH_WARNINGS — wzrost powyżej progu", () => {
    const result = calculateSohPerOgniwo({ rezystancjaFabrycznaMOhm: 0.25, rezystancjaAktualnaMOhm: 0.71 })
    expect(result.value.wzrostPct).toBeCloseTo(184, 0)
    expect(result.value.doWymiany).toBe(true)
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateSohPerOgniwo({ rezystancjaFabrycznaMOhm: 0, rezystancjaAktualnaMOhm: 0.45 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystancja", () => {
    const result = calculateSohPerOgniwo({ rezystancjaFabrycznaMOhm: -0.3, rezystancjaAktualnaMOhm: 0.45 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
