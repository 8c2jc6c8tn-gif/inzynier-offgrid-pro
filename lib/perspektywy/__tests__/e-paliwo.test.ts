import { describe, expect, it } from "vitest"
import { porownanieEpaliwa, ZALOZENIA_EPALIWA } from "../e-paliwo"

const wiersz = (scenariusz: string, kraj: string) => {
  const w = porownanieEpaliwa().find((x) => x.scenariusz === scenariusz && x.kraj === kraj)
  if (!w) throw new Error(`missing row ${scenariusz} ${kraj}`)
  return w
}

describe("e-paliwo — porównanie dwóch scenariuszy", () => {
  it("returns six rows: two scenarios × PL, NO, NL", () => {
    expect(porownanieEpaliwa()).toHaveLength(6)
  })

  it("continuous operation: about 1 240 l/year and 1.11–1.48 EUR/l for the machine", () => {
    const no = wiersz("CIAGLY", "NO")
    expect(no.litryRocznie.min).toBeCloseTo(1243.4, 0)
    expect(no.urzadzenieEurL.min).toBeCloseTo(1.11, 2)
    expect(no.urzadzenieEurL.max).toBeCloseTo(1.48, 2)
  })

  it("continuous operation: Norway on the border, Netherlands (household price) and Poland not worth it", () => {
    const no = wiersz("CIAGLY", "NO")
    expect(no.razemEurL.min).toBeCloseTo(1.84, 2)
    expect(no.razemEurL.max).toBeCloseTo(2.46, 2)
    expect(no.ocena).toBe("GRANICA")
    expect(wiersz("CIAGLY", "NL").razemEurL.min).toBeCloseTo(5.86, 2)
    expect(wiersz("CIAGLY", "NL").ocena).toBe("NIE")
    expect(wiersz("CIAGLY", "PL").ocena).toBe("NIE")
  })

  it("own PV: 255–454 l/year, 3.0–7.2 EUR/l for the machine, 4.0–9.8 EUR/l in total — not worth it anywhere", () => {
    for (const kraj of ["PL", "NO", "NL"]) {
      const w = wiersz("WLASNE_PV", kraj)
      expect(w.litryRocznie.min).toBeCloseTo(255.5, 0)
      expect(w.litryRocznie.max).toBeCloseTo(454.3, 0)
      expect(w.urzadzenieEurL.min).toBeCloseTo(3.04, 2)
      expect(w.urzadzenieEurL.max).toBeCloseTo(7.2, 1)
      expect(w.razemEurL.min).toBeCloseTo(4.03, 2)
      expect(w.razemEurL.max).toBeCloseTo(9.84, 2)
      expect(w.ocena).toBe("NIE")
    }
  })

  it("the machine alone on own PV already costs more than a litre at the pump, even with free energy", () => {
    expect(wiersz("WLASNE_PV", "NL").urzadzenieEurL.min).toBeGreaterThan(wiersz("WLASNE_PV", "NL").stacjaEurL.max)
  })

  it("the assumptions keep the documented values", () => {
    expect(ZALOZENIA_EPALIWA.urzadzenieUsd).toEqual([15000, 20000])
    expect(ZALOZENIA_EPALIWA.lata).toBe(10)
  })
})
