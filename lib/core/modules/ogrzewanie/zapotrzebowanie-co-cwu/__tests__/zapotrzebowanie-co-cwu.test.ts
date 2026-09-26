import { describe, expect, it } from "vitest"
import { calculateZapotrzebowanieCoCwu } from "../calculator"
import type { ZapotrzebowanieCoCwuInput } from "../input"

const miesiace = (wartosci: Record<number, number>) => Array.from({ length: 12 }, (_, i) => wartosci[i + 1] ?? null)

const BAZA: ZapotrzebowanieCoCwuInput = {
  cieploCoMiesiaceKwh: miesiace({ 1: 1240, 12: 930 }),
  liczbaOsob: 4,
  cwuLitrowNaOsobeDoba: 50,
  temperaturaZimnejWodyC: 10,
  temperaturaCwuC: 53,
  copCo: 3,
  copCwu: 1,
}

describe("calculateZapotrzebowanieCoCwu (M6/E2, dawne 5.2)", () => {
  it("C.W.U. = n·V·ΔT·c; C.O. na dobę = ciepło miesiąca z E1 ÷ dni (wartości z Pythona)", () => {
    const w = calculateZapotrzebowanieCoCwu(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    const v = w.value!
    expect(v.cwuLitrowDoba).toBe(200)
    expect(v.deltaTK).toBe(43)
    expect(v.cwuKwhDoba).toBeCloseTo(9.999888888888888, 12)
    expect(v.miesiace).toHaveLength(2)
    const sty = v.miesiace![0]!
    expect(sty).toMatchObject({ miesiac: 1, coKwhDoba: 40, coKwhMiesiac: 1240 })
    expect(sty.razemKwhDoba).toBeCloseTo(49.99988888888889, 12)
    expect(sty.cwuKwhMiesiac).toBeCloseTo(309.9965555555555, 10)
    expect(sty.pradKwhDoba).toBeCloseTo(23.333222222222222, 12)
    expect(sty.udzialCwuPct).toBeCloseTo(19.99982222182716, 10)
    expect(v.miesiace![1]).toMatchObject({ miesiac: 12, coKwhDoba: 30 })
    expect(v.coSumaKwh).toBe(2170)
    expect(v.cwuSumaMiesiecyKwh).toBeCloseTo(619.993111111111, 10)
  })

  it("przykład źródła „C.W.U. 10 kWh/dobę” — np. 4 osoby × 50 l × 43 K (ilustracja, nie dane źródła)", () => {
    expect(calculateZapotrzebowanieCoCwu(BAZA).value!.cwuKwhDoba).toBeCloseTo(10, 3)
  })

  it("bez miesięcy z E1 → tylko C.W.U. + informacja, bez zgadywania C.O.", () => {
    const w = calculateZapotrzebowanieCoCwu({ ...BAZA, cieploCoMiesiaceKwh: Array(12).fill(null) })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value!.miesiace).toBeNull()
    expect(w.value!.coSumaKwh).toBeNull()
    expect(w.warnings.map((x) => x.code)).toContain("COCWU-BRAK-MIESIECY-CO")
  })

  it("prąd tylko gdy podane oba COP", () => {
    const w = calculateZapotrzebowanieCoCwu({ ...BAZA, copCo: null })
    expect(w.value!.miesiace![0]!.pradKwhDoba).toBeNull()
    expect(w.value!.cwuPradKwhDoba).toBeCloseTo(9.999888888888888, 12)
    expect(calculateZapotrzebowanieCoCwu({ ...BAZA, copCwu: null }).value!.cwuPradKwhDoba).toBeNull()
  })

  it("brak danych C.W.U. → INCOMPLETE (bez domyślnych temperatur wody)", () => {
    expect(calculateZapotrzebowanieCoCwu({ ...BAZA, temperaturaZimnejWodyC: null }).status).toBe("INCOMPLETE")
    expect(calculateZapotrzebowanieCoCwu({ ...BAZA, liczbaOsob: null }).status).toBe("INCOMPLETE")
  })

  it("woda ciepła nie cieplejsza od zimnej → INVALID_INPUT (critical)", () => {
    const w = calculateZapotrzebowanieCoCwu({ ...BAZA, temperaturaCwuC: 10 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]).toMatchObject({ code: "COCWU-CWU-NIE-CIEPLEJSZA", level: "critical" })
  })

  it("walidacja: osoby niecałkowite, litry ≤ 0, ujemne ciepło miesiąca, COP ≤ 0", () => {
    const kody = (i: Partial<ZapotrzebowanieCoCwuInput>) => calculateZapotrzebowanieCoCwu({ ...BAZA, ...i }).warnings.map((w) => w.field)
    expect(kody({ liczbaOsob: 2.5 })).toContain("liczbaOsob")
    expect(kody({ cwuLitrowNaOsobeDoba: 0 })).toContain("cwuLitrowNaOsobeDoba")
    expect(kody({ cieploCoMiesiaceKwh: miesiace({ 3: -1 }) })).toContain("cieploCoMiesiaceKwh.2")
    expect(kody({ copCo: 0 })).toContain("copCo")
    expect(kody({ copCwu: -1 })).toContain("copCwu")
  })

  it("założenia jako {kod, params} — bez gotowego tekstu w domenie", () => {
    const w = calculateZapotrzebowanieCoCwu(BAZA)
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toEqual([
      "COCWU-ZALOZENIE-LITRY",
      "COCWU-ZALOZENIE-STALA-TEMP-WODY",
      "COCWU-ZALOZENIE-CO-Z-EKRANU-1",
      "COCWU-ZALOZENIE-COP-CO",
      "COCWU-ZALOZENIE-COP-CWU",
    ])
  })
})
