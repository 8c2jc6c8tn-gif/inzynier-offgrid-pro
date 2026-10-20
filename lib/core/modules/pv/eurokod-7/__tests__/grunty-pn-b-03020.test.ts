import { describe, expect, it } from "vitest"
import { katTarciaPhiU, TOLERANCJA_ODCZYTU_WYKRESU_DEG } from "../grunty-pn-b-03020"

describe("PN-B-03020 — Φu z I_D (grunty niespoiste, odczyt z wykresu)", () => {
  it("kontrola z normy: Pr, I_D = 0,5 → 33° w tolerancji odczytu", () => {
    expect(Math.abs((katTarciaPhiU("pr-ps", 0.5) as number) - 33)).toBeLessThanOrEqual(TOLERANCJA_ODCZYTU_WYKRESU_DEG)
  })
  it("końce wykresu", () => {
    expect(katTarciaPhiU("zwir-pospolka", 0.2)).toBeCloseTo(36.3, 9)
    expect(katTarciaPhiU("pd-ppi", 1)).toBeCloseTo(33.1, 9)
  })
  it("poza zakresem I_D albo nie-liczba → null (bez ekstrapolacji)", () => {
    expect(katTarciaPhiU("pr-ps", 0.19)).toBeNull()
    expect(katTarciaPhiU("pr-ps", 1.01)).toBeNull()
    expect(katTarciaPhiU("pr-ps", NaN)).toBeNull()
  })
})
