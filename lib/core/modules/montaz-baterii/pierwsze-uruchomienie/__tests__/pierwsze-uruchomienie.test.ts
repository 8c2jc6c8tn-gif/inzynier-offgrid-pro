import { describe, expect, it } from "vitest"
import { calculatePierwszeUruchomienie } from "../calculator"
import { CHECKLIST_ITEMS } from "../constants"

const WSZYSTKIE_ID = CHECKLIST_ITEMS.map((item) => item.id)

describe("calculatePierwszeUruchomienie (Ekran A5, Moduł 11)", () => {
  it("nominalny: 280Ah → prąd testowy 28A, Top Balancing osiągnięty, checklist pełny → VALID", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 280,
      napiecieNajwyzszegoOgniwaV: 3.55,
      potwierdzoneIds: WSZYSTKIE_ID,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pradTestowyA).toBeCloseTo(28)
    expect(result.value.osiagnietoTopBalancing).toBe(true)
  })

  it("graniczny: 100Ah → prąd testowy dokładnie 10A (0,1C)", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 100,
      napiecieNajwyzszegoOgniwaV: 3.55,
      potwierdzoneIds: WSZYSTKIE_ID,
    })
    expect(result.value.pradTestowyA).toBe(10)
  })

  it("napięcie ogniwa dokładnie na progu Top Balancing (3,55V) → osiągnięty", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 100,
      napiecieNajwyzszegoOgniwaV: 3.55,
      potwierdzoneIds: [],
    })
    expect(result.value.osiagnietoTopBalancing).toBe(true)
  })

  it("Top Balancing jeszcze nieosiągnięty → INCOMPLETE z ostrzeżeniem info, status niepodniesiony", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 100,
      napiecieNajwyzszegoOgniwaV: 3.4,
      potwierdzoneIds: WSZYSTKIE_ID,
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings[0].code).toBe("TOP-BALANCING-NIEOSIAGNIETY")
    expect(result.warnings[0].level).toBe("info")
  })

  it("błędne dane: pojemność ujemna → INVALID_INPUT", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: -10,
      napiecieNajwyzszegoOgniwaV: 3.55,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: pojemność = 0 (niewypełniona) → INCOMPLETE", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 0,
      napiecieNajwyzszegoOgniwaV: 0,
      potwierdzoneIds: WSZYSTKIE_ID,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("Top Balancing osiągnięty, ale checklist niepełny → INCOMPLETE, nie VALID", () => {
    const result = calculatePierwszeUruchomienie({
      pojemnoscAh: 280,
      napiecieNajwyzszegoOgniwaV: 3.6,
      potwierdzoneIds: ["bms-balansuje"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(1)
    expect(result.value.razem).toBe(2)
  })
})
