import { describe, expect, it } from "vitest"
import { calculateLadowanieZAgregatu } from "../calculator"
import type { LadowanieZAgregatuInput } from "../input"

const BAZA: LadowanieZAgregatuInput = {
  mocAgregatuKw: 6,
  mocLadowarkiKw: 4,
  mocOdbiornikowKw: 1,
  pojemnoscKwh: 20,
  socStartPct: 20,
  socStopPct: 80,
  sprawnoscLadowaniaPct: 95,
  zuzyciePaliwaLH: 1.8,
  cenaPaliwaZlL: 6.5,
}

describe("calculateLadowanieZAgregatu (M7, decyzja 1A z 05.10.2026)", () => {
  it("ładowarka mieści się w zapasie: 12 kWh do magazynu przy η 95% i 4 kW → t, paliwo, l/kWh", () => {
    const w = calculateLadowanieZAgregatu(BAZA)
    const e = 0.6 * 20
    const t = e / 0.95 / 4
    expect(w.status).toBe("VALID")
    expect(w.value.mocLadowaniaKw).toBe(4)
    expect(w.value.obciazeniePct).toBeCloseTo((5 / 6) * 100, 12)
    expect(w.value.energiaDoMagazynuKwh).toBeCloseTo(e, 12)
    expect(w.value.czasPracyH).toBeCloseTo(t, 12)
    expect(w.value.energiaAgregatuKwh).toBeCloseTo(5 * t, 12)
    expect(w.value.paliwoL).toBeCloseTo(1.8 * t, 12)
    expect(w.value.litryNaKwh).toBeCloseTo((1.8 * t) / (5 * t), 12)
    expect(w.value.litryNaKwhMagazynu).toBeCloseTo((1.8 * t) / e, 12)
    expect(w.value.kosztZl).toBeCloseTo(1.8 * t * 6.5, 12)
    expect(w.assumptions).toEqual([{ kod: "LADAG-ZALOZENIE-STALA-MOC" }])
  })

  it("ładowarka + odbiorniki > agregat → ładowanie do zapasu mocy i 🟡", () => {
    const w = calculateLadowanieZAgregatu({ ...BAZA, mocLadowarkiKw: 6 })
    expect(w.value.mocLadowaniaKw).toBe(5)
    expect(w.value.obciazeniePct).toBeCloseTo(100, 12)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["LADAG-LADOWANIE-OGRANICZONE", "warning"]])
  })

  it("odbiorniki ≥ moc agregatu → 🔴, bez wyniku", () => {
    const w = calculateLadowanieZAgregatu({ ...BAZA, mocOdbiornikowKw: 6 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["LADAG-BRAK-ZAPASU-MOCY", "critical"]])
    expect(w.value.czasPracyH).toBeNull()
  })

  it("bez zużycia l/h → czas jest, paliwa nie ma, ℹ️ z obciążeniem do odczytu z karty", () => {
    const w = calculateLadowanieZAgregatu({ ...BAZA, zuzyciePaliwaLH: null })
    expect(w.value.czasPracyH).not.toBeNull()
    expect(w.value.paliwoL).toBeNull()
    expect(w.value.kosztZl).toBeNull()
    expect(w.warnings[0]).toMatchObject({ code: "LADAG-ODCZYTAJ-ZUZYCIE", level: "info", params: { procent: 83 } })
    expect(w.status).toBe("VALID")
  })

  it("braki → INCOMPLETE; SOC stop ≤ start, η 0, ujemna moc → INVALID_INPUT", () => {
    expect(calculateLadowanieZAgregatu({ ...BAZA, mocOdbiornikowKw: null }).status).toBe("INCOMPLETE")
    expect(calculateLadowanieZAgregatu({ ...BAZA, socStopPct: 20 }).status).toBe("INVALID_INPUT")
    expect(calculateLadowanieZAgregatu({ ...BAZA, sprawnoscLadowaniaPct: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateLadowanieZAgregatu({ ...BAZA, mocAgregatuKw: -1 }).status).toBe("INVALID_INPUT")
  })
})
