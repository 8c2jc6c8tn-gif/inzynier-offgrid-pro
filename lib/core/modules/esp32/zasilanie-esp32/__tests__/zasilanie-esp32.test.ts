import { describe, expect, it } from "vitest"
import { calculateZasilanieEsp32 } from "../calculator"
import type { ZasilanieEsp32Input } from "../input"

const BAZA: ZasilanieEsp32Input = {
  sposob: "przetwornica",
  napiecieMagistraliV: 48,
  napiecieMagistraliMaxV: 58.4,
  poborMocyW: 2.5,
  napiecieWyjscioweV: 5,
  napiecieWejscioweMaxV: 60,
  pradWyjsciowyMaxA: 1,
  sprawnoscPct: 80,
}

describe("calculateZasilanieEsp32 (M9/E2, dawne 11.2)", () => {
  it("2,5 W przy 5 V → 0,5 A; z magistrali 48 V przy η 80% → 2,5 / (0,8 × 48) A", () => {
    const w = calculateZasilanieEsp32(BAZA)
    expect(w.value.pradWyjsciowyA).toBeCloseTo(0.5, 12)
    expect(w.value.pradWejsciowyA).toBeCloseTo(2.5 / (0.8 * 48), 12)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["ESP-BEZPIECZNIK-FILTR"])
  })

  it("ESP32 bezpośrednio na magistrali → 🔴 (źródło)", () => {
    const w = calculateZasilanieEsp32({ ...BAZA, sposob: "bezposrednio" })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ESP-BEZ-PRZETWORNICY", "critical"]])
  })

  it("magistrala 48 V ładowana do 58,4 V, przetwornica do 28 V → 🔴; porównanie z napięciem MAKS., nie nominalnym", () => {
    const w = calculateZasilanieEsp32({ ...BAZA, napiecieWejscioweMaxV: 28 })
    expect(w.warnings[0]).toMatchObject({ code: "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE", level: "critical", params: { umax: 58.4, uwe: 28 } })
    const tylkoNominalne = calculateZasilanieEsp32({ ...BAZA, napiecieMagistraliMaxV: null, napiecieWejscioweMaxV: 50 })
    expect(tylkoNominalne.warnings.some((x) => x.code === "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE")).toBe(false)
  })

  it("pobór ponad prąd przetwornicy → 🟡", () => {
    const w = calculateZasilanieEsp32({ ...BAZA, poborMocyW: 10 })
    expect(w.warnings[0]).toMatchObject({ code: "ESP-PRZETWORNICA-PRZECIAZONA", level: "warning" })
  })

  it("brak danych → INCOMPLETE; sprawność 0 → INVALID_INPUT", () => {
    expect(calculateZasilanieEsp32({ ...BAZA, poborMocyW: null }).status).toBe("INCOMPLETE")
    expect(calculateZasilanieEsp32({ ...BAZA, sprawnoscPct: 0 }).status).toBe("INVALID_INPUT")
  })
})
