import { describe, expect, it } from "vitest"
import { obciazenieSniegiemGruntuSk } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { calculateObciazenieDachuSniegiem } from "../calculator"
import type { ObciazenieDachuSniegiemInput } from "../input"

const BAZA: ObciazenieDachuSniegiemInput = {
  strefa: 2,
  wysokoscNpmM: 200,
  katDachuDeg: 0,
  ekspozycja: "normalny",
  barierkiLubAttyka: false,
  nosnoscDachuKnM2: 0,
  gruboscWarstwyCm: 0,
  rodzajSniegu: null,
}

const kody = (w: { warnings: { code: string }[] }) => w.warnings.map((x) => x.code)

describe("obciazenieSniegiemGruntuSk — Tablica NB.1 (PN-EN 1991-1-3, Załącznik krajowy)", () => {
  it("strefy stałe: 2 → 0,9, 4 → 1,6 niezależnie od wysokości", () => {
    expect(obciazenieSniegiemGruntuSk(2, 1000)).toBe(0.9)
    expect(obciazenieSniegiemGruntuSk(4, 0)).toBe(1.6)
  })

  it("strefa 1: 0,007A − 1,4 z minimum 0,70 (A = 300 → 0,70; A = 400 → 1,40)", () => {
    expect(obciazenieSniegiemGruntuSk(1, 300)).toBeCloseTo(0.7, 12)
    expect(obciazenieSniegiemGruntuSk(1, 400)).toBeCloseTo(1.4, 12)
  })

  it("strefa 3: 0,006A − 0,6 z minimum 1,2 (A = 300 → 1,2; A = 500 → 2,4)", () => {
    expect(obciazenieSniegiemGruntuSk(3, 300)).toBeCloseTo(1.2, 12)
    expect(obciazenieSniegiemGruntuSk(3, 500)).toBeCloseTo(2.4, 12)
  })

  it("strefa 5: 0,93·exp(0,00134A) z minimum 2,0 (A = 500 → 2,0; A = 900 → 3,106, Python)", () => {
    expect(obciazenieSniegiemGruntuSk(5, 500)).toBe(2.0)
    expect(obciazenieSniegiemGruntuSk(5, 900)).toBeCloseTo(3.1062906806555968, 12)
  })
})

describe("calculateObciazenieDachuSniegiem (M7/E23, dawne 6.34→7.32)", () => {
  it("dach płaski, strefa 2, teren normalny → s = 0,8 × 1 × 1 × 0,9 = 0,72 kN/m² ≈ 73,4 kg/m²", () => {
    const w = calculateObciazenieDachuSniegiem(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.sKnM2).toBeCloseTo(0.72, 12)
    expect(w.value.sKgM2).toBeCloseTo(73.41956733441084, 9)
    expect(w.value.wykorzystanieNormowePct).toBeNull()
    expect(kody(w)).toEqual(["SNIEG-BRAK-NOSNOSCI"])
  })

  it("dach 45°, strefa 4, teren osłonięty → μ1 = 0,4, s = 0,4 × 1,2 × 1,6 = 0,768", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, strefa: 4, katDachuDeg: 45, ekspozycja: "osloniety" })
    expect(w.value.mu).toBeCloseTo(0.4, 12)
    expect(w.value.sKnM2).toBeCloseTo(0.768, 12)
    expect(kody(w)).toContain("SNIEG-NAWISY-NB1-12")
  })

  it("barierki/attyka podnoszą μ do 0,8 i dodają założenie; dach ≥ 60° bez barierek → s = 0", () => {
    const zBarierkami = calculateObciazenieDachuSniegiem({ ...BAZA, katDachuDeg: 45, barierkiLubAttyka: true })
    expect(zBarierkami.value.mu).toBe(0.8)
    expect(zBarierkami.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain(
      "SNIEG-ZALOZENIE-MU-MIN-BARIERKI",
    )
    expect(calculateObciazenieDachuSniegiem({ ...BAZA, katDachuDeg: 60 }).value.sKnM2).toBe(0)
  })

  it("🔴 obciążenie normowe > nośność → critical, VALID_WITH_WARNINGS", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, strefa: 4, nosnoscDachuKnM2: 1.2 })
    expect(w.value.sKnM2).toBeCloseTo(1.28, 12)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.find((x) => x.code === "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC")?.level).toBe("critical")
  })

  it("s równe nośności nie jest przekroczeniem (0,72 vs 0,72)", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, nosnoscDachuKnM2: 0.72 })
    expect(w.status).toBe("VALID")
    expect(w.value.wykorzystanieNormowePct).toBeCloseTo(100, 9)
  })

  it("pomiar 50 cm śniegu osiadłego → γ·h = 2,0 × 0,5 = 1,0 kN/m² ≈ 102 kg/m²; 🔴 gdy > nośność", () => {
    const w = calculateObciazenieDachuSniegiem({
      ...BAZA,
      nosnoscDachuKnM2: 0.9,
      gruboscWarstwyCm: 50,
      rodzajSniegu: "osiadly",
    })
    expect(w.value.aktualneMaxKnM2).toBeCloseTo(1.0, 12)
    expect(w.value.aktualneMaxKgM2).toBeCloseTo(101.97162129779284, 9)
    expect(kody(w)).toEqual(["SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("śnieg stary: zakres γ 2,5–3,5, porównanie z górną wartością + założenie", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, gruboscWarstwyCm: 20, rodzajSniegu: "stary", nosnoscDachuKnM2: 0.6 })
    expect(w.value.aktualneMinKnM2).toBeCloseTo(0.5, 12)
    expect(w.value.aktualneMaxKnM2).toBeCloseTo(0.7, 12)
    expect(kody(w)).toContain("SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC")
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("SNIEG-ZALOZENIE-GAMMA-GORNA")
  })

  it("grubość bez rodzaju śniegu → info, bez obliczenia warstwy, status nie rośnie", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, gruboscWarstwyCm: 30, nosnoscDachuKnM2: 2 })
    expect(w.value.aktualneMaxKnM2).toBeNull()
    expect(kody(w)).toEqual(["SNIEG-POMIAR-BEZ-RODZAJU"])
    expect(w.status).toBe("VALID")
  })

  it("brak strefy / wysokości / kąta → INCOMPLETE; kąt 0° i wysokość 0 m są legalne", () => {
    expect(calculateObciazenieDachuSniegiem({ ...BAZA, strefa: null }).status).toBe("INCOMPLETE")
    expect(calculateObciazenieDachuSniegiem({ ...BAZA, wysokoscNpmM: null }).status).toBe("INCOMPLETE")
    expect(calculateObciazenieDachuSniegiem({ ...BAZA, katDachuDeg: null }).status).toBe("INCOMPLETE")
    expect(calculateObciazenieDachuSniegiem({ ...BAZA, wysokoscNpmM: 0 }).status).toBe("VALID")
  })

  it("kąt > 90°, ujemna nośność i grubość → INVALID_INPUT z polami", () => {
    const w = calculateObciazenieDachuSniegiem({ ...BAZA, katDachuDeg: 95, nosnoscDachuKnM2: -1, gruboscWarstwyCm: -5 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["katDachuDeg", "nosnoscDachuKnM2", "gruboscWarstwyCm"])
  })
})
