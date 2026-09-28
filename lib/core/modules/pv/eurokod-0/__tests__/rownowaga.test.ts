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

  // D29 (28.09.2026): self-weight of panels and frame as a favourable permanent action (γG,inf).
  // Reference in Python: 1.5 × 1000 / (0.9 × 9.80665) − 40; max(0, … − 200).
  it("masa własna 40 kg odejmuje się od masy wymaganej → 129,953 kg balastu dodatkowego", () => {
    expect(balastProjektowyEquKg(1000, 9.80665, 40)).toBeCloseTo(129.95270216298806, 9)
  })

  it("masa własna większa niż wymagana → balast dodatkowy 0 (nie ujemny)", () => {
    expect(balastProjektowyEquKg(1000, 9.80665, 200)).toBe(0)
  })
})
