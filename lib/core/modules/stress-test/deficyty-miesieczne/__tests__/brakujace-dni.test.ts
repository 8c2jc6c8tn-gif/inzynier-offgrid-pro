import { describe, expect, it } from "vitest"
import { calculateDeficytyMiesieczne } from "../calculator"
import { brakujaceDni, dataDnia, uzupelnijDni } from "../brakujace-dni"
import type { DeficytyMiesieczneInput, RokHistorii } from "../input"

const rok = (r: number, braki: number[] = []): RokHistorii => ({
  rok: r,
  dni: Array.from({ length: 365 }, (_, i) => (braki.includes(i + 1) ? null : 4)),
})

const WEJSCIE = (lata: RokHistorii[]): DeficytyMiesieczneInput => ({
  deficytyKwh: Array.from({ length: 12 }, () => 0),
  mocAgregatuKw: 5,
  zuzyciePaliwaLH: 1.5,
  cenaPaliwaZlL: 8,
  kosztSerwisuZlH: 0,
  zapasPaliwaL: 0,
  historia: { zrodlo: "wpisane-reczne", rodzaj: "produkcja-pv-kwh", lata },
  zapotrzebowanieDobaKwh: Array.from({ length: 12 }, () => 10),
  analizaHistorii: { oknoDni: 7, percentylPct: 0, progSlabegoDniaPct: 0 },
})

describe("brakujące dni historii (M7/E2 1.5.0, decyzja 2 A+B)", () => {
  it("lista tylko jawnie brakujących dni (null), nie dni po końcu wpisanych danych", () => {
    const krotki: RokHistorii = { rok: 2024, dni: [4, null, 4] }
    expect(brakujaceDni([rok(2023, [5, 40]), krotki])).toEqual([
      { rok: 2023, dzien: 5 },
      { rok: 2023, dzien: 40 },
      { rok: 2024, dzien: 2 },
    ])
  })

  it("data ISO dnia roku (rok przestępny: 60. dzień = 29 lutego)", () => {
    expect(dataDnia(2024, 60)).toBe("2024-02-29")
    expect(dataDnia(2023, 365)).toBe("2023-12-31")
  })

  it("uzupełnienie zastępuje tylko brakujące dni wartością ≥ 0, resztę zostawia", () => {
    const [r] = uzupelnijDni([rok(2023, [5])], [
      { rok: 2023, dzien: 5, wartosc: 1.5 },
      { rok: 2023, dzien: 6, wartosc: 9 }, // not missing — ignored
      { rok: 2022, dzien: 5, wartosc: 1 }, // other year — ignored
    ])
    expect(r!.dni[4]).toBe(1.5)
    expect(r!.dni[5]).toBe(4)
    const [bez] = uzupelnijDni([rok(2023, [5])], [{ rok: 2023, dzien: 5, wartosc: -1 }])
    expect(bez!.dni[4]).toBeNull()
  })

  it("🟡 DEFM-HISTORIA-BRAK-DNI z liczbą i pierwszymi datami; po uzupełnieniu znika", () => {
    const w = calculateDeficytyMiesieczne(WEJSCIE([rok(2023, [1, 2, 3, 4, 5, 6])]))
    const brak = w.warnings.find((x) => x.code === "DEFM-HISTORIA-BRAK-DNI")!
    expect(brak.level).toBe("warning")
    expect(brak.params).toEqual({ liczba: 6, dni: "2023-01-01, 2023-01-02, 2023-01-03, 2023-01-04, 2023-01-05, …" })
    const pelny = calculateDeficytyMiesieczne(WEJSCIE([rok(2023)]))
    expect(pelny.warnings.map((x) => x.code)).not.toContain("DEFM-HISTORIA-BRAK-DNI")
  })
})
