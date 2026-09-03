import { describe, expect, it } from "vitest"
import { calculateDoborPojemnosci } from "../calculator"

describe("calculateDoborPojemnosci", () => {
  it("odtwarza przykład źródła Sekcja C dokładnie (12 kWh/dobę, 3 dni, DoD 80%, sprawność 100% -> 45 kWh)", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 12,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 100,
      dodPct: 80,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pojemnoscUzytecznaKwh).toBeCloseTo(45, 9)
  })

  it("te same dane z domyślną sprawnością 95% (nie 100%) -> 900/19 ≈ 47,368421 kWh, zweryfikowane niezależnie ułamkiem", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 12,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.value.pojemnoscUzytecznaKwh).toBeCloseTo(900 / 19, 9)
    expect(result.value.pojemnoscUzytecznaKwh).toBeCloseTo(47.368421052631575, 9)
  })

  it("przypadek graniczny: sprawność=100%, DoD=100% -> pojemność użyteczna = zapotrzebowanie × dni (brak strat)", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 10,
      dniAutonomii: 5,
      sprawnoscFalownikaPct: 100,
      dodPct: 100,
    })
    expect(result.value.pojemnoscUzytecznaKwh).toBeCloseTo(50, 9)
  })

  it("zapotrzebowanie ujemne -> status INVALID_INPUT", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: -1,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("DoD poza zakresem (>100%) -> status INVALID_INPUT", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 12,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 150,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (same zera) -> status INCOMPLETE", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 0,
      dniAutonomii: 0,
      sprawnoscFalownikaPct: 0,
      dodPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("częściowo wypełnione (DoD wciąż 0) -> status INCOMPLETE, nie dzielenie przez zero", () => {
    const result = calculateDoborPojemnosci({
      zapotrzebowanieDoboweKwh: 12,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })
})
