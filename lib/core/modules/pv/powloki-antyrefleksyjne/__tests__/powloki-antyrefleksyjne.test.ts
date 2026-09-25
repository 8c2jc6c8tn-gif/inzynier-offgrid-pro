import { describe, expect, it } from "vitest"
import { calculatePowlokiAntyrefleksyjne } from "../calculator"
import { validateInput } from "../validation"

describe("calculatePowlokiAntyrefleksyjne (M3/E23)", () => {
  it("nominalny: 4000 kWh/rok → przedział 40–120 kWh/rok (1–3% źródła), VALID mimo uwagi serwisowej (info)", () => {
    const wynik = calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: 4000 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.value.zyskMinKwh).toBeCloseTo(40, 9)
    expect(wynik.value.zyskMaxKwh).toBeCloseTo(120, 9)
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([["POWLOKA-AR-CZYSZCZENIE", "info"]])
    expect(wynik.assumptions).toEqual([{ kod: "POWLOKA-AR-ZAKRES-ZE-ZRODLA", params: { min: 1, max: 3 } }])
  })

  it("przykład Biblii „2,5% rocznie” mieści się w wyliczonym przedziale", () => {
    const wynik = calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: 1000 })
    const przyklad = 1000 * 0.025
    expect(przyklad).toBeGreaterThanOrEqual(wynik.value.zyskMinKwh)
    expect(przyklad).toBeLessThanOrEqual(wynik.value.zyskMaxKwh)
  })

  it("wartość graniczna: bardzo mały uzysk (1 kWh) → przedział 0,01–0,03 kWh, bez NaN", () => {
    const wynik = calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: 1 })
    expect(wynik.value.zyskMinKwh).toBeCloseTo(0.01, 9)
    expect(wynik.value.zyskMaxKwh).toBeCloseTo(0.03, 9)
  })

  it("brak danych (0) → INCOMPLETE, zero ostrzeżeń", () => {
    const wynik = calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: 0 })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.warnings).toEqual([])
  })

  it("wartość ujemna → INVALID_INPUT", () => {
    const wynik = calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: -100 })
    expect(wynik.status).toBe("INVALID_INPUT")
    expect(wynik.warnings[0].code).toBe("WARTOSC-UJEMNA")
  })

  it("K3: validateInput zgłasza WARTOSC-UJEMNA tylko dla ujemnych", () => {
    expect(validateInput({ rocznyUzyskKwh: -1 }).errors.map((e) => e.code)).toEqual(["WARTOSC-UJEMNA"])
    expect(validateInput({ rocznyUzyskKwh: 0 }).errors).toEqual([])
  })
})
