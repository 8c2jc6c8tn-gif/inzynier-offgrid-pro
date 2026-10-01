import { describe, expect, it } from "vitest"
import { calculateSzablonyZestawow } from "../calculator"
import { KOLEJNOSC_SZABLONOW, SZABLONY } from "../constants"
import type { SzablonyZestawowInput } from "../input"

// Tresc E3 C: "Kamping na 3 dni, 2 osoby: telefon, lodówka turystyczna, oświetlenie LED, radio". Powers and
// hours are test values (the source gives none).
const KEMPING: SzablonyZestawowInput = {
  szablon: "kemping",
  dni: 3,
  osoby: 2,
  urzadzenia: [
    { nazwa: "Telefon", mocW: 10, godzinNaDobe: 2, naOsobe: true },
    { nazwa: "Lodówka", mocW: 45, godzinNaDobe: 8, naOsobe: false },
    { nazwa: "LED", mocW: 5, godzinNaDobe: 4, naOsobe: false },
    { nazwa: "Radio", mocW: 0, godzinNaDobe: 0, naOsobe: false },
  ],
  napiecieV: 12,
  dodPct: 80,
  godzinSlonca: 4,
  sprawnoscToruPct: 75,
}

describe("calculateSzablonyZestawow (M12/E3, dawne 8.3 + 8.16)", () => {
  it("kemping 3 dni, 2 osoby: 420 Wh/dobę (telefon × 2), szczyt 70 W, akumulator na pobyt i na dobę, panel 140 W", () => {
    const w = calculateSzablonyZestawow(KEMPING)
    expect(w.value.zuzycieDobaWh).toBe(420)
    expect(w.value.zuzyciePobytWh).toBe(1260)
    expect(w.value.szczytW).toBe(70)
    expect(w.value.minimalnyAhPobyt).toBeCloseTo(1260 / 9.6, 12)
    expect(w.value.minimalnyAhDoba).toBeCloseTo(420 / 9.6, 12)
    expect(w.value.minimalnyPanelW).toBeCloseTo(140, 12)
    expect(w.value.pradRegulatoraA).toBeCloseTo(140 / 12, 12)
    expect(w.status).toBe("VALID")
  })

  it("bez słońca → bez doboru panelu", () => {
    const w = calculateSzablonyZestawow({ ...KEMPING, godzinSlonca: 0 })
    expect(w.value.minimalnyPanelW).toBe(0)
    expect(w.assumptions).toEqual([{ kod: "SZ-ZALOZENIE-PUNKT-STARTOWY" }])
  })

  it("brak mocy → INCOMPLETE; DoD > 100% → INVALID_INPUT", () => {
    expect(calculateSzablonyZestawow({ ...KEMPING, urzadzenia: [] }).status).toBe("INCOMPLETE")
    expect(calculateSzablonyZestawow({ ...KEMPING, dodPct: 120 }).status).toBe("INVALID_INPUT")
  })

  it("5 szablonów z Treści, każdy z nazwami bez mocy", () => {
    expect(KOLEJNOSC_SZABLONOW).toEqual(["kamper", "jacht", "domek", "warsztat", "kemping"])
    for (const s of KOLEJNOSC_SZABLONOW) expect(SZABLONY[s].length).toBeGreaterThan(0)
  })
})
