import { describe, expect, it } from "vitest"
import { calculateOchronaStringow } from "../calculator"

describe("calculateOchronaStringow", () => {
  it("przykład źródła: Isc=12A -> bezpiecznik 15A", () => {
    const result = calculateOchronaStringow({
      iscA: 12,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.bezpiecznikA).toBeCloseTo(15, 9)
    expect(result.value.zabezpieczeniaObowiazkowe).toBe(false)
  })

  it("KRYTYCZNE — 3 stringi równoległe bez zabezpieczeń", () => {
    const result = calculateOchronaStringow({
      iscA: 12,
      liczbaStringowRownoleglych: 3,
      maZabezpieczeniaPerString: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zabezpieczeniaObowiazkowe).toBe(true)
    expect(result.warnings[0].code).toBe("BRAK-ZABEZPIECZEN-PRZY-3-STRINGACH")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("VALID — 3 stringi równoległe Z zabezpieczeniami, żadnego ostrzeżenia krytycznego", () => {
    const result = calculateOchronaStringow({
      iscA: 12,
      liczbaStringowRownoleglych: 3,
      maZabezpieczeniaPerString: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].level).toBe("info")
  })

  it("2 stringi bez zabezpieczeń — jeszcze nie obowiązkowe (próg to 3)", () => {
    const result = calculateOchronaStringow({
      iscA: 12,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
    })
    expect(result.value.zabezpieczeniaObowiazkowe).toBe(false)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — Isc jeszcze nie wpisany", () => {
    const result = calculateOchronaStringow({
      iscA: 0,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny Isc", () => {
    const result = calculateOchronaStringow({
      iscA: -5,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
