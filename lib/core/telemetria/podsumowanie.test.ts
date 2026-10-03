import { describe, expect, it } from "vitest"
import { podsumujSerie, probkiDoCsv } from "./podsumowanie"
import { zbudujProbke } from "./probka"

const p = (kanal: string, wielkosc: Parameters<typeof zbudujProbke>[0]["wielkosc"], czas: number, wartosc: number | null) =>
  zbudujProbke({ zrodloId: "z", kanal, wielkosc, czas, wartosc })
const H = 3_600_000

describe("podsumujSerie", () => {
  it("computes min / max / mean over valid samples only and counts the skipped ones", () => {
    const [s] = podsumujSerie([p("bms", "soc", 1, 40), p("bms", "soc", 2, 60), p("bms", "soc", 3, null), p("bms", "soc", 4, 500)], null)
    expect(s).toMatchObject({ liczbaProbek: 2, pominiete: 2, min: 40, max: 60, srednia: 50, energiaWh: null })
  })
  it("integrates power with trapezoids: 1000 W for 1 h = 1000 Wh", () => {
    const [s] = podsumujSerie([p("pv", "moc", 0, 1000), p("pv", "moc", H, 1000)], 2 * H)
    expect(s.energiaWh).toBeCloseTo(1000)
  })
  it("does not bridge gaps longer than the user's limit and gives no energy without a limit", () => {
    const probki = [p("pv", "moc", 0, 1000), p("pv", "moc", H, 1000), p("pv", "moc", 10 * H, 1000)]
    const [s] = podsumujSerie(probki, 2 * H)
    expect(s.energiaWh).toBeCloseTo(1000)
    expect(s.pominieteLuki).toBe(1)
    expect(podsumujSerie(probki, null)[0].energiaWh).toBeNull()
  })
  it("reports no statistics for a series with no valid samples", () => {
    expect(podsumujSerie([p("bms", "soc", 1, null)], null)[0]).toMatchObject({ liczbaProbek: 0, min: null, max: null, srednia: null })
  })
})

describe("probkiDoCsv", () => {
  it("writes a header, ISO time, empty cell for missing and quotes special characters", () => {
    const csv = probkiDoCsv([p('a,"b"', "soc", 1000, null), p("bms", "soc", 0, 50)])
    expect(csv.split("\n")).toEqual([
      "czas,kanal,wielkosc,wartosc,jakosc",
      "1970-01-01T00:00:00.000Z,bms,soc,50,ok",
      '1970-01-01T00:00:01.000Z,"a,""b""",soc,,brak',
      "",
    ])
  })
})
