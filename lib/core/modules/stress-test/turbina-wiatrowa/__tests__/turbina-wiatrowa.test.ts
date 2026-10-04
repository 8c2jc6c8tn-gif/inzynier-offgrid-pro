import { describe, expect, it } from "vitest"
import { calculateTurbinaWiatrowa, gestoscRayleigha, mocPrzyPredkosci } from "../calculator"
import type { TurbinaWiatrowaInput } from "../input"

// Analytic case: P = 2 kW constant on [4, 8] m/s, 0 outside (cut-out = last point = 8 m/s).
// ∫ P f dv = 2·(F(8) − F(4)), the Rayleigh CDF F(v) = 1 − exp(−π v² / (4 v̄²)).
const F = (v: number, srednia: number) => 1 - Math.exp((-Math.PI * v * v) / (4 * srednia * srednia))

const STALA: TurbinaWiatrowaInput = {
  sredniaPredkoscMs: 6,
  krzywa: [
    { predkoscMs: 4, mocKw: 2 },
    { predkoscMs: 6, mocKw: 2 },
    { predkoscMs: 8, mocKw: 2 },
  ],
  predkoscWylaczeniaMs: 8,
  wspolczynnikDostepnosciStrat: 0.8,
}

describe("calculateTurbinaWiatrowa (M7/E16, dawne 6.24)", () => {
  it("przypadek analityczny: P=2 kW na [4, 8] m/s, v̄=6, A=0,8 → 24·0,8·2·(F(8) − F(4))", () => {
    const w = calculateTurbinaWiatrowa(STALA)
    const oczekiwana = 2 * (F(8, 6) - F(4, 6))
    expect(oczekiwana).toBeCloseTo(0.9157, 3) // sanity of the hand formula: 2·(F(8) − F(4))
    expect(w.value.calkaKw).toBeCloseTo(oczekiwana, 4)
    expect(w.value.energiaDobaKwh).toBeCloseTo(24 * 0.8 * oczekiwana, 3)
    expect(w.value.sredniaMocKw).toBeCloseTo(w.value.energiaDobaKwh / 24, 12)
  })

  it("powyżej ostatniego punktu moc ostatniego aż do prędkości wyłączenia: P=2 na [4, 25] → 2·(F(25) − F(4))", () => {
    const w = calculateTurbinaWiatrowa({ ...STALA, predkoscWylaczeniaMs: 25 })
    expect(w.value.calkaKw).toBeCloseTo(2 * (F(25, 6) - F(4, 6)), 4)
    // Above the cut-out nothing: the same table with cut-out 8 gives less energy.
    expect(w.value.calkaKw).toBeGreaterThan(calculateTurbinaWiatrowa(STALA).value.calkaKw)
  })

  it("normalizacja rozkładu: P=1 kW wszędzie (od 0 do 30 m/s) → całka ≈ 1, energia 24·A", () => {
    const w = calculateTurbinaWiatrowa({
      sredniaPredkoscMs: 6,
      krzywa: [
        { predkoscMs: 0, mocKw: 1 },
        { predkoscMs: 10, mocKw: 1 },
        { predkoscMs: 20, mocKw: 1 },
      ],
      predkoscWylaczeniaMs: 30,
      wspolczynnikDostepnosciStrat: 1,
    })
    expect(w.value.calkaKw).toBeCloseTo(1, 4)
    expect(w.value.energiaDobaKwh).toBeCloseTo(24, 3)
  })

  it("wartość oczekiwana prędkości: P(v)=v kW (0 → 30 m/s, liniowo) → całka = v̄ (własność rozkładu Rayleigha)", () => {
    const w = calculateTurbinaWiatrowa({
      sredniaPredkoscMs: 6,
      krzywa: [
        { predkoscMs: 0, mocKw: 0 },
        { predkoscMs: 15, mocKw: 15 },
        { predkoscMs: 30, mocKw: 30 },
      ],
      predkoscWylaczeniaMs: 30,
      wspolczynnikDostepnosciStrat: 1,
    })
    expect(w.value.calkaKw).toBeCloseTo(6, 3)
  })

  it("krzywa: 0 poniżej pierwszego punktu, interpolacja liniowa między, ostatnia moc do wyłączenia, 0 od wyłączenia", () => {
    const k = [
      { predkoscMs: 3, mocKw: 0 },
      { predkoscMs: 7, mocKw: 4 },
      { predkoscMs: 11, mocKw: 10 },
    ]
    expect(mocPrzyPredkosci(k, 2.9, 20)).toBe(0)
    expect(mocPrzyPredkosci(k, 5, 20)).toBeCloseTo(2, 12)
    expect(mocPrzyPredkosci(k, 9, 20)).toBeCloseTo(7, 12)
    expect(mocPrzyPredkosci(k, 15, 20)).toBe(10)
    expect(mocPrzyPredkosci(k, 20, 20)).toBe(0)
  })

  it("gęstość Rayleigha: f(v̄)=(π/2)/v̄·exp(−π/4) przy v=v̄", () => {
    expect(gestoscRayleigha(6, 6)).toBeCloseTo((Math.PI / 2 / 6) * Math.exp(-Math.PI / 4), 12)
  })

  it("ostrzeżenie informacyjne o średniej prędkości bez rozkładu + założenia", () => {
    const w = calculateTurbinaWiatrowa(STALA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["TURBW-SREDNIA-BEZ-ROZKLADU", "info"]])
    expect(w.assumptions).toEqual([{ kod: "TURBW-ZALOZENIE-RAYLEIGH" }, { kod: "TURBW-ZALOZENIE-KRZYWA-PRODUCENTA" }])
  })

  it("współczynnik A=0 → energia 0; A skaluje liniowo", () => {
    expect(calculateTurbinaWiatrowa({ ...STALA, wspolczynnikDostepnosciStrat: 0 }).value.energiaDobaKwh).toBe(0)
    const pol = calculateTurbinaWiatrowa({ ...STALA, wspolczynnikDostepnosciStrat: 0.4 }).value.energiaDobaKwh
    const caly = calculateTurbinaWiatrowa({ ...STALA, wspolczynnikDostepnosciStrat: 0.8 }).value.energiaDobaKwh
    expect(caly / pol).toBeCloseTo(2, 12)
  })

  it("INCOMPLETE: brak średniej, wyłączenia, współczynnika albo krzywej krótszej niż 3 punkty", () => {
    expect(calculateTurbinaWiatrowa({ ...STALA, sredniaPredkoscMs: 0 }).status).toBe("INCOMPLETE")
    expect(calculateTurbinaWiatrowa({ ...STALA, predkoscWylaczeniaMs: 0 }).status).toBe("INCOMPLETE")
    expect(calculateTurbinaWiatrowa({ ...STALA, wspolczynnikDostepnosciStrat: null }).status).toBe("INCOMPLETE")
    expect(calculateTurbinaWiatrowa({ ...STALA, krzywa: STALA.krzywa.slice(0, 2) }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: ujemna moc, A > 1, prędkości krzywej nie rosną, wyłączenie poniżej krzywej, wyłączenie > 100 m/s", () => {
    const kody = (i: TurbinaWiatrowaInput) => calculateTurbinaWiatrowa(i).warnings.map((x) => x.code)
    expect(kody({ ...STALA, krzywa: [{ predkoscMs: 4, mocKw: -1 }, ...STALA.krzywa.slice(1)] })).toContain("TURBW-WARTOSC-UJEMNA")
    expect(kody({ ...STALA, wspolczynnikDostepnosciStrat: 1.2 })).toContain("TURBW-WSPOLCZYNNIK-POZA-ZAKRESEM")
    expect(kody({ ...STALA, krzywa: [{ predkoscMs: 4, mocKw: 2 }, { predkoscMs: 4, mocKw: 2 }, { predkoscMs: 8, mocKw: 2 }] })).toContain("TURBW-KRZYWA-NIEROSNACA")
    expect(kody({ ...STALA, predkoscWylaczeniaMs: 7 })).toContain("TURBW-WYLACZENIE-PONIZEJ-KRZYWEJ")
    expect(kody({ ...STALA, predkoscWylaczeniaMs: 2500 })).toContain("TURBW-WYLACZENIE-POZA-ZAKRESEM")
    expect(calculateTurbinaWiatrowa({ ...STALA, predkoscWylaczeniaMs: 2500 }).status).toBe("INVALID_INPUT")
  })
})
