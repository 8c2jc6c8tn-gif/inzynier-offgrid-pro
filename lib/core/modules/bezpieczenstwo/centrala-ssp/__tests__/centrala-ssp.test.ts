import { describe, expect, it } from "vitest"
import { calculateCentralaSsp } from "../calculator"
import type { CentralaSspInput } from "../input"

const OK: CentralaSspInput = {
  interfejs: "rs485",
  stanCentrali: "dozor",
  odbieraAlarm: true,
  odbieraAwarie: true,
  odbieraRozbrojenie: true,
  logujeZdarzenia: true,
}

describe("calculateCentralaSsp (M8/E5, dawne 11.53)", () => {
  it("dozór, wszystkie sygnały i log → VALID", () => {
    const w = calculateCentralaSsp(OK)
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })

  it("awaria centrali → 🔴 (sekcja C)", () => {
    const w = calculateCentralaSsp({ ...OK, stanCentrali: "awaria" })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["SSP-AWARIA-CENTRALI", "critical"]])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak odbioru alarmu i awarii → 2× 🟡; rozbrojenie i log → info, nie liczone jako braki", () => {
    const w = calculateCentralaSsp({ ...OK, interfejs: "styki", odbieraAlarm: false, odbieraAwarie: false, odbieraRozbrojenie: false, logujeZdarzenia: false })
    expect(w.warnings.map((x) => x.level)).toEqual(["warning", "warning", "info", "info"])
    expect(w.value.liczbaBrakow).toBe(2)
  })

  it("tylko info → VALID", () => {
    expect(calculateCentralaSsp({ ...OK, logujeZdarzenia: false }).status).toBe("VALID")
  })

  it("brak interfejsu albo stanu → INCOMPLETE", () => {
    expect(calculateCentralaSsp({ ...OK, interfejs: null }).status).toBe("INCOMPLETE")
    expect(calculateCentralaSsp({ ...OK, stanCentrali: null }).status).toBe("INCOMPLETE")
  })
})
