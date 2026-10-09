import { describe, expect, it } from "vitest"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { PanelNaUrzadzeniu } from "../urzadzenie"
import { zwrotyZOsprzetem, zwrotZOsprzetem } from "../zwrot-z-osprzetem"

const panel = (zmiana: Partial<WynikPanelu> = {}) =>
  ({ id: "p1", nazwa: "P", cenaRazemZl: 4000, okresZwrotuLat: 8, kosztZimowejKwhZl: 2, ...zmiana }) as WynikPanelu
const naUrz = (zmiana: { bos?: { sumaMin: number; sumaMax: number; brakIlosci: string[] } | null; kosztUrzadzen?: number; wybrany?: object | null } = {}) =>
  ({ wynik: { id: "p1" }, wybrany: zmiana.wybrany === undefined ? {} : zmiana.wybrany, bos: zmiana.bos === undefined ? { sumaMin: 800, sumaMax: 1200, brakIlosci: [] } : zmiana.bos, kosztUrzadzen: zmiana.kosztUrzadzen ?? 0 }) as unknown as PanelNaUrzadzeniu

describe("zwrotZOsprzetem", () => {
  it("scales payback and winter-kWh cost by (panels + extras) / panels: 4000 + 800..1200 → ×1.2 .. ×1.3", () => {
    const w = zwrotZOsprzetem(panel(), naUrz())!
    expect(w.cenaMin).toBe(4800)
    expect(w.cenaMax).toBe(5200)
    expect(w.okresZwrotuMinLat).toBeCloseTo(9.6, 10)
    expect(w.okresZwrotuMaxLat).toBeCloseTo(10.4, 10)
    expect(w.kosztZimowejKwhMin).toBeCloseTo(2.4, 10)
    expect(w.kosztZimowejKwhMax).toBeCloseTo(2.6, 10)
    expect(w.niepelny).toBe(false)
  })

  it("adds the typed device price to both ends: 4000 + 500 + 800..1200", () => {
    const w = zwrotZOsprzetem(panel(), naUrz({ kosztUrzadzen: 500 }))!
    expect([w.cenaMin, w.cenaMax]).toEqual([5300, 5700])
  })

  it("a micro-inverter (no DC accessories) adds the device price only: 4000 + 400 → payback 8 × 1.1", () => {
    const w = zwrotZOsprzetem(panel(), naUrz({ bos: null, kosztUrzadzen: 400 }))!
    expect(w.okresZwrotuMinLat).toBeCloseTo(8.8, 10)
    expect(w.okresZwrotuMaxLat).toBeCloseTo(8.8, 10)
  })

  it("keeps null payback or winter cost null (no energy price typed) but still gives the price", () => {
    const w = zwrotZOsprzetem(panel({ okresZwrotuLat: null }), naUrz())!
    expect(w.okresZwrotuMinLat).toBeNull()
    expect(w.kosztZimowejKwhMax).not.toBeNull()
  })

  it("flags an accessory line without a quantity", () => {
    expect(zwrotZOsprzetem(panel(), naUrz({ bos: { sumaMin: 100, sumaMax: 200, brakIlosci: ["kabel-pv"] } }))!.niepelny).toBe(true)
  })

  it("is null without a chosen layout, without a device summary, without a price and with a zero price", () => {
    expect(zwrotZOsprzetem(panel(), naUrz({ wybrany: null }))).toBeNull()
    expect(zwrotZOsprzetem(panel(), undefined)).toBeNull()
    expect(zwrotZOsprzetem(panel({ cenaRazemZl: null }), naUrz())).toBeNull()
    expect(zwrotZOsprzetem(panel({ cenaRazemZl: 0 }), naUrz())).toBeNull()
  })

  it("maps every compared panel id, null for the ones without a result", () => {
    const m = zwrotyZOsprzetem([panel(), panel({ id: "p2" })], [naUrz()])
    expect(m.get("p1")).not.toBeNull()
    expect(m.get("p2")).toBeNull()
  })
})
