import { describe, expect, it } from "vitest"
import { calculateModelSezonowyPompy } from "../calculator"

const pusty = Array<number | null>(12).fill(null)
const zMiesiacami = (wartosci: Record<number, number>) => pusty.map((x, i) => wartosci[i + 1] ?? x)

describe("model sezonowy pompy ciepła (dawne 5.64 + 5.43)", () => {
  it("E = Q/COP per miesiąc, SCOP = ΣQ/ΣE; styczeń największy (31 dni → kWh/dobę)", () => {
    const r = calculateModelSezonowyPompy({
      cieploKwh: zMiesiacami({ 1: 2400, 2: 2000, 12: 2200 }),
      cop: zMiesiacami({ 1: 3, 2: 3.2, 12: 3.1 }),
      scopKatalogowy: 0,
    })
    expect(r.status).toBe("VALID")
    expect(r.value.miesiace.map((m) => m.miesiac)).toEqual([1, 2, 12])
    expect(r.value.energiaSumaKwh).toBeCloseTo(800 + 625 + 2200 / 3.1, 9)
    expect(r.value.scopRealny).toBeCloseTo(6600 / r.value.energiaSumaKwh, 9)
    expect(r.value.najwiekszyMiesiac).toBe(1)
    expect(r.value.miesiace[0]!.energiaDobaKwh).toBeCloseTo(800 / 31, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["MSP-ZIMA-ZAPAS"])
  })

  it("SCOP katalogowy 4,5 vs realny 3,0 → ℹ️ niższy o 33,3%", () => {
    const r = calculateModelSezonowyPompy({ cieploKwh: zMiesiacami({ 1: 3000 }), cop: zMiesiacami({ 1: 3 }), scopKatalogowy: 4.5 })
    expect(r.value.roznicaScopPct).toBeCloseTo((3 / 4.5 - 1) * 100, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["MSP-ZIMA-ZAPAS", "MSP-SCOP-NIZSZY"])
  })

  it("miesiąc z ciepłem bez COP → INCOMPLETE; brak miesięcy → INCOMPLETE; COP < 1 albo ujemne ciepło → INVALID_INPUT", () => {
    expect(calculateModelSezonowyPompy({ cieploKwh: zMiesiacami({ 1: 3000 }), cop: pusty, scopKatalogowy: 0 }).status).toBe("INCOMPLETE")
    expect(calculateModelSezonowyPompy({ cieploKwh: pusty, cop: pusty, scopKatalogowy: 0 }).status).toBe("INCOMPLETE")
    expect(calculateModelSezonowyPompy({ cieploKwh: zMiesiacami({ 1: 3000 }), cop: zMiesiacami({ 1: 0.5 }), scopKatalogowy: 0 }).status).toBe(
      "INVALID_INPUT",
    )
    expect(calculateModelSezonowyPompy({ cieploKwh: zMiesiacami({ 1: -1 }), cop: zMiesiacami({ 1: 3 }), scopKatalogowy: 0 }).status).toBe(
      "INVALID_INPUT",
    )
  })
})
