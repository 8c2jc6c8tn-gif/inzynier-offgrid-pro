import { describe, expect, it } from "vitest"
import { bazoweCisnienieWiatruPa, cfOdrywaniaWiaty, cpNetWiatyJednospadowej, szczytoweCisnieniePa, wspolczynnikEkspozycji } from "../../eurokod-1/wiatr"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../../zloty-srodek/constants"
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

  describe("siła na stelaż i balast (powierzchnia + φ)", () => {
    const qp = () => szczytoweCisnieniePa(bazoweCisnienieWiatruPa(2, 120), wspolczynnikEkspozycji("II", 4))

    it("without area and φ the force and ballast stay empty", () => {
      const v = calculateWiatrPowyzej30(PELNY).value
      expect(v.cf).toBeNull()
      expect(v.silaWiatruN).toBeNull()
      expect(v.balastProjektowyKg).toBeNull()
    })

    it("force = cf(30°, φ)·qp·A and ballast = EQU (1,5·F / (0,9·g) − G), the same chain as up to 30°", () => {
      const r = calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 10, wspolczynnikPhi: 0, masaPaneliStelazaKg: 50 })
      const cf = cfOdrywaniaWiaty(30, 0)!
      const sila = cf * qp() * 10
      expect(r.status).toBe("ESTIMATE")
      expect(r.value.cf).toBe(cf)
      expect(r.value.silaWiatruN).toBeCloseTo(sila, 6)
      expect(r.value.balastProjektowyKg).toBeCloseTo((1.5 * sila) / (0.9 * PRZYSPIESZENIE_ZIEMSKIE_M_S2) - 50, 6)
      expect(r.warnings.map((w) => w.code)).toEqual(["WP30-SZACUNEK-POZA-NORMA", "ZS-BALAST-EQU-TYLKO-ODRYWANIE", "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC"])
      expect(r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toEqual(
        expect.arrayContaining(["WP30-ZALOZENIE-CF-Z-30", "ZS-ZALOZENIE-BALAST-EQU", "ZS-ZALOZENIE-MASA-WLASNA"]),
      )
    })

    it("φ lowers the force coefficient (cf 1,8 at φ = 0, 1,4 at φ = 1) and the ballast with it", () => {
      const a = calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 10, wspolczynnikPhi: 0 }).value
      const b = calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 10, wspolczynnikPhi: 1 }).value
      expect(a.cf).toBeCloseTo(1.8, 9)
      expect(b.cf).toBeCloseTo(1.4, 9)
      expect(b.balastProjektowyKg!).toBeLessThan(a.balastProjektowyKg!)
    })

    it("ballast never goes negative when the own weight exceeds the need", () => {
      const v = calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 1, wspolczynnikPhi: 1, masaPaneliStelazaKg: 100000 }).value
      expect(v.balastProjektowyKg).toBe(0)
    })

    it("vertical panel (90°): horizontal force, no uplift ballast", () => {
      const r = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 90, powierzchniaM2: 10, wspolczynnikPhi: 0 })
      expect(r.value.cf).toBe(1.8)
      expect(r.value.silaWiatruN).toBeCloseTo(1.8 * qp() * 10, 6)
      expect(r.value.balastProjektowyKg).toBeNull()
      expect(r.warnings.map((w) => w.code)).toContain("ZS-PION-SILA-POZIOMA")
    })

    it("rejects an empty area, φ outside 0–1 and a negative mass", () => {
      expect(calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 0, wspolczynnikPhi: 0 }).status).toBe("INVALID_INPUT")
      expect(calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 5, wspolczynnikPhi: 1.5 }).status).toBe("INVALID_INPUT")
      expect(calculateWiatrPowyzej30({ ...PELNY, powierzchniaM2: 5, wspolczynnikPhi: 0, masaPaneliStelazaKg: -1 }).status).toBe("INVALID_INPUT")
    })

    it("up to 30° there is still no own number, even with area and φ", () => {
      const r = calculateWiatrPowyzej30({ ...PELNY, nachylenieDeg: 20, powierzchniaM2: 10, wspolczynnikPhi: 0 })
      expect(r.status).toBe("OUT_OF_SCOPE")
      expect(r.value.silaWiatruN).toBeNull()
    })
  })
})
