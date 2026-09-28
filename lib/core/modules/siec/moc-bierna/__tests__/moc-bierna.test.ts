import { describe, expect, it } from "vitest"
import { calculateMocBierna, czynnikMocyBiernej } from "../calculator"
import type { MocBiernaInput } from "../input"

const baza: MocBiernaInput = {
  tgFi: 0.5,
  tgFi0: 0.4,
  energiaCzynnaKwh: 100000,
  cRkZlKwh: 0.5,
  energiaPojemnosciowaKvarh: 0,
  mocCzynnaSredniaKw: 0,
  tgFiCel: null,
  kosztBateriiZl: 0,
}

describe("calculateMocBierna — F3, ✏️ K1", () => {
  it("przykład kontrolny M14: tgφ 0,5, tgφ₀ 0,4 → czynnik 0,0381 (wzór materiału bez √ dawał 0,0776)", () => {
    expect(czynnikMocyBiernej(0.5, 0.4)).toBeCloseTo(0.0381, 4)
    expect(1.25 / 1.16 - 1).toBeCloseTo(0.0776, 4)
  })

  it("czynnik nie zależy od C_rk — pokazany także bez niego (INCOMPLETE dla kwoty)", () => {
    const r = calculateMocBierna({ ...baza, cRkZlKwh: null })
    expect(r.status).toBe("INCOMPLETE")
    expect(r.value.czynnik).toBeCloseTo(0.0381, 4)
    expect(r.value.oplataIndukcyjnaZl).toBeNull()
  })

  it("opłata = k (3,00 nN) × C_rk × czynnik × A", () => {
    const r = calculateMocBierna(baza)
    expect(r.value.oplataIndukcyjnaZl).toBeCloseTo(3 * 0.5 * czynnikMocyBiernej(0.5, 0.4) * 100000, 9)
  })

  it("tgφ ≤ tgφ₀ → brak opłaty", () => {
    expect(calculateMocBierna({ ...baza, tgFi: 0.3 }).value.oplataIndukcyjnaZl).toBe(0)
  })

  it("energia pojemnościowa rozliczana w całości: k × C_rk × E_b + ostrzeżenie", () => {
    const r = calculateMocBierna({ ...baza, tgFi: 0.3, energiaPojemnosciowaKvarh: 1000 })
    expect(r.value.oplataPojemnosciowaZl).toBeCloseTo(3 * 0.5 * 1000, 9)
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-PRZEKOMPENSOWANIE")
  })

  it("kompensacja: Q_C = P (tgφ − tgφ_cel), zwrot = koszt / opłata roczna", () => {
    const r = calculateMocBierna({ ...baza, mocCzynnaSredniaKw: 50, tgFiCel: 0.25, kosztBateriiZl: 5000 })
    expect(r.value.mocKompensacjiKvar).toBeCloseTo(12.5, 9)
    expect(r.value.zwrotLat).toBeCloseTo(5000 / r.value.oplataIndukcyjnaZl!, 9)
  })

  it("tgφ₀ < 0,2 → INVALID_INPUT", () => {
    expect(calculateMocBierna({ ...baza, tgFi0: 0.15 }).warnings[0].code).toBe("SIEC-TGFI0-PONIZEJ-MINIMUM")
  })
})
