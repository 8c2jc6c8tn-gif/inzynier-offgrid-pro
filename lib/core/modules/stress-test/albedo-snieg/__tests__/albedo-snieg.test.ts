import { describe, expect, it } from "vitest"
import { calculateAlbedoSnieg } from "../calculator"
import type { AlbedoSniegInput } from "../input"

const BAZA: AlbedoSniegInput = { produkcjaOkresKwh: 400, typMontazu: "pionowy-jednostronny", zyskPct: 25 }

describe("calculateAlbedoSnieg (M7/E9, dawne 6.10, 6.21)", () => {
  it("przykład źródła: pionowe na ogrodzeniu +25% → 400 kWh daje 100 kWh zysku, razem 500 kWh", () => {
    const w = calculateAlbedoSnieg(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.zyskKwh).toBeCloseTo(100, 12)
    expect(w.value.produkcjaZZyskiemKwh).toBeCloseTo(500, 12)
    expect(w.warnings).toEqual([])
    expect(w.assumptions).toEqual([{ kod: "ALBS-ZAL-PROCENT-USERA" }, { kod: "ALBS-ZAL-OKRES-ZE-SNIEGIEM" }])
  })

  it("przykłady bifacjalne źródła: +20% (30 cm śniegu) i +30% (pionowo) liczone z wpisanego procentu", () => {
    expect(calculateAlbedoSnieg({ ...BAZA, typMontazu: "bifacjalny", zyskPct: 20 }).value.zyskKwh).toBeCloseTo(80, 12)
    expect(calculateAlbedoSnieg({ ...BAZA, typMontazu: "bifacjalny", zyskPct: 30 }).value.zyskKwh).toBeCloseTo(120, 12)
  })

  it("dach → 🟡 ALBS-DACH-MALO-ALBEDO (zdanie źródła), wynik nadal liczony", () => {
    const w = calculateAlbedoSnieg({ ...BAZA, typMontazu: "dach", zyskPct: 2 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ALBS-DACH-MALO-ALBEDO", "warning"]])
    expect(w.value.zyskKwh).toBeCloseTo(8, 12)
  })

  it("zysk 0% to poprawny wpis (nie brak danych) → zysk 0", () => {
    const w = calculateAlbedoSnieg({ ...BAZA, zyskPct: 0 })
    expect(w.status).toBe("VALID")
    expect(w.value.produkcjaZZyskiemKwh).toBe(400)
  })

  it("INCOMPLETE: brak produkcji, typu montażu albo procentu", () => {
    expect(calculateAlbedoSnieg({ ...BAZA, produkcjaOkresKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateAlbedoSnieg({ ...BAZA, typMontazu: null }).status).toBe("INCOMPLETE")
    expect(calculateAlbedoSnieg({ ...BAZA, zyskPct: null }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: ujemna produkcja albo ujemny / nieskończony procent", () => {
    const kody = (i: AlbedoSniegInput) => calculateAlbedoSnieg(i).warnings.map((x) => [x.code, x.field])
    expect(kody({ ...BAZA, produkcjaOkresKwh: -1 })).toEqual([["ALBS-WARTOSC-UJEMNA", "produkcjaOkresKwh"]])
    expect(kody({ ...BAZA, zyskPct: -5 })).toEqual([["ALBS-WARTOSC-UJEMNA", "zyskPct"]])
    expect(calculateAlbedoSnieg({ ...BAZA, zyskPct: Number.NaN }).status).toBe("INVALID_INPUT")
  })
})
