import { describe, expect, it } from "vitest"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { slotyWersji, wersjeOferty } from "../oferta"

const panel = (id: string) => ({ id, nazwa: `Panel ${id}` }) as WynikPanelu
const cztery = [panel("p1"), panel("p2"), panel("p3"), panel("p4")]

describe("wersjeOferty", () => {
  it("untouched: A, B, C are the first three compared panels, unlabelled, none recommended", () => {
    const w = wersjeOferty({}, cztery)
    expect(w.map((x) => [x.litera, x.panel.id, x.etykieta, x.zalecana])).toEqual([
      ["A", "p1", "", false],
      ["B", "p2", "", false],
      ["C", "p3", "", false],
    ])
  })

  it("two compared panels give only versions A and B", () => {
    expect(wersjeOferty({}, cztery.slice(0, 2)).map((x) => x.litera)).toEqual(["A", "B"])
  })

  it("edited slots keep their letters: an empty slot A leaves B and C where the user put them", () => {
    const w = wersjeOferty(
      {
        ofertaWersje: [
          { panelId: "", etykieta: "" },
          { panelId: "p4", etykieta: " zalecana " },
          { panelId: "p1", etykieta: "ekonomiczna" },
        ],
        ofertaZalecana: "B",
      },
      cztery,
    )
    expect(w.map((x) => [x.litera, x.panel.id, x.etykieta, x.zalecana])).toEqual([
      ["B", "p4", "zalecana", true],
      ["C", "p1", "ekonomiczna", false],
    ])
  })

  it("skips a panel taken by an earlier slot and a panel that is no longer compared", () => {
    const w = wersjeOferty(
      {
        ofertaWersje: [
          { panelId: "p2", etykieta: "" },
          { panelId: "p2", etykieta: "" },
          { panelId: "usuniety", etykieta: "" },
        ],
      },
      cztery,
    )
    expect(w.map((x) => [x.litera, x.panel.id])).toEqual([["A", "p2"]])
  })

  it("a recommendation pointing at a skipped slot marks nothing", () => {
    const w = wersjeOferty({ ofertaWersje: [{ panelId: "p1", etykieta: "" }, { panelId: "", etykieta: "" }, { panelId: "", etykieta: "" }], ofertaZalecana: "C" }, cztery)
    expect(w.some((x) => x.zalecana)).toBe(false)
  })
})

describe("slotyWersji", () => {
  it("edited: missing entries become empty slots instead of falling back to the defaults", () => {
    expect(slotyWersji({ ofertaWersje: [{ panelId: "p3", etykieta: "x" }] }, cztery)).toEqual([
      { panelId: "p3", etykieta: "x" },
      { panelId: "", etykieta: "" },
      { panelId: "", etykieta: "" },
    ])
  })
})
