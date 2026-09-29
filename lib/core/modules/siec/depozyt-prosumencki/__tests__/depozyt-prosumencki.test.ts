import { describe, expect, it } from "vitest"
import { calculateDepozyt } from "../calculator"
import type { DepozytInput } from "../input"

const baza: DepozytInput = {
  dataMiesiaca: "2026-05-15",
  energiaOddanaKwh: 2000,
  cenaRynkowaZlMwh: 450,
  systemCeny: "rce",
  wykorzystanoZl: null,
  pelnyKosztKwhBruttoZl: null,
}

describe("calculateDepozyt — D8", () => {
  it("przykład kontrolny M14: 2 MWh × 450 zł/MWh × 1,23 = 1 107 zł", () => {
    const r = calculateDepozyt(baza)
    expect(r.value.wartoscEnergiiZl).toBeCloseTo(900, 9)
    expect(r.value.depozytZl).toBeCloseTo(1107, 9)
    expect(r.value.maksZwrotZl).toBeCloseTo(270, 9) // 30% × 900 (RCE)
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-DEPOZYT-UTRATA-PRZY-ODEJSCIU")
  })

  it("RCEm — zwrot najwyżej 20%", () => {
    expect(calculateDepozyt({ ...baza, systemCeny: "rcem" }).value.maksZwrotZl).toBeCloseTo(180, 9)
  })

  it("niewykorzystana część: zwrot ograniczony limitem, reszta umorzona", () => {
    const r = calculateDepozyt({ ...baza, wykorzystanoZl: 507 })
    expect(r.value.niewykorzystanoZl).toBeCloseTo(600, 9)
    expect(r.value.zwrotZl).toBeCloseTo(270, 9)
    expect(r.value.umorzenieZl).toBeCloseTo(330, 9)
    const maly = calculateDepozyt({ ...baza, wykorzystanoZl: 1000 })
    expect(maly.value.zwrotZl).toBeCloseTo(107, 9)
    expect(maly.value.umorzenieZl).toBeCloseTo(0, 9)
  })

  it("współczynnik bilansowania liczony, nie stała 0,3–0,4 (✏️ K14)", () => {
    const r = calculateDepozyt({ ...baza, pelnyKosztKwhBruttoZl: 1.2 })
    expect(r.value.wspolczynnikBilansowania).toBeCloseTo(0.45 / 1.2, 12)
  })

  it("przed 1.02.2025 — poza okresem ×1,23 → OUT_OF_SCOPE", () => {
    expect(calculateDepozyt({ ...baza, dataMiesiaca: "2025-01-31" }).status).toBe("OUT_OF_SCOPE")
    expect(calculateDepozyt({ ...baza, dataMiesiaca: "2025-02-01" }).value.depozytZl).toBeCloseTo(1107, 9)
  })

  it("walidacja: wykorzystano ponad depozyt, wartości ujemne", () => {
    expect(calculateDepozyt({ ...baza, wykorzystanoZl: 2000 }).status).toBe("INVALID_INPUT")
    expect(calculateDepozyt({ ...baza, cenaRynkowaZlMwh: -5 }).status).toBe("INVALID_INPUT")
    expect(calculateDepozyt({ ...baza, energiaOddanaKwh: 0 }).status).toBe("INCOMPLETE")
  })
})
