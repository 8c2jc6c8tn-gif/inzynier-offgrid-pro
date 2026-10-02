import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculatePrzeplywPompyCiepla } from "../calculator"

const baza = { mocPompyKw: 7, dTK: 5, przeplywPompyM3H: 0, minPrzeplywM3H: 0 }

describe("przepływ przez pompę ciepła (dawne 5.65)", () => {
  it("przykład źródła: 1,2 m³/h = pompa 7 kW przy ΔT 5 K (1,204 m³/h)", () => {
    const r = calculatePrzeplywPompyCiepla(baza)
    expect(r.value.wymaganyM3H).toBeCloseTo(7 / (WSPOLCZYNNIK_KWH_NA_L_K * 5) / 1000, 9)
    expect(r.value.wymaganyM3H).toBeCloseTo(1.2, 1)
    expect(r.value.wymaganyLMin).toBeCloseTo((r.value.wymaganyM3H * 1000) / 60, 9)
    expect(r.status).toBe("VALID")
  })

  it("pompa obiegowa daje 0,9 m³/h → 🔴 za mały przepływ, ΔT rośnie do 6,7 K; minimum karty 1,0 → 🔴", () => {
    const r = calculatePrzeplywPompyCiepla({ ...baza, przeplywPompyM3H: 0.9, minPrzeplywM3H: 1 })
    expect(r.value.rzeczywistyDTK).toBeCloseTo(7 / (WSPOLCZYNNIK_KWH_NA_L_K * 900), 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["PRZ-PRZEPLYW-ZA-MALY", "PRZ-PONIZEJ-MINIMUM"])
    expect(r.warnings.filter((w) => w.level === "critical").map((w) => w.code)).toEqual(["PRZ-PRZEPLYW-ZA-MALY", "PRZ-PONIZEJ-MINIMUM"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("ΔT 10 K poza przykładem źródła 5–7 → ℹ️; brak ΔT → INCOMPLETE; ujemna moc → INVALID_INPUT", () => {
    expect(calculatePrzeplywPompyCiepla({ ...baza, dTK: 10 }).warnings.map((w) => w.code)).toEqual(["PRZ-DT-SPOZA-ZRODLA"])
    expect(calculatePrzeplywPompyCiepla({ ...baza, dTK: 0 }).status).toBe("INCOMPLETE")
    expect(calculatePrzeplywPompyCiepla({ ...baza, mocPompyKw: -1 }).status).toBe("INVALID_INPUT")
  })
})
