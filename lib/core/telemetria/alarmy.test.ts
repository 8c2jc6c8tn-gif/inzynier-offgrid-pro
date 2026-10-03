import { describe, expect, it } from "vitest"
import { daneNieaktualne, epizodyAlarmow, noweAlarmyDoPowiadomienia, ocenAlarmy, probkiDoChwili, ostatnieWartosci, seriaDoWykresu, type ProgAlarmu } from "./alarmy"
import { zbudujProbke } from "./probka"

const p = (kanal: string, wielkosc: Parameters<typeof zbudujProbke>[0]["wielkosc"], czas: number, wartosc: number | null) =>
  zbudujProbke({ zrodloId: "z", kanal, wielkosc, czas, wartosc })

describe("ostatnieWartosci", () => {
  it("takes the newest valid sample per series and skips missing / out-of-range ones", () => {
    const m = ostatnieWartosci([p("bms", "soc", 1, 50), p("bms", "soc", 2, 40), p("bms", "soc", 3, null), p("bms", "soc", 4, 500)])
    expect(m.size).toBe(1)
    expect([...m.values()][0].wartosc).toBe(40)
  })
})

describe("ocenAlarmy", () => {
  const progi: ProgAlarmu[] = [
    { id: "a", wielkosc: "soc", kierunek: "ponizej", wartosc: 25, priorytet: "ostrzezenie" },
    { id: "b", wielkosc: "soc", kierunek: "ponizej", wartosc: 15, priorytet: "krytyczny" },
    { id: "c", wielkosc: "temperatura", kanal: "bms", kierunek: "powyzej", wartosc: 55, priorytet: "krytyczny" },
  ]
  it("raises only breached thresholds, most severe first", () => {
    const wynik = ocenAlarmy([p("bms", "soc", 10, 12), p("bms", "temperatura", 10, 30)], progi)
    expect(wynik.map((a) => a.progId)).toEqual(["b", "a"])
  })
  it("judges the latest value, not history", () => {
    expect(ocenAlarmy([p("bms", "soc", 1, 10), p("bms", "soc", 2, 80)], progi)).toEqual([])
  })
  it("respects the channel filter", () => {
    expect(ocenAlarmy([p("inny", "temperatura", 1, 70)], progi)).toEqual([])
    expect(ocenAlarmy([p("bms", "temperatura", 1, 70)], progi)).toHaveLength(1)
  })
  it("does not alarm on a value equal to the threshold or on a non-finite threshold", () => {
    expect(ocenAlarmy([p("bms", "soc", 1, 25)], progi)).toEqual([])
    expect(ocenAlarmy([p("bms", "soc", 1, 5)], [{ ...progi[0], wartosc: Number.NaN }])).toEqual([])
  })
})

describe("daneNieaktualne / seriaDoWykresu", () => {
  it("flags no data and old data", () => {
    expect(daneNieaktualne(null, 100, 10)).toBe(true)
    expect(daneNieaktualne(95, 100, 10)).toBe(false)
    expect(daneNieaktualne(80, 100, 10)).toBe(true)
  })
  it("returns a time-ordered series inside the window", () => {
    const s = seriaDoWykresu([p("pv", "moc", 30, 3), p("pv", "moc", 10, 1), p("pv", "moc", 1, 9), p("x", "moc", 20, 7)], "pv", "moc", 40, 35)
    expect(s).toEqual([{ czas: 10, wartosc: 1 }, { czas: 30, wartosc: 3 }])
  })
})

describe("epizodyAlarmow / probkiDoChwili", () => {
  const prog: ProgAlarmu[] = [{ id: "a", wielkosc: "soc", kierunek: "ponizej", wartosc: 25, priorytet: "krytyczny" }]
  it("opens on breach, closes on the first sample within the limit, tracks the extreme", () => {
    const e = epizodyAlarmow([p("bms", "soc", 1, 50), p("bms", "soc", 2, 20), p("bms", "soc", 3, 10), p("bms", "soc", 4, 40)], prog)
    expect(e).toHaveLength(1)
    expect(e[0]).toMatchObject({ odMs: 2, doMs: 4, ekstremum: 10 })
  })
  it("leaves an ongoing episode open and ignores missing / out-of-range samples", () => {
    const e = epizodyAlarmow([p("bms", "soc", 1, 20), p("bms", "soc", 2, null), p("bms", "soc", 3, 500)], prog)
    expect(e).toHaveLength(1)
    expect(e[0].doMs).toBeNull()
  })
  it("finds separate episodes newest first and no episode at the threshold", () => {
    const e = epizodyAlarmow([p("bms", "soc", 1, 10), p("bms", "soc", 2, 60), p("bms", "soc", 3, 5), p("bms", "soc", 4, 25)], prog)
    expect(e.map((x) => x.odMs)).toEqual([3, 1])
  })
  it("cuts samples at the replay moment", () => {
    expect(probkiDoChwili([p("bms", "soc", 1, 1), p("bms", "soc", 5, 1)], 3)).toHaveLength(1)
  })
})

describe("noweAlarmyDoPowiadomienia", () => {
  const progi: ProgAlarmu[] = [
    { id: "a", wielkosc: "soc", kierunek: "ponizej", wartosc: 25, priorytet: "ostrzezenie" },
    { id: "b", wielkosc: "temperatura", kierunek: "powyzej", wartosc: 55, priorytet: "krytyczny" },
  ]
  const aktywne = ocenAlarmy([p("bms", "soc", 1, 10), p("bms", "temperatura", 1, 70)], progi)
  it("notifies once per active alarm and filters by minimum priority", () => {
    const r1 = noweAlarmyDoPowiadomienia(aktywne, new Set(), "krytyczny")
    expect(r1.nowe.map((a) => a.progId)).toEqual(["b"])
    expect(noweAlarmyDoPowiadomienia(aktywne, r1.znane, "krytyczny").nowe).toEqual([])
    expect(noweAlarmyDoPowiadomienia(aktywne, r1.znane, "ostrzezenie").nowe.map((a) => a.progId)).toEqual(["a"])
  })
  it("forgets cleared alarms so a repeated breach notifies again", () => {
    const r1 = noweAlarmyDoPowiadomienia(aktywne, new Set(), "info")
    const r2 = noweAlarmyDoPowiadomienia([], r1.znane, "info")
    expect(r2.znane.size).toBe(0)
    expect(noweAlarmyDoPowiadomienia(aktywne, r2.znane, "info").nowe).toHaveLength(2)
  })
  it("sends nothing when switched off", () => {
    expect(noweAlarmyDoPowiadomienia(aktywne, new Set(), "wylaczone").nowe).toEqual([])
  })
})
