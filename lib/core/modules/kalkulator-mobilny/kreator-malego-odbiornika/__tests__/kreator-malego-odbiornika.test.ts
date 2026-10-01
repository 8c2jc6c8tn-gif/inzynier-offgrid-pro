import { describe, expect, it } from "vitest"
import { calculateKreatorMalegoOdbiornika } from "../calculator"
import { SCENARIUSZE } from "../constants"
import type { KreatorMalegoOdbiornikaInput } from "../input"

// Biblia §12.24.3: "Centrala 15W + czujki 10W = 25W ciągle … Akumulator 12V 40Ah podtrzyma alarm przez 19 h."
// Part usable 100% and no inverter reproduce the Bible arithmetic (480 Wh / 25 W = 19.2 h) — test values only.
const ALARM: KreatorMalegoOdbiornikaInput = {
  scenariusz: "alarm",
  skladniki: [
    { nazwa: "Centrala", mocW: 15, godzinNaDobe: 24, krotnoscRozruchu: 0 },
    { nazwa: "Czujki", mocW: 10, godzinNaDobe: 24, krotnoscRozruchu: 0 },
  ],
  czasPodtrzymaniaH: 19.2,
  napiecieV: 12,
  uzytecznaPct: 100,
  przezFalownik: false,
  sprawnoscFalownikaPct: 0,
  posiadanyAh: 40,
  mocPaneluW: 0,
  godzinSlonca: 0,
  sprawnoscToruPct: 0,
}

describe("calculateKreatorMalegoOdbiornika (M12/E12, Biblia §12.24)", () => {
  it("przykład Biblii §12.24.3: alarm 25 W, 40 Ah 12 V → 19,2 h, 600 Wh/dobę", () => {
    const w = calculateKreatorMalegoOdbiornika(ALARM)
    expect(w.value.zuzycieDobaWh).toBe(600)
    expect(w.value.posiadanyStarczyH).toBeCloseTo(19.2, 12)
    expect(w.value.minimalnyAh).toBeCloseTo(40, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["KZ-UWAGA-ALARM"])
    expect(w.status).toBe("VALID")
  })

  it("przykład Biblii §12.41: kocioł 70 W, 100 Ah 12 V → ok. 17 h", () => {
    const w = calculateKreatorMalegoOdbiornika({
      ...ALARM,
      scenariusz: "kociol-gazowy",
      skladniki: [{ nazwa: "Pompa", mocW: 70, godzinNaDobe: 24, krotnoscRozruchu: 0 }],
      posiadanyAh: 100,
    })
    expect(w.value.posiadanyStarczyH).toBeCloseTo(1200 / 70, 12)
  })

  it("falownik: sprawność obniża Wh na Ah; rozruch → ℹ️ ze szczytem; światło przez falownik → 🟡", () => {
    const w = calculateKreatorMalegoOdbiornika({
      ...ALARM,
      scenariusz: "oswietlenie-awaryjne",
      skladniki: [{ nazwa: "LED", mocW: 30, godzinNaDobe: 24, krotnoscRozruchu: 2 }],
      czasPodtrzymaniaH: 24,
      przezFalownik: true,
      sprawnoscFalownikaPct: 90,
      posiadanyAh: 0,
    })
    expect(w.value.minimalnyAh).toBeCloseTo(720 / (12 * 0.9), 12)
    expect(w.value.szczytW).toBe(60)
    expect(w.warnings.map((x) => x.code)).toEqual(["KZ-SWIATLO-PRZEZ-FALOWNIK", "KZ-ROZRUCH-FALOWNIKA", "KZ-UWAGA-OSWIETLENIE"])
  })

  it("akumulator za mały i panel nie pokrywa → 🟡", () => {
    const w = calculateKreatorMalegoOdbiornika({ ...ALARM, posiadanyAh: 20, mocPaneluW: 100, godzinSlonca: 4, sprawnoscToruPct: 80 })
    expect(w.value.energiaPaneluWh).toBe(320)
    expect(w.warnings.map((x) => x.code)).toEqual(["KZ-AKUMULATOR-ZA-MALY", "KZ-PANEL-NIE-POKRYWA", "KZ-UWAGA-ALARM"])
  })

  it("brak wyboru falownika / panel bez godzin słońca → INCOMPLETE; ujemna moc → INVALID_INPUT", () => {
    expect(calculateKreatorMalegoOdbiornika({ ...ALARM, przezFalownik: null }).status).toBe("INCOMPLETE")
    expect(calculateKreatorMalegoOdbiornika({ ...ALARM, mocPaneluW: 100 }).status).toBe("INCOMPLETE")
    expect(calculateKreatorMalegoOdbiornika({ ...ALARM, skladniki: [{ nazwa: "", mocW: -5, godzinNaDobe: 1, krotnoscRozruchu: 0 }] }).status).toBe("INVALID_INPUT")
  })

  it("16 scenariuszy z Treści, każdy z notą i co najmniej jednym składnikiem", () => {
    expect(SCENARIUSZE).toHaveLength(16)
    for (const s of SCENARIUSZE) {
      expect(s.skladniki.length).toBeGreaterThan(0)
      expect(s.uwaga).toMatch(/^KZ-UWAGA-/)
    }
  })
})
