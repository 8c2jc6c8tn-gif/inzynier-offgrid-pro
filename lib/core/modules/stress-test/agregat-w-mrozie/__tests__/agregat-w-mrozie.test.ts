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

  it("zwykły diesel w mrozie → tylko info (próg parafinizacji do decyzji właściciela)", () => {
    const w = calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-zwykly", temperaturaMiejscaC: -15 })
    expect(w.warnings.find((x) => x.code === "AGREGAT-DIESEL-PARAFINIZACJA")!.level).toBe("info")
    expect(w.status).toBe("VALID")
    const arktyczny = calculateAgregatWMrozie({ ...PRACA, paliwo: "diesel-arktyczny", temperaturaMiejscaC: -15 })
    expect(arktyczny.warnings.some((x) => x.code === "AGREGAT-DIESEL-PARAFINIZACJA")).toBe(false)
  })

  it("puste → INCOMPLETE; wartość ujemna → INVALID_INPUT", () => {
    expect(calculateAgregatWMrozie(PUSTY).status).toBe("INCOMPLETE")
    const w = calculateAgregatWMrozie({ ...PRACA, zuzyciePaliwaLH: -1 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("zuzyciePaliwaLH")
  })
})
