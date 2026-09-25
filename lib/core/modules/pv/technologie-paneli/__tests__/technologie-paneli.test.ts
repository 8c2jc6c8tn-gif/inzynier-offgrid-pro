import { describe, expect, it } from "vitest"
import { calculateTechnologiePaneli, obliczPowierzchnieM2 } from "../calculator"
import { validateInput } from "../validation"
import { TECHNOLOGIE_KRYSTALICZNE } from "../constants"

// Wartości referencyjne policzone niezależnie (Python, 25.09.2026): A = P×1000 / (η×1000 W/m²).
// 4 kWp: η=20% → 20,0 m²; 21% → 19,0476; 22% → 18,1818; 23% → 17,3913; 19% → 21,0526; 12% → 33,3333; 15% → 26,6667.

describe("obliczPowierzchnieM2", () => {
  it("1 kWp przy 20% → 5 m² (definicja STC 1000 W/m²)", () => {
    expect(obliczPowierzchnieM2(1, 20)).toBeCloseTo(5, 9)
  })
})

describe("calculateTechnologiePaneli (M3/E15)", () => {
  it("nominalny 4 kWp: powierzchnie krystalicznych zgodne z przeliczeniem kontrolnym", () => {
    const wynik = calculateTechnologiePaneli({ mocInstalacjiKwp: 4 })
    expect(wynik.status).toBe("VALID")
    const po = Object.fromEntries(wynik.value.krystaliczne.map((r) => [r.id, r]))
    expect(po.perc.powierzchniaMaxM2).toBeCloseTo(20, 4)
    expect(po["half-cut"].powierzchniaMaxM2).toBeCloseTo(19.0476, 4)
    expect(po.topcon.powierzchniaMaxM2).toBeCloseTo(18.1818, 4)
    expect(po.hjt.powierzchniaMaxM2).toBeCloseTo(17.3913, 4)
    expect(wynik.assumptions).toEqual([
      { kod: "TECHNOLOGIE-POWIERZCHNIA-MODULOW" },
      { kod: "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA" },
    ])
  })

  it("HJT „23%+” (przedział otwarty) → brak dolnej granicy powierzchni (null), nie zgadywana", () => {
    const hjt = calculateTechnologiePaneli({ mocInstalacjiKwp: 4 }).value.krystaliczne.find((r) => r.id === "hjt")
    expect(hjt?.powierzchniaMinM2).toBeNull()
  })

  it("grupy §3.43: krystaliczne 19–22% i cienkowarstwowe 12–15% → przedziały powierzchni", () => {
    const po = Object.fromEntries(calculateTechnologiePaneli({ mocInstalacjiKwp: 4 }).value.grupy.map((r) => [r.id, r]))
    expect(po.krystaliczne.powierzchniaMinM2).toBeCloseTo(18.1818, 4)
    expect(po.krystaliczne.powierzchniaMaxM2).toBeCloseTo(21.0526, 4)
    expect(po.cienkowarstwowe.powierzchniaMinM2).toBeCloseTo(26.6667, 4)
    expect(po.cienkowarstwowe.powierzchniaMaxM2).toBeCloseTo(33.3333, 4)
  })

  it("dane źródła: degradacja roczna tylko PERC 0,5 i TOPCon 0,4 — reszta null (nie zgadywana)", () => {
    expect(TECHNOLOGIE_KRYSTALICZNE.map((t) => [t.id, t.degradacjaRocznaPct])).toEqual([
      ["perc", 0.5],
      ["half-cut", null],
      ["topcon", 0.4],
      ["hjt", null],
    ])
  })

  it("wartość graniczna: 0,1 kWp → 0,5 m² dla PERC, bez NaN", () => {
    const perc = calculateTechnologiePaneli({ mocInstalacjiKwp: 0.1 }).value.krystaliczne[0]
    expect(perc.powierzchniaMaxM2).toBeCloseTo(0.5, 9)
  })

  it("brak danych (0 kWp) → INCOMPLETE, pusty wynik", () => {
    const wynik = calculateTechnologiePaneli({ mocInstalacjiKwp: 0 })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.value.krystaliczne).toEqual([])
  })

  it("ujemna moc → INVALID_INPUT; K3: validateInput zgłasza tylko dla ujemnych", () => {
    expect(calculateTechnologiePaneli({ mocInstalacjiKwp: -1 }).status).toBe("INVALID_INPUT")
    expect(validateInput({ mocInstalacjiKwp: -1 }).errors.map((e) => e.code)).toEqual(["WARTOSC-UJEMNA"])
    expect(validateInput({ mocInstalacjiKwp: 0 }).errors).toEqual([])
  })
})
