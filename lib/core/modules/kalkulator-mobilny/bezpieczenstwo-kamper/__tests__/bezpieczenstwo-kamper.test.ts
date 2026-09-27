import { describe, expect, it } from "vitest"
import { calculateBezpieczenstwoKamper } from "../calculator"

const WSZYSTKIE_OLOW = ["wentylacja", "mocowanie", "dostep", "wilgoc-temperatura", "oslona-zaciskow"]

describe("calculateBezpieczenstwoKamper (M12/E22, dawne 8.45)", () => {
  it("brak chemii → INCOMPLETE, pusta lista", () => {
    const w = calculateBezpieczenstwoKamper({ chemia: null, potwierdzoneIds: [] })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.value.razem).toBe(0)
  })

  it("kwasowy bez potwierdzonej wentylacji → ostrzeżenie 🟡 o wodorze (Biblia §12.33)", () => {
    const w = calculateBezpieczenstwoKamper({ chemia: "kwasowy", potwierdzoneIds: ["mocowanie"] })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.value).toMatchObject({ potwierdzone: 1, razem: 5 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["BK-OLOW-BEZ-WENTYLACJI", "warning"]])
  })

  it("AGM komplet → VALID, bez ostrzeżeń", () => {
    const w = calculateBezpieczenstwoKamper({ chemia: "AGM", potwierdzoneIds: WSZYSTKIE_OLOW })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("LiFePO4: bez pozycji wentylacji (4 pozycje), info „można wewnątrz, stabilnie zamocowany”", () => {
    const w = calculateBezpieczenstwoKamper({ chemia: "LiFePO4", potwierdzoneIds: WSZYSTKIE_OLOW })
    expect(w.value.razem).toBe(4)
    expect(w.value.potwierdzone).toBe(4)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["BK-LIFEPO4-WEWNATRZ", "info"]])
  })

  it("nieznane id ignorowane", () => {
    expect(calculateBezpieczenstwoKamper({ chemia: "LiFePO4", potwierdzoneIds: ["xyz"] }).value.potwierdzone).toBe(0)
  })
})
