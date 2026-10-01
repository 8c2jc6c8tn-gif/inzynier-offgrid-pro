import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../zapotrzebowanie-co-cwu/constants"
import { calculateGrzalkaCwu } from "../calculator"
import type { GrzalkaCwuInput } from "../input"

const BAZA: GrzalkaCwuInput = {
  pojemnoscL: 200,
  tStartC: 10,
  tKoniecC: 50,
  mocGrzalkiKw: 2,
  mocPvKw: 0,
  sterowanie: null,
  mocFalownikaKw: 0,
}

const Q = 200 * 40 * WSPOLCZYNNIK_KWH_NA_L_K

describe("calculateGrzalkaCwu (M6/E18, dawne 5.22)", () => {
  it("przykład źródła: 2 kW, 200 l, 10 → 50 °C → 9,30 kWh, 4,65 h (źródło: 9,2 kWh, 4,6 h — zaokrąglenie)", () => {
    const w = calculateGrzalkaCwu(BAZA)
    expect(w.value.cieploKwh).toBeCloseTo(Q, 12)
    expect(w.value.cieploKwh).toBeCloseTo(9.302, 3)
    expect(w.value.czasH).toBeCloseTo(4.651, 3)
    expect(w.value.energiaZPvKwh).toBeNull()
    expect(w.status).toBe("VALID")
  })

  it("niespójność źródła: „PV 3 kW → 3 h” — grzałka 2 kW z regulatorem nadal 4,65 h; 3,1 h dopiero dla grzałki 3 kW", () => {
    const dwa = calculateGrzalkaCwu({ ...BAZA, mocPvKw: 3, sterowanie: "regulator-pv" })
    expect(dwa.value.czasH).toBeCloseTo(Q / 2, 12)
    expect(dwa.value.energiaZBateriiKwh).toBe(0)
    const trzy = calculateGrzalkaCwu({ ...BAZA, mocGrzalkiKw: 3, mocPvKw: 3, sterowanie: "regulator-pv" })
    expect(trzy.value.czasH).toBeCloseTo(3.1, 2)
  })

  it("regulator PV przy nadwyżce 1 kW: grzeje 2× dłużej, całość z PV", () => {
    const w = calculateGrzalkaCwu({ ...BAZA, mocPvKw: 1, sterowanie: "regulator-pv" })
    expect(w.value.czasH).toBeCloseTo(Q, 12)
    expect(w.value.energiaZPvKwh).toBeCloseTo(Q, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["GRZ-PV-STALA"])
  })

  it("stała moc przy nadwyżce 1 kW: połowa z PV, połowa z baterii (ℹ️)", () => {
    const w = calculateGrzalkaCwu({ ...BAZA, mocPvKw: 1, sterowanie: "stala" })
    expect(w.value.czasH).toBeCloseTo(Q / 2, 12)
    expect(w.value.energiaZPvKwh).toBeCloseTo(Q / 2, 12)
    expect(w.value.energiaZBateriiKwh).toBeCloseTo(Q / 2, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["GRZ-Z-BATERII", "GRZ-PV-STALA"])
  })

  it("🟡 źródła: grzałka 2 kW > falownik 1,5 kW", () => {
    const w = calculateGrzalkaCwu({ ...BAZA, mocFalownikaKw: 1.5 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["GRZ-PONAD-FALOWNIK", "warning"]])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(calculateGrzalkaCwu({ ...BAZA, mocFalownikaKw: 2 }).warnings).toEqual([])
  })

  it("brak danych albo PV bez sterowania → INCOMPLETE; temperatura końcowa ≤ startowej → INVALID_INPUT", () => {
    expect(calculateGrzalkaCwu({ ...BAZA, mocGrzalkiKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateGrzalkaCwu({ ...BAZA, mocPvKw: 2 }).status).toBe("INCOMPLETE")
    expect(calculateGrzalkaCwu({ ...BAZA, tKoniecC: 10 }).warnings[0]!.code).toBe("GRZ-TEMPERATURA-POZA-ZAKRESEM")
  })
})
