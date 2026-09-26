import { describe, expect, it } from "vitest"
import { calculateOptymalizacjaIzolacji } from "../calculator"
import type { OptymalizacjaIzolacjiInput, WariantIzolacji } from "../input"

const wariant = (nazwa: string, lambdaWmK: number | null, gruboscCm: number | null, cenaZlM2: number | null): WariantIzolacji => ({
  nazwa,
  lambdaWmK,
  gruboscCm,
  cenaZlM2,
})

// θi 20 °C, every month 0 °C → Σ = 20·24·365 = 175 200 K·h (values checked in Python).
const BAZA: OptymalizacjaIzolacjiInput = {
  przegroda: { nazwa: "Ściana zewnętrzna", powierzchniaM2: 100, uWM2K: 0.5 },
  warianty: [wariant("Wełna", 0.04, 10, 50), wariant("Wełna", 0.04, 20, 80), wariant("PUR", 0.022, 12, 70)],
  temperaturaWewnetrznaC: 20,
  srednieTemperaturyMiesieczneC: Array(12).fill(0),
  cenaCieplaZlKwh: null,
}

describe("calculateOptymalizacjaIzolacji (M6/E10, dawne 5.10)", () => {
  it("U' = 1/(1/U + d/λ), oszczędność z modelu miesięcznego E1, koszt kWh w 10 lat", () => {
    const w = calculateOptymalizacjaIzolacji(BAZA)
    expect(w.status).toBe("VALID")
    const v = w.value!
    expect(v.stopniogodzinyKh).toBe(175200)
    expect(v.strataRocznaPrzedKwh).toBeCloseTo(8760, 9)
    const [w10, w20, pur] = v.warianty
    expect(w10!.uPoWM2K).toBeCloseTo(0.2222222222222222, 12)
    expect(w10!.oszczednoscKwhRok).toBeCloseTo(4866.666666666667, 9)
    expect(w10!.kosztZl).toBe(5000)
    expect(w10!.kosztZaKwhZl).toBeCloseTo(0.10273972602739725, 12)
    expect(w20!.uPoWM2K).toBeCloseTo(0.14285714285714285, 12)
    expect(w20!.kosztZaKwhZl).toBeCloseTo(0.12785388127853883, 12)
    expect(pur!.oszczednoscKwhRok).toBeCloseTo(6409.756097560976, 9)
    expect(pur!.kosztZaKwhZl).toBeCloseTo(0.10920852359208524, 12)
    expect(v.najtanszyIndex).toBe(0)
  })

  it("koszt krańcowy: grubszy wariant tego samego materiału względem cieńszego, najcieńszy względem braku izolacji", () => {
    const v = calculateOptymalizacjaIzolacji(BAZA).value!
    expect(v.warianty[1]!.kosztKrancowyZaKwhZl).toBeCloseTo(0.21575342465753433, 12)
    expect(v.warianty[0]!.kosztKrancowyZaKwhZl).toBeCloseTo(v.warianty[0]!.kosztZaKwhZl!, 12)
    expect(v.warianty[2]!.kosztKrancowyZaKwhZl).toBeCloseTo(v.warianty[2]!.kosztZaKwhZl!, 12)
  })

  it("🟡 ze źródła tylko przy podanej cenie ciepła i tylko dla dodatkowych centymetrów", () => {
    const drogie = calculateOptymalizacjaIzolacji({ ...BAZA, cenaCieplaZlKwh: 0.2 })
    expect(drogie.status).toBe("VALID_WITH_WARNINGS")
    const ostrz = drogie.warnings.filter((x) => x.code === "IZOL-GRUBOSC-NIE-ZWRACA-SIE")
    expect(ostrz).toHaveLength(1)
    expect(ostrz[0]!.params).toMatchObject({ nazwa: "Wełna", grubosc: 20 })
    // Thinnest variants cost > 0,20 zł/kWh? No (0,10 / 0,11) — and they are never flagged as "additional cm" anyway.
    expect(calculateOptymalizacjaIzolacji({ ...BAZA, cenaCieplaZlKwh: 0.25 }).warnings.some((x) => x.code === "IZOL-GRUBOSC-NIE-ZWRACA-SIE")).toBe(false)
    expect(calculateOptymalizacjaIzolacji(BAZA).warnings.some((x) => x.code === "IZOL-GRUBOSC-NIE-ZWRACA-SIE")).toBe(false)
  })

  it("miesiące cieplejsze niż θi nie dają oszczędności (ten sam model co E1)", () => {
    const miesiace = [0, 0, 0, 0, 0, 0, 25, 25, 0, 0, 0, 0]
    const v = calculateOptymalizacjaIzolacji({ ...BAZA, srednieTemperaturyMiesieczneC: miesiace }).value!
    expect(v.stopniogodzinyKh).toBe(20 * 24 * (365 - 62))
  })

  it("brak sezonu grzewczego → brak kosztu kWh i ostrzeżenie info", () => {
    const w = calculateOptymalizacjaIzolacji({ ...BAZA, srednieTemperaturyMiesieczneC: Array(12).fill(22) })
    expect(w.value!.warianty.every((x) => x.kosztZaKwhZl === null)).toBe(true)
    expect(w.value!.najtanszyIndex).toBeNull()
    expect(w.warnings.some((x) => x.code === "IZOL-BRAK-SEZONU-GRZEWCZEGO")).toBe(true)
  })

  it("INCOMPLETE: niepełne miesiące, brak U z E1 albo niepełny wariant", () => {
    const miesiace = [...Array(11).fill(0), null]
    expect(calculateOptymalizacjaIzolacji({ ...BAZA, srednieTemperaturyMiesieczneC: miesiace }).status).toBe("INCOMPLETE")
    expect(calculateOptymalizacjaIzolacji({ ...BAZA, przegroda: { ...BAZA.przegroda, uWM2K: null } }).status).toBe("INCOMPLETE")
    expect(calculateOptymalizacjaIzolacji({ ...BAZA, warianty: [wariant("Wełna", 0.04, 10, null)] }).status).toBe("INCOMPLETE")
    expect(calculateOptymalizacjaIzolacji({ ...BAZA, warianty: [] }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: λ w mW/(m·K), grubość w mm, ujemna cena", () => {
    const w = calculateOptymalizacjaIzolacji({ ...BAZA, warianty: [wariant("Wełna", 35, 10, 50), wariant("PUR", 0.022, 120, -1)] })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["warianty.0.lambdaWmK", "warianty.1.gruboscCm", "warianty.1.cenaZlM2"])
    expect(w.warnings.every((x) => x.level === "critical")).toBe(true)
  })

  it("założenia jako kody i18n", () => {
    const kody = calculateOptymalizacjaIzolacji(BAZA).assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    expect(kody).toEqual(["IZOL-ZALOZENIE-WARSTWA-SZEREGOWA", "IZOL-ZALOZENIE-10-LAT", "IZOL-ZALOZENIE-CIEPLO-NIE-PRAD"])
  })
})
