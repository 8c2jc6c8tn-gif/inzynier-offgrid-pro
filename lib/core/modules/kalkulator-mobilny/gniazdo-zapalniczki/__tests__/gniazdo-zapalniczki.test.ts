import { describe, expect, it } from "vitest"
import { calculateGniazdoZapalniczki } from "../calculator"
import type { GniazdoZapalniczkiInput } from "../input"

const BAZA: GniazdoZapalniczkiInput = {
  napiecieV: 12,
  pradBezpiecznikaA: 10,
  urzadzenia: [{ id: "1", nazwa: "Lodówka", mocW: 45 }],
}

describe("calculateGniazdoZapalniczki (M12/E30, dawne 8.57)", () => {
  it("Biblia: 10 A przy 12 V = 120 W; lodówka 45 W → 3,75 A, bez stopu", () => {
    const w = calculateGniazdoZapalniczki(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.mocMaxW).toBe(120)
    expect(w.value.pradA).toBeCloseTo(3.75, 12)
    expect(w.value.obciazeniePct).toBeCloseTo(37.5, 12)
  })

  it("źródło: sprzęt > 180 W „raczej nie” — 200 W przy 15 A/12 V (180 W) → 16,7 A > 15 A → 🔴", () => {
    const w = calculateGniazdoZapalniczki({ ...BAZA, pradBezpiecznikaA: 15, urzadzenia: [{ id: "1", nazwa: "Czajnik", mocW: 200 }] })
    expect(w.value.mocMaxW).toBe(180)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["GZ-PRZECIAZENIE-GNIAZDA", "critical"]])
  })

  it("rozgałęźnik: suma urządzeń się liczy (45 + 60 + 20 W = 125 W > 120 W) → 🔴", () => {
    const w = calculateGniazdoZapalniczki({
      ...BAZA,
      urzadzenia: [
        { id: "1", nazwa: "Lodówka", mocW: 45 },
        { id: "2", nazwa: "Laptop", mocW: 60 },
        { id: "3", nazwa: "Ładowarka", mocW: 20 },
      ],
    })
    expect(w.value.sumaMocyW).toBe(125)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("granica: dokładnie 120 W przy 10 A → bez stopu", () => {
    const w = calculateGniazdoZapalniczki({ ...BAZA, urzadzenia: [{ id: "1", nazwa: "X", mocW: 120 }] })
    expect(w.status).toBe("VALID")
  })

  it("24 V: 10 A → 240 W", () => {
    expect(calculateGniazdoZapalniczki({ ...BAZA, napiecieV: 24 }).value.mocMaxW).toBe(240)
  })

  it("brak napięcia, bezpiecznika lub urządzeń → INCOMPLETE; ujemna moc → INVALID_INPUT", () => {
    expect(calculateGniazdoZapalniczki({ ...BAZA, napiecieV: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGniazdoZapalniczki({ ...BAZA, pradBezpiecznikaA: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGniazdoZapalniczki({ ...BAZA, urzadzenia: [] }).status).toBe("INCOMPLETE")
    expect(calculateGniazdoZapalniczki({ ...BAZA, urzadzenia: [{ id: "1", nazwa: "X", mocW: -5 }] }).status).toBe("INVALID_INPUT")
  })
})
