import { describe, expect, it } from "vitest"
import { bazoweCisnienieWiatruPa, cpNetWiatyJednospadowej, szczytoweCisnieniePa, wspolczynnikEkspozycji } from "../../eurokod-1/wiatr"
import { calculateWiatrPowyzej30, CALCULATOR_VERSION } from "../calculator"
import type { WiatrPowyzej30Input } from "../input"

const PELNY: WiatrPowyzej30Input = { nachylenieDeg: 45, strefaWiatrowa: 2, wysokoscNpmM: 120, kategoriaTerenu: "II", wysokoscKonstrukcjiM: 4 }

describe("wiatr dla paneli na konstrukcji powyżej 30° (szacunek poza normą)", () => {
  it("full data above 30° gives ESTIMATE, never VALID", () => {
    const r = calculateWiatrPowyzej30(PELNY)
    expect(r.status).toBe("ESTIMATE")
    expect(r.calculatorVersion).toBe(CALCULATOR_VERSION)
    expect(r.warnings.map((w) => w.code)).toContain("WP30-SZACUNEK-POZA-NORMA")
    expect(r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("WP30-ZALOZENIE-CP-Z-30")
  })

  it("uses c_p,net of 30° Table 7.6 for every larger angle (D90) and the Eurokode pressure chain", () => {
    const qb = bazoweCisnienieWiatruPa(2, 120)
    const ce = wspolczynnikEkspozycji("II", 4)
    const qp = szczytoweCisnieniePa(qb, ce)
    const cp = cpNetWiatyJednospadowej(30)!
    for (const kat of [31, 45, 60, 90]) {
      const v = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: kat }).value
      expect(v.cp).toEqual(cp)
      expect(v.qpPa).toBeCloseTo(qp, 9)
      expect(v.odrywanieKrawedzPa).toBeCloseTo(qp * cp.odrywanieKrawedz, 9)
      expect(v.dociskSrodekPa).toBeCloseTo(qp * cp.dociskSrodek, 9)
    }
  })

  it("angle independence is explicit: 45° and 80° give the same pressures", () => {
    const a = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 45 }).value
    const b = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 80 }).value
    expect(a).toEqual(b)
  })

  it("up to and including 30° the norm applies: OUT_OF_SCOPE with a pointer, no own number", () => {
    for (const kat of [10, 30]) {
      const r = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: kat })
      expect(r.status).toBe("OUT_OF_SCOPE")
      expect(r.value.qpPa).toBe(0)
      expect(r.warnings[0]!.code).toBe("WP30-KAT-OBJETY-NORMA")
    }
    expect(calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 30.5 }).status).toBe("ESTIMATE")
  })

  it("accepts the vertical panel (90°) and rejects beyond it", () => {
    expect(calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 90 }).status).toBe("ESTIMATE")
    const r = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 91 })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.field).toBe("nachylenieDeg")
  })

  it("is INCOMPLETE until the angle and every site datum are given", () => {
    expect(calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 0 }).status).toBe("INCOMPLETE")
    for (const brak of [{ strefaWiatrowa: null }, { wysokoscNpmM: null }, { kategoriaTerenu: null }, { wysokoscKonstrukcjiM: null }] as const) {
      expect(calculateWiatrPowyzej30({ ...PELNY, ...brak }).status).toBe("INCOMPLETE")
    }
  })

  it("rejects heights outside the supported ranges", () => {
    expect(calculateWiatrPowyzej30({ ...PELNY, wysokoscNpmM: 3000 }).status).toBe("INVALID_INPUT")
    expect(calculateWiatrPowyzej30({ ...PELNY, wysokoscKonstrukcjiM: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: -1 }).status).toBe("INVALID_INPUT")
  })
})
