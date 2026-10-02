import { describe, expect, it } from "vitest"
import { calculateOsadNaPv } from "../calculator"
import type { OsadNaPvInput } from "../input"

const BAZA: OsadNaPvInput = {
  rodzaj: "sypki",
  katDeg: 10,
  produkcjaDobaKwh: 4,
  dniZalegania: 3,
  pozostalaProdukcjaPct: 0,
  nierownoStringi: false,
}

describe("calculateOsadNaPv (M7/E7 + E14, dawne 6.7, 6.20, 6.18)", () => {
  it("śnieg: produkcja 0% przez 3 dni → strata 3 × produkcja; kąt 10° → 🟡 nie zsunie się", () => {
    const w = calculateOsadNaPv(BAZA)
    expect(w.value.utrataKwh).toBeCloseTo(12, 12)
    expect(w.value.mozeZsunacSie).toBe(false)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["OSAD-SNIEG-NIE-ZSUNIE", "warning"]])
  })

  it("kąt > 30° → śnieg sypki może się zsunąć (ℹ️); 30° dokładnie → jeszcze nie", () => {
    const w = calculateOsadNaPv({ ...BAZA, katDeg: 35 })
    expect(w.value.mozeZsunacSie).toBe(true)
    expect(w.status).toBe("VALID")
    expect(calculateOsadNaPv({ ...BAZA, katDeg: 30 }).value.mozeZsunacSie).toBe(false)
  })

  it("szadź (Ekran 14): 5% produkcji przez 2 doby → strata 95%; 🟡 nie zsuwa się", () => {
    const w = calculateOsadNaPv({ ...BAZA, rodzaj: "szadz", katDeg: null, dniZalegania: 2, pozostalaProdukcjaPct: 5 })
    expect(w.value.utrataKwh).toBeCloseTo(7.6, 12)
    expect(w.value.produkcjaPodOsademKwh).toBeCloseTo(0.4, 12)
    expect(w.value.mozeZsunacSie).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["OSAD-SZADZ-NIE-ZSUWA"])
  })

  it("mokry, lód i nierówne stringi → 🟡", () => {
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: "mokry" }).warnings.map((x) => x.code)).toEqual(["OSAD-MOKRY-PRZYKLEJA"])
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: "lod", nierownoStringi: true }).warnings.map((x) => x.code)).toEqual([
      "OSAD-LOD-BLOKUJE",
      "OSAD-NIEROWNO-STRINGI",
    ])
  })

  it("brak danych → INCOMPLETE; procent > 100 albo kąt > 90 → INVALID_INPUT", () => {
    expect(calculateOsadNaPv({ ...BAZA, rodzaj: null }).status).toBe("INCOMPLETE")
    expect(calculateOsadNaPv({ ...BAZA, dniZalegania: 0 }).status).toBe("INCOMPLETE")
    expect(calculateOsadNaPv({ ...BAZA, pozostalaProdukcjaPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateOsadNaPv({ ...BAZA, katDeg: 95 }).warnings[0]!.code).toBe("OSAD-POZA-ZAKRESEM")
  })
})
