import { describe, expect, it } from "vitest"
import { calculateUrzadzeniaMedyczne } from "../calculator"
import type { UrzadzeniaMedyczneInput } from "../input"

// Biblia §12.39: "CPAP 60W przez 8 h zużywa 0,48 kWh. Akumulator LiFePO4 100Ah (1,2 kWh) wystarczy na 2 noce".
// DoD 80% and direct DC are test values that reproduce the Bible's "2 noce" — not defaults.
const CPAP: UrzadzeniaMedyczneInput = {
  urzadzenie: "cpap",
  mocW: 60,
  godzinNaDobe: 8,
  napiecieV: 12,
  uzytecznaPct: 80,
  przezFalownik: false,
  sprawnoscFalownikaPct: 0,
  posiadanyAh: 100,
  maZapasoweZrodlo: true,
}

describe("calculateUrzadzeniaMedyczne (M12/E26, dawne 8.51)", () => {
  it("przykład Biblii: CPAP 60 W × 8 h = 480 Wh; 100 Ah przy 80% → 2 doby, minimum 100 Ah", () => {
    const w = calculateUrzadzeniaMedyczne(CPAP)
    expect(w.value.zuzycieDobaWh).toBe(480)
    expect(w.value.dobyPosiadany).toBeCloseTo(2, 12)
    expect(w.value.minimalnyAh).toBeCloseTo(100, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["MED-SPRAWDZ-Z-PRODUCENTEM"])
    expect(w.status).toBe("VALID")
  })

  it("poniżej 2 dób → 🟡 (decyzja właściciela, nie 🔴)", () => {
    const w = calculateUrzadzeniaMedyczne({ ...CPAP, posiadanyAh: 80 })
    const ost = w.warnings.find((x) => x.code === "MED-PONIZEJ-MINIMUM-DOB")!
    expect(ost.level).toBe("warning")
    expect(ost.params).toEqual({ doby: 1.6, minimum: 2, ah: 100 })
  })

  it("brak lub nieznane źródło zapasowe → 🟡 zawsze; falownik → ℹ️ rozważ DC i sprawność w Ah", () => {
    const w = calculateUrzadzeniaMedyczne({ ...CPAP, maZapasoweZrodlo: null, przezFalownik: true, sprawnoscFalownikaPct: 90, posiadanyAh: 0 })
    expect(w.warnings.map((x) => x.code)).toEqual(["MED-BRAK-ZAPASOWEGO-ZRODLA", "MED-ROZWAZ-ZASILANIE-DC", "MED-SPRAWDZ-Z-PRODUCENTEM"])
    expect(w.value.minimalnyAh).toBeCloseTo(960 / (12 * 0.8 * 0.9), 12)
  })

  it("brak danych → INCOMPLETE; ponad 24 h → INVALID_INPUT", () => {
    expect(calculateUrzadzeniaMedyczne({ ...CPAP, przezFalownik: null }).status).toBe("INCOMPLETE")
    expect(calculateUrzadzeniaMedyczne({ ...CPAP, godzinNaDobe: 25 }).status).toBe("INVALID_INPUT")
  })
})
