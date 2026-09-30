import { describe, expect, it } from "vitest"
import { calculatePanelKampera } from "../calculator"

// Test values only — the user enters datasheet data of specific panels (Directive #1).
const BAZA = {
  elastycznyMocW: 100,
  elastycznyMasaKg: 2,
  elastycznyCenaZl: 500,
  elastycznyGwarancjaLat: 5,
  sztywnyMocW: 100,
  sztywnyMasaKg: 8,
  sztywnyCenaZl: 400,
  sztywnyGwarancjaLat: 25,
  elastycznyBezSzczeliny: false,
}

describe("calculatePanelKampera (M12/E18, dawne 8.38)", () => {
  it("W/kg, zł/W i zł/(W·rok) dla obu paneli", () => {
    const w = calculatePanelKampera(BAZA)
    expect(w.value.elastyczny).toEqual({ wNaKg: 50, zlNaW: 5, zlNaWRok: 1 })
    expect(w.value.sztywny).toEqual({ wNaKg: 12.5, zlNaW: 4, zlNaWRok: 0.16 })
    expect(w.status).toBe("VALID")
  })

  it("elastyczny przyklejony bez szczeliny → 🟡", () => {
    const w = calculatePanelKampera({ ...BAZA, elastycznyBezSzczeliny: true })
    expect(w.warnings.map((x) => x.code)).toContain("PK-ELASTYCZNY-BEZ-WENTYLACJI")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak odpowiedzi o montażu albo danych → INCOMPLETE; ujemna cena → INVALID_INPUT", () => {
    expect(calculatePanelKampera({ ...BAZA, elastycznyBezSzczeliny: null }).status).toBe("INCOMPLETE")
    expect(calculatePanelKampera({ ...BAZA, sztywnyMasaKg: 0 }).status).toBe("INCOMPLETE")
    expect(calculatePanelKampera({ ...BAZA, sztywnyCenaZl: -1 }).status).toBe("INVALID_INPUT")
  })
})
