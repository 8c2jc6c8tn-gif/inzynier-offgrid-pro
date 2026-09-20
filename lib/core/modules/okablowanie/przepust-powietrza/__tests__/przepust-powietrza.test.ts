import { describe, expect, it } from "vitest"
import { calculatePrzepustPowietrza } from "../calculator"

describe("calculatePrzepustPowietrza", () => {
  it("przykład źródła: szczelina <5cm -> strata ok. 18%", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: 3 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.klasyfikacja).toBe("krytyczna")
    expect(result.value.strataOrientacyjnaPct).toBeCloseTo(18, 9)
    expect(result.warnings.some((w) => w.code === "SZCZELINA-KRYTYCZNA")).toBe(true)
  })

  it("szczelina >=15cm -> bezpieczna, VALID", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: 15 })
    expect(result.status).toBe("VALID")
    expect(result.value.klasyfikacja).toBe("bezpieczna")
    expect(result.value.strataOrientacyjnaPct).toBeNull()
  })

  it("szczelina pośrednia (5-15cm) -> brak danych źródła, ostrzeżenie nie krytyczne", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: 10 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.klasyfikacja).toBe("posrednia")
    expect(result.value.strataOrientacyjnaPct).toBeNull()
    const w = result.warnings.find((x) => x.code === "SZCZELINA-POSREDNIA-BRAK-DANYCH")
    expect(w?.level).toBe("warning")
  })

  it("INCOMPLETE — szczelina niepodana", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: null })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna szczelina", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: -2 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("granica dokładnie 5cm liczy się jako pośrednia (< nie <=)", () => {
    const result = calculatePrzepustPowietrza({ szczelinaCm: 5 })
    expect(result.value.klasyfikacja).toBe("posrednia")
  })
})
