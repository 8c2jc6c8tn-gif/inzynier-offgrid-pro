import { describe, expect, it } from "vitest"
import { calculateKrzywaGrzewcza } from "../calculator"
import type { KrzywaGrzewczaInput } from "../input"

const baza: KrzywaGrzewczaInput = {
  tZewn1C: 10,
  tZewn2C: -10,
  tZasil1C: 28,
  tZasil2C: 38,
  tZasilNowa1C: null,
  tZasilNowa2C: null,
  tOcenyC: 0,
  copObecny: 0,
  cieploSezonKwh: 0,
}

describe("krzywa grzewcza (dawne 5.71)", () => {
  it("przykład źródła: 28 °C przy 10 °C, 38 °C przy −10 °C → nachylenie 0,5, przy 0 °C zasilanie 33 °C", () => {
    const r = calculateKrzywaGrzewcza(baza)
    expect(r.value.nachylenie).toBeCloseTo(0.5, 9)
    expect(r.value.zasilanieC).toBeCloseTo(33, 9)
    expect(r.status).toBe("VALID")
  })

  it("krzywa niższa o 4 K przy COP 3,5 i 10 000 kWh ciepła → COP 3,78–3,92 (reguła 2–3%/°C ze źródła 5.69)", () => {
    const r = calculateKrzywaGrzewcza({ ...baza, tZasilNowa1C: 24, tZasilNowa2C: 34, copObecny: 3.5, cieploSezonKwh: 10000 })
    expect(r.value.obnizenieK).toBeCloseTo(4, 9)
    expect(r.value.copNowyMin).toBeCloseTo(3.5 * 1.08, 9)
    expect(r.value.copNowyMax).toBeCloseTo(3.5 * 1.12, 9)
    expect(r.value.oszczednoscMinKwh).toBeCloseTo(10000 / 3.5 - 10000 / (3.5 * 1.08), 9)
    expect(r.value.oszczednoscMaxKwh).toBeCloseTo(10000 / 3.5 - 10000 / (3.5 * 1.12), 9)
    expect(r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("KRZ-ZAL-COP-REGULA")
  })

  it("odczyt poza punktami → ℹ️; krzywa rosnąca z temperaturą zewnętrzną → 🟡", () => {
    expect(calculateKrzywaGrzewcza({ ...baza, tOcenyC: -20 }).warnings.map((w) => w.code)).toEqual(["KRZ-OCENA-POZA-PUNKTAMI"])
    const r = calculateKrzywaGrzewcza({ ...baza, tZasil1C: 38, tZasil2C: 28 })
    expect(r.warnings.map((w) => w.code)).toEqual(["KRZ-ROSNIE"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak punktu → INCOMPLETE; dwa punkty w tej samej temperaturze albo COP < 1 → INVALID_INPUT", () => {
    expect(calculateKrzywaGrzewcza({ ...baza, tZasil2C: null }).status).toBe("INCOMPLETE")
    expect(calculateKrzywaGrzewcza({ ...baza, tZewn2C: 10 }).status).toBe("INVALID_INPUT")
    expect(calculateKrzywaGrzewcza({ ...baza, copObecny: 0.5 }).status).toBe("INVALID_INPUT")
  })
})
