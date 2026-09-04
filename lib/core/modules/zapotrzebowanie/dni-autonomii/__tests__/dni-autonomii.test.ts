import { describe, expect, it } from "vitest"
import { calculateDniAutonomii } from "../calculator"

describe("calculateDniAutonomii", () => {
  it("VALID — sam wybór dni autonomii, bez opcjonalnych pól (brak szacunku magazynu)", () => {
    const result = calculateDniAutonomii({
      dniAutonomii: 3,
      zapotrzebowanieDoboweKwh: 0,
      sprawnoscFalownikaPct: 0,
      dodPct: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.dniAutonomii).toBe(3)
    expect(result.value.pojemnoscUzytecznaSzacowanaKwh).toBeNull()
    expect(result.warnings).toHaveLength(0)
  })

  it("VALID — z opcjonalnymi polami, reużywa wzoru Moduł 4/Ekran 1 (12 kWh, 3 dni, 95%, 80% -> ~47,368 kWh)", () => {
    const result = calculateDniAutonomii({
      dniAutonomii: 3,
      zapotrzebowanieDoboweKwh: 12,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pojemnoscUzytecznaSzacowanaKwh).toBeCloseTo(47.368421052631575, 9)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].level).toBe("info")
  })

  it("INCOMPLETE — dni autonomii jeszcze nie wybrane", () => {
    const result = calculateDniAutonomii({
      dniAutonomii: 0,
      zapotrzebowanieDoboweKwh: 0,
      sprawnoscFalownikaPct: 0,
      dodPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemne zapotrzebowanie", () => {
    const result = calculateDniAutonomii({
      dniAutonomii: 3,
      zapotrzebowanieDoboweKwh: -5,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — DoD poza zakresem", () => {
    const result = calculateDniAutonomii({
      dniAutonomii: 3,
      zapotrzebowanieDoboweKwh: 12,
      sprawnoscFalownikaPct: 95,
      dodPct: 150,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
