import { describe, expect, it } from "vitest"
import { calculateZuzyciePerUrzadzenie } from "../calculator"
import type { PozycjaZuzycia } from "../input"

const lodowka: PozycjaZuzycia = { id: "1", nazwa: "Lodówka turystyczna", mocW: 45, godzinNaDobe: 24, cykliczne: true, wspolczynnikPracyPct: 40 }
const led: PozycjaZuzycia = { id: "2", nazwa: "LED", mocW: 5, godzinNaDobe: 4, cykliczne: false, wspolczynnikPracyPct: 0 }

describe("calculateZuzyciePerUrzadzenie (M12/E11, dawne 8.15 + 8.23–8.28)", () => {
  it("przykład źródła: lodówka 45 W, 24 h, 40% → 432 Wh (źródło: „ok. 430 Wh, nie 1080 Wh”)", () => {
    const w = calculateZuzyciePerUrzadzenie({ urzadzenia: [lodowka] })
    expect(w.status).toBe("VALID")
    expect(w.value.urzadzenia[0]!.zuzycieWh).toBeCloseTo(432, 9)
    expect(w.value.urzadzenia[0]!.zuzycieZnamionoweWh).toBeCloseTo(1080, 9)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["ZPU-CYKLICZNE-REALNIE-MNIEJ", "info"]])
  })

  it("suma: lodówka 432 Wh + LED 5 W × 4 h (niecykliczne — współczynnik pomijany) = 452 Wh", () => {
    const w = calculateZuzyciePerUrzadzenie({ urzadzenia: [lodowka, led] })
    expect(w.value.sumaWh).toBeCloseTo(452, 9)
    expect(w.value.urzadzenia[1]!.zuzycieWh).toBe(20)
  })

  it("puste wiersze są pomijane; brak wypełnionych → INCOMPLETE", () => {
    const pusty: PozycjaZuzycia = { ...led, id: "3", mocW: 0 }
    expect(calculateZuzyciePerUrzadzenie({ urzadzenia: [pusty] }).status).toBe("INCOMPLETE")
    expect(calculateZuzyciePerUrzadzenie({ urzadzenia: [pusty, led] }).value.urzadzenia).toHaveLength(1)
  })

  it("urządzenie cykliczne bez współczynnika → INCOMPLETE (bez ukrytego domyślnego 40%)", () => {
    const w = calculateZuzyciePerUrzadzenie({ urzadzenia: [{ ...lodowka, wspolczynnikPracyPct: 0 }] })
    expect(w.status).toBe("INCOMPLETE")
  })

  it("cykliczne 100% → bez info (realne = znamionowe)", () => {
    const w = calculateZuzyciePerUrzadzenie({ urzadzenia: [{ ...lodowka, wspolczynnikPracyPct: 100 }] })
    expect(w.warnings).toEqual([])
  })

  it("godziny > 24, współczynnik > 100% lub moc ujemna → INVALID_INPUT z polem wiersza", () => {
    const w = calculateZuzyciePerUrzadzenie({
      urzadzenia: [{ ...led, godzinNaDobe: 25 }, { ...lodowka, wspolczynnikPracyPct: 120 }, { ...led, mocW: -1 }],
    })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["urzadzenia.0.godzinNaDobe", "urzadzenia.1.wspolczynnikPracyPct", "urzadzenia.2.mocW"])
  })
})
