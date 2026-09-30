import { describe, expect, it } from "vitest"
import { calculateAkumulatorSamochodowy } from "../calculator"

const BAZA = { typ: "rozruchowy" as const, pojemnoscAh: 60, napiecieV: 12, uzytecznaPct: 50, mocW: 50, planowanyCzasH: 0 }

describe("calculateAkumulatorSamochodowy (M12/E16, dawne 8.14)", () => {
  it("przykład Biblii §12.14: 60 Ah rozruchowy, 50% = 30 Ah, lodówka 50 W (4,17 A) → 7,2 h (Python: 30/(50/12) = 7.2)", () => {
    const w = calculateAkumulatorSamochodowy(BAZA)
    expect(w.value.pojemnoscUzytecznaAh).toBeCloseTo(30, 12)
    expect(w.value.pradA).toBeCloseTo(50 / 12, 12)
    expect(w.value.czasH).toBeCloseTo(7.2, 12)
    expect(w.value.energiaUzytecznaWh).toBeCloseTo(360, 12)
  })

  it("rozruchowy zawsze 🟡 (nie do głębokiego rozładowania), bez planu — bez 🔴", () => {
    const w = calculateAkumulatorSamochodowy(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["AS-ROZRUCHOWY-NIE-DO-GLEBOKIEGO"])
    expect(w.warnings[0]!.level).toBe("warning")
  })

  it("🔴 rozruchowy: plan 10 h > 7,2 h", () => {
    const w = calculateAkumulatorSamochodowy({ ...BAZA, planowanyCzasH: 10 })
    const stop = w.warnings.find((x) => x.code === "AS-ROZRUCHOWY-PONAD-UZYTECZNA")
    expect(stop?.level).toBe("critical")
  })

  it("rozruchowy: plan 7 h ≤ 7,2 h — bez 🔴", () => {
    const w = calculateAkumulatorSamochodowy({ ...BAZA, planowanyCzasH: 7 })
    expect(w.warnings.some((x) => x.level === "critical")).toBe(false)
  })

  it("AGM: plan ponad część użyteczną → 🟡, nie 🔴; bez planu → VALID", () => {
    const agm = { ...BAZA, typ: "agm" as const, pojemnoscAh: 100, uzytecznaPct: 50 }
    expect(calculateAkumulatorSamochodowy(agm).status).toBe("VALID")
    const w = calculateAkumulatorSamochodowy({ ...agm, planowanyCzasH: 20 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["AS-PONAD-UZYTECZNA", "warning"]])
  })

  it("brak typu albo pola = 0 → INCOMPLETE", () => {
    expect(calculateAkumulatorSamochodowy({ ...BAZA, typ: null }).status).toBe("INCOMPLETE")
    expect(calculateAkumulatorSamochodowy({ ...BAZA, mocW: 0 }).status).toBe("INCOMPLETE")
  })

  it("ujemna wartość i procent > 100 → INVALID_INPUT", () => {
    const w = calculateAkumulatorSamochodowy({ ...BAZA, mocW: -1, uzytecznaPct: 120 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.code)).toEqual(["M12-WARTOSC-UJEMNA", "M12-PROCENT-POZA-ZAKRESEM"])
  })
})
