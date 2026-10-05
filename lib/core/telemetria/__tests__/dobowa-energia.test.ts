import { describe, expect, it } from "vitest"
import { dobowaEnergiaKwh } from "../dobowa-energia"
import { zbudujProbke, type ProbkaTelemetrii } from "../probka"

const H = 3_600_000
const moc = (czas: number, w: number | null, wielkosc: "moc" | "napiecie" = "moc"): ProbkaTelemetrii =>
  zbudujProbke({ zrodloId: "z", kanal: "pv", czas, wielkosc, wartosc: w })

/** Hourly samples of constant power over [od, do] (inclusive). */
const staly = (od: number, do_: number, w: number) => {
  const out: ProbkaTelemetrii[] = []
  for (let t = od; t <= do_; t += H) out.push(moc(t, w))
  return out
}

describe("dobowaEnergiaKwh — telemetria → historia dobowa M7/E2", () => {
  it("pełna doba UTC przy stałej mocy 1 kW = 24 kWh; dzień 1 stycznia ma indeks 0", () => {
    const t0 = Date.UTC(2024, 0, 1)
    const r = dobowaEnergiaKwh(staly(t0, t0 + 24 * H, 1000), 2 * H, "UTC")
    expect(r).toEqual([{ rok: 2024, dni: [24] }])
  })

  it("doba niepokryta w całości (logger śpi nocą) = brak dnia (null), nie zero", () => {
    const t0 = Date.UTC(2024, 0, 1)
    const dzien = staly(t0 + 8 * H, t0 + 16 * H, 1000)
    const r = dobowaEnergiaKwh(dzien, 2 * H, "UTC")
    expect(r[0]!.dni).toEqual([null])
  })

  it("luka dłuższa niż limit usera nie jest mostkowana → doba bez wartości", () => {
    const t0 = Date.UTC(2024, 0, 1)
    const probki = [...staly(t0, t0 + 10 * H, 1000), ...staly(t0 + 14 * H, t0 + 24 * H, 1000)]
    expect(dobowaEnergiaKwh(probki, 2 * H, "UTC")[0]!.dni).toEqual([null])
    expect(dobowaEnergiaKwh(probki, 5 * H, "UTC")[0]!.dni).toEqual([24])
  })

  it("para przez północ dzielona interpolacją liniową: 0 W → 2000 W przez 2 h dzieli 2 kWh na 0,5 + 1,5", () => {
    const t0 = Date.UTC(2024, 0, 1)
    const probki = [...staly(t0, t0 + 23 * H, 0), moc(t0 + 25 * H, 2000), ...staly(t0 + 26 * H, t0 + 48 * H, 0)]
    const [r] = dobowaEnergiaKwh(probki, 3 * H, "UTC")
    expect(r!.dni[0]).toBeCloseTo(0.5, 9)
    expect(r!.dni[1]).toBeCloseTo(1.5 + 1, 9) // 2000 → 0 W over the next hour adds 1 kWh
  })

  it("strefa czasowa: doba lokalna Europe/Warsaw (zima UTC+1); dzień zmiany czasu ma 23 h i też jest pełny", () => {
    const start = Date.UTC(2024, 0, 1) - H // local midnight 1 Jan in Warsaw
    const r = dobowaEnergiaKwh(staly(start, start + 24 * H, 1000), 2 * H, "Europe/Warsaw")
    expect(r).toEqual([{ rok: 2024, dni: [24] }])
    // 31 March 2024: clocks forward, the local day lasts 23 h.
    const dst = Date.UTC(2024, 2, 30, 23) // local midnight 31 March (UTC+1)
    const w = dobowaEnergiaKwh(staly(dst, dst + 23 * H, 1000), 2 * H, "Europe/Warsaw")
    expect(w[0]!.dni[90]).toBeCloseTo(23, 9)
  })

  it("liczy tylko poprawne próbki mocy; ujemna suma doby (pobór czuwania) = 0; brak limitu = brak wyniku", () => {
    const t0 = Date.UTC(2024, 0, 1)
    const probki = [...staly(t0, t0 + 24 * H, -10), moc(t0 + 3 * H + 1, 500, "napiecie")]
    expect(dobowaEnergiaKwh(probki, 2 * H, "UTC")[0]!.dni).toEqual([0])
    expect(dobowaEnergiaKwh(probki, 0, "UTC")).toEqual([])
  })
})
