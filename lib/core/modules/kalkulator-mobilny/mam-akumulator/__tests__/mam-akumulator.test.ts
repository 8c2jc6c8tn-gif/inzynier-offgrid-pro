import { describe, expect, it } from "vitest"
import { calculateMamAkumulator } from "../calculator"

const BAZA = {
  chemia: "lifepo4" as const,
  pojemnoscAh: 100,
  napiecieV: 12,
  dodPct: 100,
  sprawnoscPct: 100,
  maksPradA: 0,
  urzadzenia: [
    { nazwa: "Lodówka", mocW: 50 },
    { nazwa: "LED", mocW: 20 },
    { nazwa: "Czajnik", mocW: 1000 },
  ],
}

describe("calculateMamAkumulator (M12/E4, dawne 8.4)", () => {
  it("przykład Biblii §12.4: 1,2 kWh → lodówka 24 h, LED 60 h, czajnik 1,2 h; posortowane malejąco", () => {
    const w = calculateMamAkumulator(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.energiaUzytecznaWh).toBeCloseTo(1200, 9)
    expect(w.value.urzadzenia.map((u) => u.nazwa)).toEqual(["LED", "Lodówka", "Czajnik"])
    expect(w.value.urzadzenia.map((u) => u.czasH)).toEqual([60, 24, 1.2])
  })

  it("razem: 1200 / 1070 W (Python: 1.1215) i prąd 1070/12 = 89,2 A", () => {
    const w = calculateMamAkumulator(BAZA)
    expect(w.value.czasRazemH).toBeCloseTo(1200 / 1070, 12)
    expect(w.value.pradRazemA).toBeCloseTo(1070 / 12, 12)
  })

  it("DoD 80% i przetwornica 90%: energia 100×12×0,8×0,9 = 864 Wh, prąd czajnika 1000/(12×0,9)", () => {
    const w = calculateMamAkumulator({ ...BAZA, dodPct: 80, sprawnoscPct: 90 })
    expect(w.value.energiaUzytecznaWh).toBeCloseTo(864, 9)
    const czajnik = w.value.urzadzenia.find((u) => u.nazwa === "Czajnik")!
    expect(czajnik.pradA).toBeCloseTo(1000 / 10.8, 12)
  })

  it("maks. prąd 50 A: czajnik (83 A) i suma → 🟡, nigdy 🔴", () => {
    const w = calculateMamAkumulator({ ...BAZA, maksPradA: 50 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["MA-PRAD-URZADZENIA-PONAD-MAKS", "MA-PRAD-RAZEM-PONAD-MAKS"])
    expect(w.warnings.every((x) => x.level === "warning")).toBe(true)
  })

  it("wiersze bez mocy pomijane; brak urządzeń → INCOMPLETE", () => {
    const w = calculateMamAkumulator({ ...BAZA, urzadzenia: [{ nazwa: "", mocW: 0 }, { nazwa: "LED", mocW: 20 }] })
    expect(w.value.urzadzenia).toHaveLength(1)
    expect(calculateMamAkumulator({ ...BAZA, urzadzenia: [] }).status).toBe("INCOMPLETE")
    expect(calculateMamAkumulator({ ...BAZA, chemia: null }).status).toBe("INCOMPLETE")
  })

  it("ujemna moc urządzenia → INVALID_INPUT z polem wiersza", () => {
    const w = calculateMamAkumulator({ ...BAZA, urzadzenia: [{ nazwa: "X", mocW: -5 }] })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("urzadzenia.0.mocW")
  })
})
