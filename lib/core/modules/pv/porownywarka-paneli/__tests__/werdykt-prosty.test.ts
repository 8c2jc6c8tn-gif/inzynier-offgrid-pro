import { describe, expect, it } from "vitest"
import type { PorownywarkaResult, ScenariuszWiecejPaneli, WynikPanelu } from "../calculator"
import { PROG_BEZ_ROZNICY_ZIMA_PROC, werdyktProsty } from "../werdykt-prosty"

const panel = (id: string, zimaKwh: number, kosztZimowejKwhZl: number | null) => ({ id, nazwa: id, zimaKwh, kosztZimowejKwhZl }) as WynikPanelu
const wynik = (panele: WynikPanelu[], roznicaZl: number | null = null, scenariusze: ScenariuszWiecejPaneli[] = []) => {
  const posortowane = [...panele].sort((a, b) => b.zimaKwh - a.zimaKwh)
  const roznicaZimowa =
    panele.length < 2 ? null : { liderId: posortowane[0]!.id, drugiId: posortowane[1]!.id, roznicaKwh: posortowane[0]!.zimaKwh - posortowane[1]!.zimaKwh, roznicaZl }
  return { panele, roznicaZimowa, scenariusze } as Pick<PorownywarkaResult, "panele" | "roznicaZimowa" | "scenariusze">
}
const scen = (zima: number, x: number): ScenariuszWiecejPaneli => ({ tanszyId: "t", drozszyId: "d", dodatkowePanele: x, przewagaZimaKwh: zima }) as ScenariuszWiecejPaneli

describe("werdyktProsty", () => {
  it("no computed panel = no result; one panel = nothing to compare", () => {
    expect(werdyktProsty(wynik([]))).toEqual({ rodzaj: "brak-wyniku" })
    expect(werdyktProsty(wynik([panel("a", 100, 1)]))).toEqual({ rodzaj: "jeden-panel", panelId: "a" })
  })

  it("the same panel wins winter energy and winter cost: choose it. 120 vs 100 kWh = +20% of the weaker", () => {
    const w = werdyktProsty(wynik([panel("a", 120, 0.8), panel("b", 100, 1.0)]))
    expect(w).toMatchObject({ rodzaj: "porownanie", liderZimyId: "a", drugiId: "b", roznicaZimaKwh: 20, zimaBezRoznicy: false, najtanszyId: "a" })
    expect((w as { roznicaZimaProc: number }).roznicaZimaProc).toBeCloseTo(20, 10)
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "wybierz", panelId: "a", powod: "zima-i-cena" })
  })

  it("winter leader is not the cheapest winter kWh: a trade-off, nothing is chosen for the user", () => {
    const w = werdyktProsty(wynik([panel("a", 120, 1.2), panel("b", 100, 0.9)]))
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "kompromis", liderZimyId: "a", najtanszyId: "b" })
  })

  it("no prices: the winter leader is recommended on winter alone", () => {
    const w = werdyktProsty(wynik([panel("a", 120, null), panel("b", 100, null)]))
    expect((w as { rekomendacja: unknown; najtanszyId: unknown }).rekomendacja).toEqual({ rodzaj: "wybierz", panelId: "a", powod: "zima" })
    expect((w as { najtanszyId: unknown }).najtanszyId).toBeNull()
  })

  it("a price on one panel only cannot decide a cheapest panel", () => {
    const w = werdyktProsty(wynik([panel("a", 120, 1.2), panel("b", 100, null)]))
    expect((w as { najtanszyId: unknown }).najtanszyId).toBeNull()
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "wybierz", panelId: "a", powod: "zima" })
  })

  it("winter tie (100.4 vs 100 = 0.4% < 0.5%): the cheaper winter kWh decides, even if it is the weaker panel", () => {
    const w = werdyktProsty(wynik([panel("a", 100.4, 1.2), panel("b", 100, 0.9)]))
    expect(w).toMatchObject({ zimaBezRoznicy: true })
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "wybierz", panelId: "b", powod: "cena-przy-remisie" })
  })

  it("in a tie a much weaker but cheaper panel is not recommended: only panels tied with the leader compete on price", () => {
    // a 100.4, b 100 (tie), c 80 and the cheapest; the choice is between a and b only
    const w = werdyktProsty(wynik([panel("a", 100.4, 1.2), panel("b", 100, 0.9), panel("c", 80, 0.5)]))
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "wybierz", panelId: "b", powod: "cena-przy-remisie" })
    expect((w as { najtanszyId: unknown }).najtanszyId).toBe("c")
  })

  it("in a tie with a price on only one of the tied panels nothing can be decided", () => {
    const w = werdyktProsty(wynik([panel("a", 100.4, null), panel("b", 100, 0.9), panel("c", 80, 0.5)]))
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "bez-roznicy" })
  })

  it("winter tie without prices: nothing separates the panels", () => {
    const w = werdyktProsty(wynik([panel("a", 100.4, null), panel("b", 100, null)]))
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "bez-roznicy" })
  })

  it("the tie threshold is exactly the half percent the screen rounds to 0%", () => {
    expect(PROG_BEZ_ROZNICY_ZIMA_PROC).toBe(0.5)
    expect(werdyktProsty(wynik([panel("a", 100.5, null), panel("b", 100, null)]))).toMatchObject({ zimaBezRoznicy: false })
  })

  it("with four panels the cheapest winter kWh is taken over all of them and the leader from the engine", () => {
    const w = werdyktProsty(wynik([panel("a", 110, 1.1), panel("b", 130, 1.3), panel("c", 90, 0.7), panel("d", 100, null)]))
    expect(w).toMatchObject({ liderZimyId: "b", drugiId: "a", najtanszyId: "c" })
    expect((w as { rekomendacja: unknown }).rekomendacja).toEqual({ rodzaj: "kompromis", liderZimyId: "b", najtanszyId: "c" })
  })

  it("passes the yearly value of the winter difference through and picks the scenario with the largest winter gain that adds panels", () => {
    const w = werdyktProsty(wynik([panel("a", 120, 1), panel("b", 100, 1.1)], 42, [scen(5, 2), scen(9, 3), scen(30, 0), scen(-4, 1)]))
    expect((w as { roznicaZl: unknown }).roznicaZl).toBe(42)
    expect((w as { scenariusz: ScenariuszWiecejPaneli | null }).scenariusz?.przewagaZimaKwh).toBe(9)
  })

  it("no scenario when none adds panels with a winter gain", () => {
    const w = werdyktProsty(wynik([panel("a", 120, 1), panel("b", 100, 1.1)], null, [scen(30, 0), scen(-4, 1)]))
    expect((w as { scenariusz: unknown }).scenariusz).toBeNull()
  })
})
