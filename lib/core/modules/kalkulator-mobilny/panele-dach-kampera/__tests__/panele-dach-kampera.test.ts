import { describe, expect, it } from "vitest"
import { calculatePaneleDachKampera } from "../calculator"

// Test values only — margins and gaps come from the user's mounting instructions.
const BAZA = {
  szerokoscDachuM: 2.3,
  marginesM: 0.1,
  odstepM: 0.02,
  panelDlugoscM: 1.5,
  panelSzerokoscM: 0.7,
  panelMocW: 175,
  odcinki: [
    { nazwa: "przód", dlugoscM: 1.8 },
    { nazwa: "tył", dlugoscM: 2.0 },
  ],
}

describe("calculatePaneleDachKampera (M12/E19, dawne 8.39)", () => {
  it("dwa odcinki 1,8 m i 2,0 m na dachu 2,3 m → po 2 panele, razem 700 W", () => {
    const w = calculatePaneleDachKampera(BAZA)
    // Segment 1.8 m, usable 1.6 × 2.1: long side along → 1 × 2 = 2; long side across → 2 × 1 = 2.
    expect(w.value.odcinki[0].paneli).toBe(2)
    // Segment 2.0 m, usable 1.8 × 2.1: along → 1 × 2 = 2; across → 2 × 1 = 2.
    expect(w.value.odcinki[1].paneli).toBe(2)
    expect(w.value.liczbaPaneli).toBe(4)
    expect(w.value.mocW).toBe(700)
    expect(w.status).toBe("VALID")
  })

  it("panele dokładnie wypełniają odcinek: 3 × 0,5 m + 2 × 0,25 m = 2,0 m", () => {
    const w = calculatePaneleDachKampera({
      ...BAZA,
      szerokoscDachuM: 1,
      marginesM: 0,
      odstepM: 0.25,
      panelDlugoscM: 1,
      panelSzerokoscM: 0.5,
      odcinki: [{ nazwa: "", dlugoscM: 2 }],
    })
    expect(w.value.odcinki[0]).toMatchObject({ wzdluz: 3, wPoprzek: 1, panelWzdluz: false, paneli: 3 })
  })

  it("odcinek krótszy niż panel → 0 szt., 🟡", () => {
    const w = calculatePaneleDachKampera({ ...BAZA, odcinki: [{ nazwa: "", dlugoscM: 0.6 }] })
    expect(w.value.liczbaPaneli).toBe(0)
    expect(w.warnings.map((x) => x.code)).toContain("DK-PANEL-SIE-NIE-MIESCI")
  })

  it("brak odcinków → INCOMPLETE; ujemny margines → INVALID_INPUT", () => {
    expect(calculatePaneleDachKampera({ ...BAZA, odcinki: [] }).status).toBe("INCOMPLETE")
    expect(calculatePaneleDachKampera({ ...BAZA, marginesM: -1 }).status).toBe("INVALID_INPUT")
  })
})
