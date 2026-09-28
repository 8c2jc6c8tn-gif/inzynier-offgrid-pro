import { describe, expect, it } from "vitest"
import { calculateAgregatWMrozie } from "../calculator"
import type { AgregatWMrozieInput } from "../input"

const PUSTY: AgregatWMrozieInput = {
  paliwo: null,
  temperaturaMiejscaC: null,
  wymaganyCzasPracyH: null,
  maxPracaCiaglaH: null,
  przerwaH: null,
  zuzyciePaliwaLH: null,
  interwalWymianyOlejuH: null,
  dniPostoju: null,
}
const PRACA: AgregatWMrozieInput = {
  ...PUSTY,
  wymaganyCzasPracyH: 120,
  maxPracaCiaglaH: 8,
  przerwaH: 1,
  zuzyciePaliwaLH: 1.5,
  interwalWymianyOlejuH: 50,
}

describe("calculateAgregatWMrozie (M7/E8, dawne 6.9/6.23/6.36)", () => {
  it("przykład źródła: 120 h pracy, 8 h ciągle / 1 h przerwy → 180 l, 2 wymiany oleju", () => {
    const w = calculateAgregatWMrozie(PRACA)
    expect(w.value.paliwoL).toBeCloseTo(180, 12)
    expect(w.value.wymianyOleju).toBe(2)
    expect(w.value.liczbaPrzerw).toBe(14)
    expect(w.value.czasKalendarzowyH).toBe(134)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["AGREGAT-PRZERWY"])
  })

  it("czas pracy równy wielokrotności limitu → bez przerwy na końcu (16 h / 8 h → 1 przerwa)", () => {
    const w = calculateAgregatWMrozie({ ...PRACA, wymaganyCzasPracyH: 16 })
    expect(w.value.liczbaPrzerw).toBe(1)
    expect(w.value.czasKalendarzowyH).toBe(17)
  })

  it("brak limitu pracy ciągłej / oleju / zużycia → pola null, bez zgadywania", () => {
    const w = calculateAgregatWMrozie({ ...PUSTY, wymaganyCzasPracyH: 24 })
    expect(w.value).toEqual({ paliwoL: null, wymianyOleju: null, liczbaPrzerw: null, czasKalendarzowyH: null })
    expect(w.status).toBe("VALID")
  })

  it("postój 14 dni w garażu −20°C → 🟡 (próg 2+ tygodnie ze źródła); 13 dni albo +5°C → bez", () => {
    const postoj = { ...PUSTY, temperaturaMiejscaC: -20, dniPostoju: 14 }
    const w = calculateAgregatWMrozie(postoj)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["AGREGAT-DLUGI-POSTOJ"])
    expect(calculateAgregatWMrozie({ ...postoj, dniPostoju: 13 }).warnings).toEqual([])
    expect(calculateAgregatWMrozie({ ...postoj, temperaturaMiejscaC: 5 }).warnings).toEqual([])
  })

  it("D32: zwykły diesel +6°C → nic; +5°C → 🟡; 0°C → 🔴 (bez 🟡 naraz)", () => {
    const kody = (t: number) =>
      calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-zwykly", temperaturaMiejscaC: t }).warnings
        .filter((x) => x.code.startsWith("AGREGAT-DIESEL"))
        .map((x) => [x.code, x.level])
    expect(kody(6)).toEqual([])
    expect(kody(5)).toEqual([["AGREGAT-DIESEL-RYZYKO-ROZRUCHU", "warning"]])
    expect(kody(0)).toEqual([["AGREGAT-DIESEL-PARAFINIZACJA", "critical"]])
    const w = calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-zwykly", temperaturaMiejscaC: 0 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("D32: każdy diesel od −10°C → 🟡 akumulator/świece; arktyczny bez parafinizacji", () => {
    const zwykly = calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-zwykly", temperaturaMiejscaC: -15 })
    expect(zwykly.warnings.map((x) => x.code)).toEqual([
      "AGREGAT-PRZERWY",
      "AGREGAT-DIESEL-PARAFINIZACJA",
      "AGREGAT-DIESEL-ROZRUCH-MROZ",
    ])
    const arktyczny = (t: number) =>
      calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-arktyczny", temperaturaMiejscaC: t }).warnings.map((x) => x.code)
    expect(arktyczny(-10)).toEqual(["AGREGAT-PRZERWY", "AGREGAT-DIESEL-ROZRUCH-MROZ"])
    expect(arktyczny(-9)).toEqual(["AGREGAT-PRZERWY"])
  })

  it("D32: benzyna w mrozie → tylko ℹ️ (olej zimowy, świeca); 0°C → nic", () => {
    const w = calculateAgregatWMrozie({ ...PRACA, paliwo: "benzyna", temperaturaMiejscaC: -1 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["AGREGAT-PRZERWY", "info"], ["AGREGAT-BENZYNA-MROZ", "info"]])
    expect(w.status).toBe("VALID")
    const zero = calculateAgregatWMrozie({ ...PRACA, paliwo: "benzyna", temperaturaMiejscaC: 0 })
    expect(zero.warnings.map((x) => x.code)).toEqual(["AGREGAT-PRZERWY"])
  })

  it("1.1.0: samo paliwo + temperatura → werdykt rozruchu (bez scenariusza pracy)", () => {
    const w = calculateAgregatWMrozie({ ...PUSTY, paliwo: "diesel-zwykly", temperaturaMiejscaC: -2 })
    expect(w.warnings.map((x) => x.code)).toEqual(["AGREGAT-DIESEL-PARAFINIZACJA"])
    expect(calculateAgregatWMrozie({ ...PUSTY, temperaturaMiejscaC: -2 }).status).toBe("INCOMPLETE")
  })

  it("puste → INCOMPLETE; wartość ujemna → INVALID_INPUT", () => {
    expect(calculateAgregatWMrozie(PUSTY).status).toBe("INCOMPLETE")
    const w = calculateAgregatWMrozie({ ...PRACA, zuzyciePaliwaLH: -1 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("zuzyciePaliwaLH")
  })
})
