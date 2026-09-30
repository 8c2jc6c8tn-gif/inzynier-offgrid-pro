import { describe, expect, it } from "vitest"
import { calculatePanelDlaUrzadzenia } from "../calculator"

const BAZA = { mocUrzadzeniaW: 50, godzinPracy: 8, godzinSlonca: 4, uzyskPct: 70, posiadanyPanelW: 0 }

describe("calculatePanelDlaUrzadzenia (M12/E6, dawne 8.6)", () => {
  it("Biblia §12.6: 50 W × 8 h = 400 Wh; 4 h słońca, uzysk 70% → 400 / 2,8 = 142,9 W", () => {
    const w = calculatePanelDlaUrzadzenia(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.zuzycieWh).toBe(400)
    expect(w.value.minimalnaMocPaneluW).toBeCloseTo(400 / 2.8, 12)
  })

  it("posiadany panel 100 W < 142,9 W → 🟡 z minimalną zaokrągloną w górę (143)", () => {
    const w = calculatePanelDlaUrzadzenia({ ...BAZA, posiadanyPanelW: 100 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value.produkcjaPosiadanegoWh).toBeCloseTo(280, 12)
    expect(w.warnings[0]!.params).toEqual({ posiadany: 100, minimalna: 143 })
  })

  it("posiadany panel 150 W wystarcza → bez 🟡", () => {
    expect(calculatePanelDlaUrzadzenia({ ...BAZA, posiadanyPanelW: 150 }).status).toBe("VALID")
  })

  it("brak godzin słońca → INCOMPLETE; uzysk 120% → INVALID_INPUT", () => {
    expect(calculatePanelDlaUrzadzenia({ ...BAZA, godzinSlonca: 0 }).status).toBe("INCOMPLETE")
    expect(calculatePanelDlaUrzadzenia({ ...BAZA, uzyskPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
