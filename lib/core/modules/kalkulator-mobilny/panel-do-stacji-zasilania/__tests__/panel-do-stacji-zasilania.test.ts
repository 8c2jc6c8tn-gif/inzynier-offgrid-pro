import { describe, expect, it } from "vitest"
import { calculatePanelDoStacjiZasilania } from "../calculator"
import type { PanelDoStacjiZasilaniaInput } from "../input"

const BAZA: PanelDoStacjiZasilaniaInput = {
  vocStcV: 22.5,
  betaPctNaC: -0.3,
  tminC: -10,
  liczbaSzeregowo: 2,
  maxNapiecieWejsciaV: 60,
  iscA: 0,
  liczbaRownolegle: 0,
  maxPradWejsciaA: 0,
}

const kody = (w: { warnings: { code: string }[] }) => w.warnings.map((x) => x.code)

describe("calculatePanelDoStacjiZasilania (M12/E39, dawne 8.66)", () => {
  it("2 × Voc 22,5 V, β −0,3%/°C, −10 °C → 49,725 V (Python); limit 60 V → 🟢 + info o polaryzacji", () => {
    const w = calculatePanelDoStacjiZasilania(BAZA)
    expect(w.value.vocZimoweV).toBeCloseTo(49.725, 9)
    expect(w.status).toBe("VALID")
    expect(kody(w)).toEqual(["PST-SPRAWDZ-POLARYZACJE"])
  })

  it("ten sam łańcuch, limit 50 V → 99,45% limitu → 🟡 (próg 95% z M3/E5)", () => {
    const w = calculatePanelDoStacjiZasilania({ ...BAZA, maxNapiecieWejsciaV: 50 })
    expect(w.value.udzialLimituPct).toBeCloseTo(99.45, 9)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(w)[0]).toBe("PST-BLISKO-LIMITU-NAPIECIA")
  })

  it("−20 °C → 51,075 V > limit 50 V → 🔴 (panel dobrany pod letnie 45 V)", () => {
    const w = calculatePanelDoStacjiZasilania({ ...BAZA, tminC: -20, maxNapiecieWejsciaV: 50 })
    expect(w.value.vocZimoweV).toBeCloseTo(51.075, 9)
    expect(w.warnings[0]!.level).toBe("critical")
    expect(kody(w)[0]).toBe("PST-PRZEKROCZONE-NAPIECIE-WEJSCIA")
  })

  it("prąd: 2 gałęzie × Isc 5,9 A = 11,8 A > 10 A → 🟡; bez limitu prądu → założenie „niesprawdzony”", () => {
    const zLimitem = calculatePanelDoStacjiZasilania({ ...BAZA, iscA: 5.9, liczbaRownolegle: 2, maxPradWejsciaA: 10 })
    expect(zLimitem.value.pradZwarciowyA).toBeCloseTo(11.8, 12)
    expect(kody(zLimitem)).toContain("PST-PRAD-POWYZEJ-LIMITU")
    expect(zLimitem.status).toBe("VALID_WITH_WARNINGS")
    const bez = calculatePanelDoStacjiZasilania(BAZA)
    expect(bez.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("PST-ZALOZENIE-PRAD-NIESPRAWDZONY")
  })

  it("Tmin 0 °C jest legalną wartością (nie „brak danych”)", () => {
    const w = calculatePanelDoStacjiZasilania({ ...BAZA, tminC: 0 })
    expect(w.status).not.toBe("INCOMPLETE")
  })

  it("brak Voc / β / Tmin / limitu → INCOMPLETE", () => {
    expect(calculatePanelDoStacjiZasilania({ ...BAZA, betaPctNaC: 0 }).status).toBe("INCOMPLETE")
    expect(calculatePanelDoStacjiZasilania({ ...BAZA, tminC: null }).status).toBe("INCOMPLETE")
    expect(calculatePanelDoStacjiZasilania({ ...BAZA, maxNapiecieWejsciaV: 0 }).status).toBe("INCOMPLETE")
  })

  it("wartość ujemna → INVALID_INPUT", () => {
    expect(calculatePanelDoStacjiZasilania({ ...BAZA, iscA: -1 }).status).toBe("INVALID_INPUT")
  })
})
