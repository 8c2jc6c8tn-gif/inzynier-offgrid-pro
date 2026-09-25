import { describe, expect, it } from "vitest"
import { calculateTrackerVsStaly } from "../calculator"
import { validateInput } from "../validation"

const PRZYKLAD = { liczbaPaneliTracker: 9, kosztTrackeraZl: 6000, kosztPaneluZl: 1000, uzyskPaneluKwh: 450 }

describe("calculateTrackerVsStaly (M3/E3)", () => {
  it("scenariusz źródła: tracker 6000 zł, panel 1000 zł → +6 paneli, 15 na stałym stelażu", () => {
    const wynik = calculateTrackerVsStaly(PRZYKLAD)
    expect(wynik.status).toBe("VALID")
    expect(wynik.value.dodatkowePanele).toBe(6)
    expect(wynik.value.liczbaPaneliStaly).toBe(15)
    // 15 × 450 = 6750; tracker 9 × 450 × 1,3 = 5265 … × 1,4 = 5670
    expect(wynik.value.uzyskStalyKwh).toBeCloseTo(6750, 9)
    expect(wynik.value.uzyskTrackerMinKwh).toBeCloseTo(5265, 9)
    expect(wynik.value.uzyskTrackerMaxKwh).toBeCloseTo(5670, 9)
    expect(wynik.value.przewagaStalegoMinPct).toBeCloseTo((6750 / 5670 - 1) * 100, 9)
    expect(wynik.value.przewagaStalegoMaxPct).toBeCloseTo((6750 / 5265 - 1) * 100, 9)
    expect(wynik.value.werdykt).toBe("staly")
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([["TVS-NAPOR-WIATRU-TRACKERA", "info"]])
  })

  it("tani tracker (1 panel dodatkowy) → tracker wygrywa w całym zakresie 30–40%", () => {
    const wynik = calculateTrackerVsStaly({ ...PRZYKLAD, kosztTrackeraZl: 1500 })
    expect(wynik.value.dodatkowePanele).toBe(1)
    expect(wynik.value.werdykt).toBe("tracker")
    expect(wynik.value.przewagaStalegoMaxPct).toBeLessThan(0)
  })

  it("wynik pośredni: 3 panele dodatkowe przy 9 → 12/9 = +33%, wewnątrz zakresu → „zalezy”", () => {
    const wynik = calculateTrackerVsStaly({ ...PRZYKLAD, kosztTrackeraZl: 3000 })
    expect(wynik.value.werdykt).toBe("zalezy")
    expect(wynik.value.przewagaStalegoMinPct).toBeLessThan(0)
    expect(wynik.value.przewagaStalegoMaxPct).toBeGreaterThan(0)
  })

  it("dokupienie zaokrąglone w dół (6999 zł / 1000 zł → 6), równy podział bez błędu float", () => {
    expect(calculateTrackerVsStaly({ ...PRZYKLAD, kosztTrackeraZl: 6999 }).value.dodatkowePanele).toBe(6)
    expect(calculateTrackerVsStaly({ ...PRZYKLAD, kosztTrackeraZl: 0.3, kosztPaneluZl: 0.1 }).value.dodatkowePanele).toBe(3)
  })

  it("tracker tańszy niż panel → 0 dodatkowych paneli, informacja TVS-ZERO-DODATKOWYCH-PANELI, status VALID", () => {
    const wynik = calculateTrackerVsStaly({ ...PRZYKLAD, kosztTrackeraZl: 500 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.value.dodatkowePanele).toBe(0)
    expect(wynik.value.werdykt).toBe("tracker")
    expect(wynik.warnings.map((w) => w.code)).toContain("TVS-ZERO-DODATKOWYCH-PANELI")
  })

  it("brak którejkolwiek danej (0) → INCOMPLETE bez ostrzeżeń", () => {
    for (const pole of Object.keys(PRZYKLAD) as (keyof typeof PRZYKLAD)[]) {
      const wynik = calculateTrackerVsStaly({ ...PRZYKLAD, [pole]: 0 })
      expect(wynik.status, pole).toBe("INCOMPLETE")
      expect(wynik.warnings).toEqual([])
    }
  })

  it("wartość ujemna albo ułamek panelu → INVALID_INPUT", () => {
    expect(calculateTrackerVsStaly({ ...PRZYKLAD, kosztPaneluZl: -1 }).status).toBe("INVALID_INPUT")
    const ulamek = calculateTrackerVsStaly({ ...PRZYKLAD, liczbaPaneliTracker: 8.5 })
    expect(ulamek.status).toBe("INVALID_INPUT")
    expect(ulamek.warnings[0].i18nKey).toBe("TVS-LICZBA-NIECALKOWITA")
  })

  it("K3: validateInput — ujemna liczba paneli daje tylko WARTOSC-UJEMNA (bez zdublowanej niecałkowitej)", () => {
    expect(validateInput({ ...PRZYKLAD, liczbaPaneliTracker: -1.5 }).errors.map((e) => e.code)).toEqual(["WARTOSC-UJEMNA"])
    expect(validateInput(PRZYKLAD).errors).toEqual([])
  })
})
