import { describe, expect, it } from "vitest"
import { calculatePomiarMocyJalowej } from "../calculator"
import type { PomiarPozycja } from "../input"

describe("Moduł zbiorczy Wampiry energetyczne — podzakładka Pomiar (dawne 1.30 + 1.38)", () => {
  it("przykład źródła 1.38: 8 W ciągle → 70 kWh/rok", () => {
    const pozycje: PomiarPozycja[] = [{ id: "1", nazwa: "Sterownik", mocJalowaW: 8 }]
    const result = calculatePomiarMocyJalowej({ pozycje })

    expect(result.status).toBe("VALID")
    expect(result.value.sumaW).toBe(8)
    expect(result.value.energiaRocznaKwh).toBeCloseTo(70.08, 2)
  })

  it("nominalny: dwie pozycje (ładowarka 2W + zasilacz routera 5W)", () => {
    const pozycje: PomiarPozycja[] = [
      { id: "1", nazwa: "Ładowarka od laptopa", mocJalowaW: 2 },
      { id: "2", nazwa: "Zasilacz od routera", mocJalowaW: 5 },
    ]
    const result = calculatePomiarMocyJalowej({ pozycje })
    expect(result.value.sumaW).toBe(7)
  })

  it("graniczny: jedna pozycja", () => {
    const result = calculatePomiarMocyJalowej({ pozycje: [{ id: "1", nazwa: "X", mocJalowaW: 1 }] })
    expect(result.value.sumaW).toBe(1)
  })

  it("błędne dane: pozycja z mocą 0 → INVALID_INPUT", () => {
    const result = calculatePomiarMocyJalowej({ pozycje: [{ id: "1", nazwa: "X", mocJalowaW: 0 }] })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "WAMPIR-POMIAR-NIEDODATNI")).toBe(true)
  })

  it("brak pozycji → INCOMPLETE", () => {
    const result = calculatePomiarMocyJalowej({ pozycje: [] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings.some((w) => w.code === "WAMPIR-BRAK-POMIAROW")).toBe(true)
  })

  it("i18n: warnings mają i18nKey, nie gotowy tekst PL", () => {
    const result = calculatePomiarMocyJalowej({ pozycje: [{ id: "1", nazwa: "X", mocJalowaW: 0 }] })
    expect(result.warnings[0].i18nKey).toBe("WAMPIR-POMIAR-NIEDODATNI")
    expect(result.warnings[0].message).toBeUndefined()
  })
})
