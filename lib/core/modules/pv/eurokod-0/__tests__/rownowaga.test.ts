import { describe, expect, it } from "vitest"
import { balastProjektowyEquKg, GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../rownowaga"

describe("PN-EN 1990 — EQU (Tablica A1.2(A), wartości zalecane, NB bez zmian krajowych)", () => {
  it("współczynniki częściowe zweryfikowane z oryginałem: γG,inf = 0,90, γQ,1 = 1,50", () => {
    expect(GAMMA_G_INF_EQU).toBe(0.9)
    expect(GAMMA_Q_EQU).toBe(1.5)
  })

  // Reference computed independently in Python (Directive #3): 1.5 × 1000 / (0.9 × 9.80665).
  it("1000 N oderwania → 169,953 kg balastu projektowego (1,667 × F/g)", () => {
    expect(balastProjektowyEquKg(1000, 9.80665)).toBeCloseTo(169.95270216298806, 9)
  })

  it("liniowe względem siły, zero siły → zero balastu", () => {
    expect(balastProjektowyEquKg(0, 9.80665)).toBe(0)
    expect(balastProjektowyEquKg(2000, 9.80665)).toBeCloseTo(2 * balastProjektowyEquKg(1000, 9.80665), 9)
  })

  // D29: panels + frame as a stabilising permanent action with the same γG,inf — reference in Python:
  // 1.5 × 1000 / (0.9 × 9.80665) − 50 = 119.95270216298806.
  it("masa paneli i stelaża odejmuje się od balastu (ten sam γG,inf)", () => {
    expect(balastProjektowyEquKg(1000, 9.80665, 50)).toBeCloseTo(119.95270216298806, 9)
    expect(balastProjektowyEquKg(1000, 9.80665, 0)).toBe(balastProjektowyEquKg(1000, 9.80665))
  })

  it("masa własna większa niż potrzebna → balast 0, nigdy ujemny", () => {
    expect(balastProjektowyEquKg(1000, 9.80665, 200)).toBe(0)
    expect(balastProjektowyEquKg(1000, 9.80665, 169.95270216298806)).toBeCloseTo(0, 9)
  })
})
