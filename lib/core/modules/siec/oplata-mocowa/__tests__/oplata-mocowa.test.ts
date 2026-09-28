import { describe, expect, it } from "vitest"
import { calculateOplataMocowa } from "../calculator"

const baza = {
  dataRozliczenia: "2026-06-30",
  energiaRocznaKwh: 100000,
  energiaWGodzinachKwh: 60000,
  przesuniecieProcent: 20,
}

describe("calculateOplataMocowa — F5", () => {
  it("0,2194 zł/kWh z Informacji URE 58/2025; udział 60%; przesunięcie 20%", () => {
    const r = calculateOplataMocowa(baza)
    expect(r.status).toBe("VALID")
    expect(r.value.stawkaZlKwh).toBe(0.2194)
    expect(r.value.udzialProcent).toBeCloseTo(60, 12)
    expect(r.value.oplataRokZl).toBeCloseTo(60000 * 0.2194, 9)
    expect(r.value.oszczednoscRokZl).toBeCloseTo(12000 * 0.2194, 9)
  })

  it("przykład kontrolny M14: wzrost 0,1413 → 0,2194 = +55,3% (arytmetyka)", () => {
    expect(((0.2194 - 0.1413) / 0.1413) * 100).toBeCloseTo(55.3, 1)
  })

  it("stawka z faktury ma pierwszeństwo; 2027 bez wpisu → INCOMPLETE", () => {
    expect(calculateOplataMocowa({ ...baza, stawkaWlasnaZlKwh: 0.2 }).value.oplataRokZl).toBeCloseTo(12000, 9)
    expect(calculateOplataMocowa({ ...baza, dataRozliczenia: "2027-02-01" }).status).toBe("INCOMPLETE")
  })

  it("walidacja", () => {
    expect(calculateOplataMocowa({ ...baza, przesuniecieProcent: 120 }).status).toBe("INVALID_INPUT")
    expect(calculateOplataMocowa({ ...baza, energiaWGodzinachKwh: 200000 }).status).toBe("INVALID_INPUT")
    expect(calculateOplataMocowa({ ...baza, energiaWGodzinachKwh: null }).status).toBe("INCOMPLETE")
  })
})
