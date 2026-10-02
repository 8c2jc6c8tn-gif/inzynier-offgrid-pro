import { describe, expect, it } from "vitest"
import { calculateDefrostSezon } from "../calculator"

const pusty = { odstepMin: 0, czasDefrostuMin: 0, godzinyDobaH: 0, dni: 0 }
const mgla = { odstepMin: 35, czasDefrostuMin: 4, godzinyDobaH: 24, dni: 10 }

describe("defrost w sezonie — scenariusze pogody (dawne 5.56)", () => {
  it("przykład źródła: co 35 min na 4 min → 11,4% czasu; 0,3 kWh/dobę przez 24 h = moc 0,109 kW (niespójność opisana)", () => {
    const r = calculateDefrostSezon({ mocDefrostuKw: 0.3 / ((4 / 35) * 24), scenariusze: [mgla, pusty, pusty], zuzyciePompySezonKwh: 0 })
    const s = r.value.scenariusze[0]!
    expect(s.udzialCzasuPct).toBeCloseTo((4 / 35) * 100, 9)
    expect(s.energiaDobaKwh).toBeCloseTo(0.3, 9)
    expect(s.defrostowDoba).toBeCloseTo((24 * 60) / 35, 9)
    expect(r.value.scenariusze[1]).toBeNull()
    expect(r.value.sumaKwh).toBeCloseTo(3, 9)
    expect(r.status).toBe("VALID")
  })

  it("dwa scenariusze 2 kW sumowane; udział w 4000 kWh zużycia pompy → ℹ️", () => {
    const wilgotny = { odstepMin: 45, czasDefrostuMin: 5, godzinyDobaH: 12, dni: 60 }
    const suchy = { odstepMin: 90, czasDefrostuMin: 5, godzinyDobaH: 8, dni: 30 }
    const r = calculateDefrostSezon({ mocDefrostuKw: 2, scenariusze: [wilgotny, suchy, pusty], zuzyciePompySezonKwh: 4000 })
    const oczekiwane = 2 * (5 / 45) * 12 * 60 + 2 * (5 / 90) * 8 * 30
    expect(r.value.sumaKwh).toBeCloseTo(oczekiwane, 9)
    expect(r.value.udzialPct).toBeCloseTo((oczekiwane / 4000) * 100, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["DSZ-UDZIAL-USTAWIENIA"])
  })

  it("scenariusz w połowie wpisany → INCOMPLETE; defrost dłuższy niż odstęp / 25 h → INVALID_INPUT", () => {
    expect(calculateDefrostSezon({ mocDefrostuKw: 2, scenariusze: [{ ...mgla, dni: 0 }], zuzyciePompySezonKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateDefrostSezon({ mocDefrostuKw: 2, scenariusze: [{ ...mgla, czasDefrostuMin: 40 }], zuzyciePompySezonKwh: 0 }).status).toBe(
      "INVALID_INPUT",
    )
    expect(calculateDefrostSezon({ mocDefrostuKw: 2, scenariusze: [{ ...mgla, godzinyDobaH: 25 }], zuzyciePompySezonKwh: 0 }).status).toBe(
      "INVALID_INPUT",
    )
  })
})
