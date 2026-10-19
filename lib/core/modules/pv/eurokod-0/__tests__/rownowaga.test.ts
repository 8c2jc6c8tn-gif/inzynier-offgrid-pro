import { describe, expect, it } from "vitest"
import { balastPrzesuwuEquKg, balastPrzewracaniaEquKg, balastProjektowyEquKg, GAMMA_G_INF_EQU, GAMMA_Q_EQU } from "../rownowaga"

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

describe("PN-EN 1990 — EQU: przesuw i przewracanie (współczynniki jak przy oderwaniu; μ, h, b od użytkownika)", () => {
  // References computed independently in Python (Directive #3), g = 9,80665, Fh = 1000 N, Fv = 500 N.
  it("przesuw: μ = 0,5 → (1,5·(1000/0,5 + 500))/(0,9·g) = 424,88 kg", () => {
    expect(balastPrzesuwuEquKg(1000, 500, 0.5, 9.80665)).toBeCloseTo(424.88, 1)
  })

  it("przewracanie: h = 2 m, b = 1 m → (1,5·(500 + 2·1000·2/1))/(0,9·g) = 764,79 kg", () => {
    expect(balastPrzewracaniaEquKg(1000, 500, 2, 1, 9.80665)).toBeCloseTo(764.79, 1)
  })

  it("masa własna pomniejsza balast, nigdy poniżej zera", () => {
    expect(balastPrzesuwuEquKg(1000, 500, 0.5, 9.80665, 100)).toBeCloseTo(324.88, 1)
    expect(balastPrzesuwuEquKg(1000, 500, 0.5, 9.80665, 1e6)).toBe(0)
    expect(balastPrzewracaniaEquKg(1000, 500, 2, 1, 9.80665, 1e6)).toBe(0)
  })
})
