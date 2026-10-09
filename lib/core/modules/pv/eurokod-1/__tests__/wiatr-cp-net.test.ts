import { describe, expect, it } from "vitest"
import { GAMMA_G_SUP_STR, GAMMA_Q_STR, PSI0_WIATR, psi0Sniegu } from "../../eurokod-0/kombinacje"
import { cpNetWiatyJednospadowej } from "../wiatr"

describe("cpNetWiatyJednospadowej — Tablica 7.6, pola A/B/C (skan zweryfikowany wizualnie)", () => {
  it("α = 30° (węzeł tablicy): docisk A 2,2 i B 3,2; odrywanie — gorsze z φ = 0 i φ = 1: A −3,0, B −3,8 (C −3,6)", () => {
    expect(cpNetWiatyJednospadowej(30)).toEqual({ dociskSrodek: 2.2, dociskKrawedz: 3.2, odrywanieSrodek: 3.0, odrywanieKrawedz: 3.8 })
  })

  it("α = 0°: φ = 1 jest gorsze od φ = 0 w polu A (−1,5 wobec −0,6), a w polach B/C wynik to −2,2 (pole C, φ = 1)", () => {
    expect(cpNetWiatyJednospadowej(0)).toEqual({ dociskSrodek: 0.5, dociskKrawedz: 1.8, odrywanieSrodek: 1.5, odrywanieKrawedz: 2.2 })
  })

  it("α = 10°, pole A, φ = 1: wartość po poprawce AC:2009 (−1,6), nie z druku skanu (−2,1)", () => {
    expect(cpNetWiatyJednospadowej(10)!.odrywanieSrodek).toBe(1.6)
  })

  it("kąt między węzłami: gorszy z dwóch sąsiednich węzłów (12° → węzły 10° i 15°)", () => {
    // docisk A: max(1,2; 1,4) = 1,4; odrywanie A: max(1,6; 1,8) = 1,8
    expect(cpNetWiatyJednospadowej(12)).toMatchObject({ dociskSrodek: 1.4, odrywanieSrodek: 1.8 })
  })

  it("poza 0–30° norma nie podaje wartości: null (nie ekstrapoluję)", () => {
    expect(cpNetWiatyJednospadowej(30.1)).toBeNull()
    expect(cpNetWiatyJednospadowej(-1)).toBeNull()
    expect(cpNetWiatyJednospadowej(90)).toBeNull()
    expect(cpNetWiatyJednospadowej(Number.NaN)).toBeNull()
  })
})

describe("Eurokod 0 — stałe kombinacji STR (Tablice A1.1 i A1.2(B), wartości zalecane)", () => {
  it("γG,sup 1,35, γQ 1,5, ψ0 wiatru 0,6", () => {
    expect([GAMMA_G_SUP_STR, GAMMA_Q_STR, PSI0_WIATR]).toEqual([1.35, 1.5, 0.6])
  })

  it("ψ0 śniegu: 0,5 do 1000 m n.p.m. włącznie, 0,7 powyżej", () => {
    expect(psi0Sniegu(-5)).toBe(0.5)
    expect(psi0Sniegu(1000)).toBe(0.5)
    expect(psi0Sniegu(1000.5)).toBe(0.7)
  })
})
