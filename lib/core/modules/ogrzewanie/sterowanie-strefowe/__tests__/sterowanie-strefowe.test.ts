import { describe, expect, it } from "vitest"
import { calculateSterowanieStrefowe } from "../calculator"
import type { SterowanieStrefoweInput } from "../input"

const BAZA: SterowanieStrefoweInput = {
  strefy: [{ nazwa: "Dom", hWK: 100, tKomfortC: 20, tObnizonaC: 14, godzinObnizenia: 14.4 }],
  tZewnC: 0,
  liczbaSilownikow: 10,
  mocSilownikaW: 2,
  godzinPracySilownikow: 24,
  mocSterownikowW: 5,
  copOgrzewania: 3,
}

describe("calculateSterowanieStrefowe (M6/E16, dawne 5.16)", () => {
  it("przykład źródła „18%”: H = 100 W/K, 20 → 14 °C przez 14,4 h przy 0 °C (Python: 48 → 39,36 kWh)", () => {
    const w = calculateSterowanieStrefowe(BAZA)
    expect(w.value.cieploBezStrefKwh).toBeCloseTo(48, 12)
    expect(w.value.cieploZeStrefamiKwh).toBeCloseTo(39.36, 12)
    expect(w.value.oszczednoscPct).toBeCloseTo(18, 12)
    // 10 × 2 W × 24 h + 5 W × 24 h = 600 Wh
    expect(w.value.pradSterowaniaKwh).toBeCloseTo(0.6, 12)
    expect(w.value.oszczednoscPraduKwh).toBeCloseTo(8.64 / 3, 12)
    expect(w.value.bilansPraduKwh).toBeCloseTo(8.64 / 3 - 0.6, 12)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["STREF-STAN-USTALONY"])
  })

  it("kilka stref, jedna bez obniżenia: salon 21 °C cały czas, sypialnia 21 → 17 °C przez 16 h, −5 °C", () => {
    const w = calculateSterowanieStrefowe({
      ...BAZA,
      tZewnC: -5,
      strefy: [
        { nazwa: "Salon", hWK: 80, tKomfortC: 21, tObnizonaC: null, godzinObnizenia: 0 },
        { nazwa: "Sypialnia", hWK: 40, tKomfortC: 21, tObnizonaC: 17, godzinObnizenia: 16 },
      ],
    })
    // bez: (80 + 40) × 26 × 24 = 74 880 Wh; zysk: 40 × 4 × 16 = 2560 Wh
    expect(w.value.cieploBezStrefKwh).toBeCloseTo(74.88, 12)
    expect(w.value.oszczednoscCieplaKwh).toBeCloseTo(2.56, 12)
  })

  it("🟡 źródła: siłowniki zjadają zysk (COP 4, mały zysk 1 kWh ciepła → 0,25 kWh vs 0,6 kWh)", () => {
    const w = calculateSterowanieStrefowe({
      ...BAZA,
      copOgrzewania: 4,
      strefy: [{ nazwa: "Pokój", hWK: 50, tKomfortC: 20, tObnizonaC: 16, godzinObnizenia: 5 }],
    })
    expect(w.value.oszczednoscCieplaKwh).toBeCloseTo(1, 12)
    expect(w.value.bilansPraduKwh).toBeCloseTo(0.25 - 0.6, 12)
    expect(w.warnings.map((x) => [x.code, x.level])).toContainEqual(["STREF-SILOWNIKI-ZJADAJA-ZYSK", "warning"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("ogrzewanie nieelektryczne (COP 0) → bez bilansu prądu, ℹ️", () => {
    const w = calculateSterowanieStrefowe({ ...BAZA, copOgrzewania: 0 })
    expect(w.value.bilansPraduKwh).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["STREF-STAN-USTALONY", "STREF-BEZ-COP"])
  })

  it("temperatura zewnętrzna wyższa niż obniżona → brak ciepła w obniżeniu, bez ujemnych wartości", () => {
    const w = calculateSterowanieStrefowe({ ...BAZA, tZewnC: 16 })
    // bez: 100 × 4 × 24 = 9600 Wh; ze: 100 × 4 × 9,6 + 0 = 3840 Wh
    expect(w.value.cieploZeStrefamiKwh).toBeCloseTo(3.84, 12)
  })

  it("obniżona wyższa niż komfortowa → INVALID_INPUT; brak stref albo temperatury → INCOMPLETE", () => {
    const zle = calculateSterowanieStrefowe({ ...BAZA, strefy: [{ nazwa: "", hWK: 10, tKomfortC: 18, tObnizonaC: 20, godzinObnizenia: 8 }] })
    expect(zle.status).toBe("INVALID_INPUT")
    expect(zle.warnings[0]!.code).toBe("STREF-OBNIZONA-POZA-ZAKRESEM")
    expect(calculateSterowanieStrefowe({ ...BAZA, strefy: [] }).status).toBe("INCOMPLETE")
    expect(calculateSterowanieStrefowe({ ...BAZA, tZewnC: null }).status).toBe("INCOMPLETE")
    expect(calculateSterowanieStrefowe({ ...BAZA, godzinPracySilownikow: 25 }).status).toBe("INVALID_INPUT")
  })
})
