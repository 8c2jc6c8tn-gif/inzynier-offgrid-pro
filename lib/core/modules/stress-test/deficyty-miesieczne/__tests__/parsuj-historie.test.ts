import { describe, expect, it } from "vitest"
import { parsujHistorie } from "../parsuj-historie"

describe("parsujHistorie", () => {
  it("rok + dni rozdzielone spacjami / tabulatorem, przecinek lub kropka dziesiętna", () => {
    const w = parsujHistorie("2021 1,5 2.25 0\n2022\t3\t4")
    expect(w.lata).toEqual([
      { rok: 2021, dni: [1.5, 2.25, 0] },
      { rok: 2022, dni: [3, 4] },
    ])
    expect(w.nieczytelneLinie).toEqual([])
  })

  it("średnik: pusta komórka i '-' to brak dnia (null), nigdy zero", () => {
    expect(parsujHistorie("2020;1,5;;x;2").lata).toEqual([{ rok: 2020, dni: [1.5, null, null, 2] }])
  })

  it("linie bez roku albo z nieliczbową wartością są zgłaszane (numer linii) i pomijane", () => {
    const w = parsujHistorie("abc 1 2\n\n2021 1 zz\n2022 5")
    expect(w.lata).toEqual([{ rok: 2022, dni: [5] }])
    expect(w.nieczytelneLinie).toEqual([1, 3])
  })
})
