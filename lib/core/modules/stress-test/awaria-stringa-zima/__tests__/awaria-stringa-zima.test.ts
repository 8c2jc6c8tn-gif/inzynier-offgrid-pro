import { describe, expect, it } from "vitest"
import { calculateAwariaStringaZima } from "../calculator"
import type { AwariaStringaZimaInput } from "../input"

const BAZA: AwariaStringaZimaInput = {
  produkcjaCalkowitaKwhDoba: 12,
  produkcjaStringuKwhDoba: 6,
  zapotrzebowanieKwhDoba: 14,
  pojemnoscBateriiKwh: 20,
  dodPct: 80,
  sprawnoscFalownikaPct: 100,
}

describe("calculateAwariaStringaZima (M7/E26, dawne 6.40)", () => {
  it("12 kWh − string 6 kWh przy 14 kWh/dobę → deficyt 8 kWh/dobę (skala przykładu C), bateria 20 kWh × 80% → 2 dni", () => {
    const w = calculateAwariaStringaZima(BAZA)
    expect(w.value.produkcjaPoAwariiKwhDoba).toBe(6)
    expect(w.value.deficytDobowyKwh).toBe(8)
    expect(w.value.dniNaBaterii).toBeCloseTo(2, 12)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["STRING-DEFICYT", "STRING-DNI-NA-BATERII", "STRING-KASKADA"])
  })

  it("produkcja po awarii wystarcza → VALID, bez deficytu", () => {
    const w = calculateAwariaStringaZima({ ...BAZA, zapotrzebowanieKwhDoba: 5 })
    expect(w.status).toBe("VALID")
    expect(w.value.dniNaBaterii).toBeNull()
  })

  it("bez danych baterii → deficyt bez liczby dni", () => {
    const w = calculateAwariaStringaZima({ ...BAZA, pojemnoscBateriiKwh: null })
    expect(w.value.dniNaBaterii).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["STRING-DEFICYT", "STRING-KASKADA"])
  })

  it("string większy niż całość, DoD 0 → INVALID_INPUT; brak zapotrzebowania → INCOMPLETE", () => {
    expect(calculateAwariaStringaZima({ ...BAZA, produkcjaStringuKwhDoba: 13 }).status).toBe("INVALID_INPUT")
    expect(calculateAwariaStringaZima({ ...BAZA, dodPct: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateAwariaStringaZima({ ...BAZA, zapotrzebowanieKwhDoba: null }).status).toBe("INCOMPLETE")
  })
})
