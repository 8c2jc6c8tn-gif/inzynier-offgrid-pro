import { describe, expect, it } from "vitest"
import { calculateDeficytyMiesieczne } from "../calculator"
import type { DeficytyMiesieczneInput } from "../input"

const dwanascie = (zmiany: Record<number, number>) => Array.from({ length: 12 }, (_, i) => zmiany[i + 1] ?? 0)

const BAZA: DeficytyMiesieczneInput = {
  deficytyKwh: dwanascie({ 12: 120 }),
  mocAgregatuKw: 5,
  zuzyciePaliwaLH: 1.5,
  cenaPaliwaZlL: 350 / 45,
  kosztSerwisuZlH: 0,
  zapasPaliwaL: 0,
}

describe("calculateDeficytyMiesieczne (M7/E2, dawne 6.2)", () => {
  it("przykład źródła: grudzień 120 kWh → agregat 5 kW → 30 h → 45 l → 350 zł (1,5 l/h i 350/45 zł/l dopisane)", () => {
    const w = calculateDeficytyMiesieczne(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.miesiace).toHaveLength(1)
    const g = w.value.miesiace[0]!
    expect(g.miesiac).toBe(12)
    expect(g.godzinyPracy).toBeCloseTo(30, 12)
    expect(g.paliwoL).toBeCloseTo(45, 12)
    expect(g.kosztZl).toBeCloseTo(350, 9)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["DEFM-SPRAWDZ-ZAPAS", "info"]])
  })

  it("🟡 źródła: luty 40 h (160 kWh) przy zapasie 50 l → paliwo 60 l ponad zapas", () => {
    const w = calculateDeficytyMiesieczne({ ...BAZA, deficytyKwh: dwanascie({ 2: 160, 12: 120 }), zapasPaliwaL: 50 })
    expect(w.value.miesiace.map((m) => m.godzinyPracy)).toEqual([40, 30])
    expect(w.value.miesiacNajdluzszy).toBe(2)
    expect(w.warnings.map((x) => [x.code, x.params?.miesiac])).toEqual([["DEFM-PALIWO-PONAD-ZAPAS", 2]])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("sumy sezonu i koszt serwisu na motogodzinę", () => {
    const w = calculateDeficytyMiesieczne({ ...BAZA, deficytyKwh: dwanascie({ 1: 80, 2: 160, 12: 120 }), kosztSerwisuZlH: 2 })
    expect(w.value.sumaDeficytKwh).toBe(360)
    expect(w.value.sumaGodzin).toBeCloseTo(90, 12)
    expect(w.value.sumaPaliwaL).toBeCloseTo(135, 12)
    expect(w.value.sumaKosztZl).toBeCloseTo(135 * (350 / 45) + 90 * 2, 9)
  })

  it("brak danych → INCOMPLETE; ujemne albo nie 12 miesięcy → INVALID_INPUT", () => {
    expect(calculateDeficytyMiesieczne({ ...BAZA, deficytyKwh: dwanascie({}) }).status).toBe("INCOMPLETE")
    expect(calculateDeficytyMiesieczne({ ...BAZA, mocAgregatuKw: 0 }).status).toBe("INCOMPLETE")
    expect(calculateDeficytyMiesieczne({ ...BAZA, zapasPaliwaL: -1 }).warnings[0]!.code).toBe("DEFM-WARTOSC-UJEMNA")
    expect(calculateDeficytyMiesieczne({ ...BAZA, deficytyKwh: [1, 2] }).warnings[0]!.code).toBe("DEFM-MIESIACE-NIE-12")
  })
})
