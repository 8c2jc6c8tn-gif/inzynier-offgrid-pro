import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateCwuPompaCiepla } from "../calculator"

const baza = {
  pojemnoscL: 200,
  tStartC: 30,
  tKoniecC: 55,
  tMaxPompyC: 55,
  copCwu: 3.2,
  mocCieplnaPompyKw: 2.9,
  mocGrzalkiKw: 0,
  mocPvKw: 0,
}

describe("pompa ciepła w grzaniu C.W.U. (dawne 5.30 + 5.58)", () => {
  it("przykład 5.30: 200 l 30 → 55 °C, COP 3,2, 2,9 kW → ok. 1,8 kWh i 2 h", () => {
    const r = calculateCwuPompaCiepla(baza)
    const q = 200 * 25 * WSPOLCZYNNIK_KWH_NA_L_K
    expect(r.value.cieploPompaKwh).toBeCloseTo(q, 9)
    expect(r.value.energiaPompaKwh).toBeCloseTo(q / 3.2, 9)
    expect(r.value.energiaPompaKwh).toBeCloseTo(1.8, 1)
    expect(r.value.czasPompaH).toBeCloseTo(2, 1)
    expect(r.value.cieploGrzalkaKwh).toBe(0)
    expect(r.status).toBe("VALID")
  })

  it("przykład 5.58: 5,5 kWh ciepła — grzałka 5,5 kWh, pompa COP 3,06 → 1,8 kWh", () => {
    const tKoniecC = 30 + 5.5 / (200 * WSPOLCZYNNIK_KWH_NA_L_K)
    const r = calculateCwuPompaCiepla({ ...baza, tKoniecC, tMaxPompyC: 60, copCwu: 3.06 })
    expect(r.value.energiaSamaGrzalkaKwh).toBeCloseTo(5.5, 9)
    expect(r.value.energiaRazemKwh).toBeCloseTo(1.8, 1)
    expect(r.value.oszczednoscKwh).toBeCloseTo(5.5 - 5.5 / 3.06, 9)
  })

  it("60 °C przy pompie do 55 °C → ℹ️ reszta grzałką 2 kW; nadwyżka PV 0,5 kW → 🟡 część z baterii", () => {
    const r = calculateCwuPompaCiepla({ ...baza, tKoniecC: 60, mocGrzalkiKw: 2, mocPvKw: 0.5 })
    const qGrz = 200 * 5 * WSPOLCZYNNIK_KWH_NA_L_K
    expect(r.value.cieploGrzalkaKwh).toBeCloseTo(qGrz, 9)
    expect(r.value.czasGrzalkaH).toBeCloseTo(qGrz / 2, 9)
    expect(r.value.energiaRazemKwh).toBeCloseTo(r.value.energiaPompaKwh + qGrz, 9)
    expect(r.value.energiaZPvKwh).toBeCloseTo(0.5 * r.value.czasPompaH, 9)
    expect(r.value.energiaZBateriiKwh! + r.value.energiaZPvKwh!).toBeCloseTo(r.value.energiaPompaKwh, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["CWP-PRZEGRZEW-GRZALKA", "CWP-Z-BATERII", "GRZ-PV-STALA"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("start powyżej temperatury pompy → całość grzałką; brak COP → INCOMPLETE; COP 0,5 → INVALID_INPUT", () => {
    const r = calculateCwuPompaCiepla({ ...baza, tStartC: 56, tKoniecC: 60 })
    expect(r.value.cieploPompaKwh).toBe(0)
    expect(r.value.cieploGrzalkaKwh).toBeCloseTo(200 * 4 * WSPOLCZYNNIK_KWH_NA_L_K, 9)
    expect(calculateCwuPompaCiepla({ ...baza, copCwu: 0 }).status).toBe("INCOMPLETE")
    expect(calculateCwuPompaCiepla({ ...baza, copCwu: 0.5 }).status).toBe("INVALID_INPUT")
    expect(calculateCwuPompaCiepla({ ...baza, tKoniecC: 20 }).status).toBe("INVALID_INPUT")
  })
})
