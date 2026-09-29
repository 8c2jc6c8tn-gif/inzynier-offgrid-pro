import { describe, expect, it } from "vitest"
import { calculateMocUmowna, oplataPrzekroczeniaMiesiaca } from "../calculator"
import type { MocUmownaInput } from "../input"

const miesiace = (maksy: number[]) => maksy.map((maksKw) => ({ maksKw, dziesiecNajwiekszychKw: null }))

const baza: MocUmownaInput = {
  osd: "tauron",
  grupa: "C21",
  dataRozliczenia: "2026-06-30",
  mocUmownaKw: 50,
  stalaZlKwMiesWlasna: 10,
  wariantPomiaru: "10xmax",
  miesiace: miesiace([55, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]),
}

describe("oplataPrzekroczeniaMiesiaca — ✏️ K12", () => {
  it("wariant (b): stała × 10 × największa nadwyżka", () => {
    expect(oplataPrzekroczeniaMiesiaca({ maksKw: 55, dziesiecNajwiekszychKw: null }, 50, 10, "10xmax").oplataZl).toBe(500)
  })

  it("wariant (a): stała × suma 10 największych nadwyżek (tylko ponad P_u)", () => {
    const m = { maksKw: 55, dziesiecNajwiekszychKw: [55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 60] }
    // 10 largest: 60,55,54,53,52,51,50,49,48,47 → surpluses 10+5+4+3+2+1 = 25
    expect(oplataPrzekroczeniaMiesiaca(m, 50, 10, "suma10").oplataZl).toBe(250)
  })
})

describe("calculateMocUmowna — F4", () => {
  it("koszt przy P_u 50 kW: stały 6 000 + przekroczenia 500", () => {
    const r = calculateMocUmowna(baza)
    expect(r.value.kosztStalyRokZl).toBe(6000)
    expect(r.value.oplataPrzekroczenRokZl).toBe(500)
    expect(r.value.kosztRazemRokZl).toBe(6500)
  })

  it("optimum w zakresie C2x: 45 kW → 6 400 zł (5 400 + 10 × 10 × 10)", () => {
    const r = calculateMocUmowna(baza)
    expect(r.value.optymalnaMocKw).toBe(45)
    expect(r.value.kosztOptymalnyRokZl).toBe(6400)
  })

  it("wariant (a) bez 10 wartości → górne oszacowanie, z ostrzeżeniem", () => {
    const r = calculateMocUmowna({ ...baza, wariantPomiaru: "suma10" })
    expect(r.value.oplataPrzekroczenRokZl).toBe(500)
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-PRZEKROCZENIA-GORNE-OSZACOWANIE")
  })

  it("stała z pliku danych (Tauron C2x 17,52) gdy brak wpisu", () => {
    const r = calculateMocUmowna({ ...baza, stalaZlKwMiesWlasna: undefined })
    expect(r.value.stalaZlKwMies).toBe(17.52)
  })

  it("brak stałej (PGE) → INCOMPLETE; grupa G → INVALID_INPUT; C11 przy 50 kW → INVALID_INPUT", () => {
    expect(calculateMocUmowna({ ...baza, osd: "pge", stalaZlKwMiesWlasna: undefined }).status).toBe("INCOMPLETE")
    expect(calculateMocUmowna({ ...baza, grupa: "G11" }).status).toBe("INVALID_INPUT")
    expect(calculateMocUmowna({ ...baza, grupa: "C11" }).status).toBe("INVALID_INPUT")
  })

  it("niepełny rok → ostrzeżenie", () => {
    const m = [...baza.miesiace]
    m[5] = { maksKw: null, dziesiecNajwiekszychKw: null }
    expect(calculateMocUmowna({ ...baza, miesiace: m }).warnings.map((w) => w.code)).toContain("SIEC-NIEPELNY-ROK")
  })
})
