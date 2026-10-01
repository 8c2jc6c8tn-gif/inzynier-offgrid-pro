import { describe, expect, it } from "vitest"
import { calculateOslonyPrzeciwsloneczne } from "../calculator"
import type { OslonyPrzeciwsloneczneInput } from "../input"

const RAD = Math.PI / 180
const BAZA: OslonyPrzeciwsloneczneInput = { szerokoscDeg: 52, wysiegM: 0.6, odstepM: 0.3, wysokoscOknaM: 1.5 }

describe("calculateOslonyPrzeciwsloneczne (M6/E19, dawne 5.25)", () => {
  it("52°N: słońce w południe 61,45° latem i 14,55° zimą (90 − φ ± 23,45)", () => {
    const w = calculateOslonyPrzeciwsloneczne(BAZA)
    expect(w.value.wysokoscLatoDeg).toBeCloseTo(61.45, 12)
    expect(w.value.wysokoscZimaDeg).toBeCloseTo(14.55, 12)
  })

  it("okap 0,6 m, 0,3 m nad oknem 1,5 m: latem cień 0,6·tan 61,45° = 1,103 m → 53,5%; zimą 0,156 m < 0,3 m → 0%", () => {
    const w = calculateOslonyPrzeciwsloneczne(BAZA)
    const cien = 0.6 * Math.tan(61.45 * RAD)
    expect(w.value.zacienienieLatoPct).toBeCloseTo(((cien - 0.3) / 1.5) * 100, 9)
    expect(w.value.zacienienieZimaPct).toBe(0)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["OSL-TYLKO-GEOMETRIA"])
  })

  it("wysięg dla pełnego cienia latem i maksymalny bez cienia zimą", () => {
    const w = calculateOslonyPrzeciwsloneczne(BAZA)
    expect(w.value.wysiegPelnyCienLatoM).toBeCloseTo(1.8 / Math.tan(61.45 * RAD), 12)
    expect(w.value.wysiegMaxBezCieniaZimaM).toBeCloseTo(0.3 / Math.tan(14.55 * RAD), 12)
    // przy takim wysięgu okno jest całe w cieniu latem
    const pelny = calculateOslonyPrzeciwsloneczne({ ...BAZA, wysiegM: w.value.wysiegPelnyCienLatoM + 1e-9 })
    expect(pelny.value.zacienienieLatoPct).toBeCloseTo(100, 6)
  })

  it("🟡 źródła: stały okap zacienia okno także zimą (okap 2 m tuż nad oknem)", () => {
    const w = calculateOslonyPrzeciwsloneczne({ ...BAZA, wysiegM: 2, odstepM: 0 })
    expect(w.value.zacienienieZimaPct).toBeGreaterThan(0)
    expect(w.value.zacienienieLatoPct).toBe(100)
    expect(w.warnings.map((x) => [x.code, x.level])).toContainEqual(["OSL-OKAP-ZIMA", "warning"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("szerokość poza modelem (tropik, koło podbiegunowe) → OUT_OF_SCOPE; brak danych → INCOMPLETE; ujemne → INVALID_INPUT", () => {
    expect(calculateOslonyPrzeciwsloneczne({ ...BAZA, szerokoscDeg: 10 }).status).toBe("OUT_OF_SCOPE")
    expect(calculateOslonyPrzeciwsloneczne({ ...BAZA, szerokoscDeg: 70 }).status).toBe("OUT_OF_SCOPE")
    expect(calculateOslonyPrzeciwsloneczne({ ...BAZA, szerokoscDeg: null }).status).toBe("INCOMPLETE")
    expect(calculateOslonyPrzeciwsloneczne({ ...BAZA, odstepM: -1 }).status).toBe("INVALID_INPUT")
  })
})
