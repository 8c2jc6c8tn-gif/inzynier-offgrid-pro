import { describe, expect, it } from "vitest"
import { calculateDystrybucjaCiepla } from "../calculator"
import type { DystrybucjaCieplaInput } from "../input"

const BAZA: DystrybucjaCieplaInput = {
  zrodloCiepla: "pompa-ciepla",
  system: "podlogowe",
  cieploRocznieKwh: 0,
  copSystemu: 0,
  copOdniesienia: 0,
  doplataZl: 0,
  cenaPraduZlKwh: 0,
}

describe("calculateDystrybucjaCiepla (M6/E13, dawne 5.13 + 5.17 + 5.18)", () => {
  it("przykład źródła: COP 4,5 (podłogówka 35 °C) vs 3,2 (grzejniki 55 °C) → 28,9% (źródło: „28%”)", () => {
    const w = calculateDystrybucjaCiepla({ ...BAZA, copSystemu: 4.5, copOdniesienia: 3.2 })
    expect(w.value.oszczednoscPct).toBeCloseTo((1 - 3.2 / 4.5) * 100, 12)
    expect(w.value.oszczednoscPct).toBeCloseTo(28.89, 2)
    expect(w.value.dopasowanie).toBe("dobre")
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["DYS-PODLOGOWE-BEZWLADNOSC"])
  })

  it("kWh, zł i zwrot: 9000 kWh ciepła, COP 4,5 vs 3,0, 1 zł/kWh, dopłata 2000 zł", () => {
    const w = calculateDystrybucjaCiepla({
      ...BAZA,
      system: "grzejniki-niskotemperaturowe",
      cieploRocznieKwh: 9000,
      copSystemu: 4.5,
      copOdniesienia: 3,
      cenaPraduZlKwh: 1,
      doplataZl: 2000,
    })
    expect(w.value.energiaSystemuKwh).toBeCloseTo(2000, 9)
    expect(w.value.energiaOdniesieniaKwh).toBeCloseTo(3000, 9)
    expect(w.value.oszczednoscKwh).toBeCloseTo(1000, 9)
    expect(w.value.oszczednoscZlRok).toBeCloseTo(1000, 9)
    expect(w.value.zwrotLat).toBeCloseTo(2, 12)
    expect(w.warnings).toEqual([])
  })

  it("🔴 źródła: grzejniki standardowe przy pompie ciepła", () => {
    const w = calculateDystrybucjaCiepla({ ...BAZA, system: "grzejniki-standardowe", copSystemu: 3, copOdniesienia: 3 })
    expect(w.value.dopasowanie).toBe("zle")
    expect(w.value.oszczednoscPct).toBeNull()
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["DYS-GRZEJNIKI-WYSOKOTEMP-POMPA", "critical"]])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("inne źródło ciepła: grzejniki standardowe bez 🔴, porównanie COP nie dotyczy", () => {
    const w = calculateDystrybucjaCiepla({ ...BAZA, zrodloCiepla: "inne", system: "grzejniki-standardowe", copSystemu: 4, copOdniesienia: 3 })
    expect(w.value.dopasowanie).toBe("inne-zrodlo")
    expect(w.value.oszczednoscPct).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["DYS-COP-TYLKO-POMPA"])
    expect(w.status).toBe("VALID")
  })

  it("COP wybranego systemu nie wyższy niż odniesienia → 🟡 (pomylone dane)", () => {
    const w = calculateDystrybucjaCiepla({ ...BAZA, system: "grzejniki-niskotemperaturowe", copSystemu: 3, copOdniesienia: 3.5 })
    expect(w.warnings.map((x) => x.code)).toEqual(["DYS-COP-NIE-WYZSZY"])
    expect(w.value.oszczednoscPct).toBeLessThan(0)
  })

  it("brak wyboru → INCOMPLETE; COP < 1 albo wartość ujemna → INVALID_INPUT", () => {
    expect(calculateDystrybucjaCiepla({ ...BAZA, system: null }).status).toBe("INCOMPLETE")
    expect(calculateDystrybucjaCiepla({ ...BAZA, copSystemu: 0.5 }).warnings[0]!.code).toBe("M6-COP-POZA-ZAKRESEM")
    expect(calculateDystrybucjaCiepla({ ...BAZA, cenaPraduZlKwh: -1 }).status).toBe("INVALID_INPUT")
  })
})
