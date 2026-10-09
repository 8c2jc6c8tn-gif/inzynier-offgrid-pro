import { describe, expect, it } from "vitest"
import { uiEn, uiPl, uiRu } from "@/lib/i18n/ui"
import { PRESETY, stanZPresetow } from "../presety"
import { KAFLE } from "../registry"

const WSZYSTKIE = KAFLE.map((k) => k.id)

describe("dashboard presets (docs/pulpit-i-nawigacja.md §3, D53, D54)", () => {
  it("has the eight §3 presets plus the micro-installation one, each with tile 1 first and the M14 tiles last", () => {
    expect(PRESETY).toHaveLength(10)
    for (const p of PRESETY.filter((x) => x.id !== "siec")) {
      expect(p.widoczne[0]).toBe(1)
      expect(p.widoczne.slice(-2)).toEqual([15, 16])
      expect(new Set(p.widoczne).size).toBe(p.widoczne.length)
      for (const id of p.widoczne) expect(WSZYSTKIE).toContain(id)
    }
  })

  it("grid preset puts M14 first, then the modules M14 reads from (D39, D62)", () => {
    const stan = stanZPresetow(["siec"])
    expect(stan.order.slice(0, 9)).toEqual([15, 16, 1, 2, 3, 4, 6, 7, 8])
    expect(stan.hiddenIds).toEqual([5, 9, 10, 11, 12, 13])
  })

  it("keeps the §3 table order for a single preset (PV: 1, 3, 2, 4, 5, 7, 10)", () => {
    const stan = stanZPresetow(["pv"])
    expect(stan.order.slice(0, 9)).toEqual([1, 3, 2, 4, 5, 7, 10, 15, 16])
    expect(stan.hiddenIds).toEqual([6, 8, 9, 11, 12, 13])
  })

  it("state is always a permutation of all tiles", () => {
    for (const ids of [["pv"], ["automatyka", "ogrzewanie"], ["caly-system"]]) {
      const stan = stanZPresetow(ids)
      expect([...stan.order].sort((a, b) => a - b)).toEqual([...WSZYSTKIE].sort((a, b) => a - b))
      for (const id of stan.hiddenIds) expect(stan.order.indexOf(id)).toBeGreaterThanOrEqual(stan.order.length - stan.hiddenIds.length)
    }
  })

  it("several presets = union in the default order", () => {
    const stan = stanZPresetow(["automatyka", "ogrzewanie"])
    expect(stan.order.slice(0, 10)).toEqual([1, 2, 6, 7, 8, 9, 10, 13, 15, 16])
    expect(stan.hiddenIds).toEqual([3, 4, 5, 11, 12])
  })

  it("no preset = default state, whole system hides nothing", () => {
    expect(stanZPresetow([])).toEqual({ hiddenIds: [], order: WSZYSTKIE })
    expect(stanZPresetow(["caly-system"]).hiddenIds).toEqual([])
  })

  it("every preset has its name and description in PL/EN/RU", () => {
    for (const p of PRESETY) {
      for (const slownik of [uiPl, uiEn, uiRu]) {
        expect(slownik[p.nazwaKlucz]).toBeTruthy()
        expect(slownik[p.opisKlucz]).toBeTruthy()
      }
    }
  })
})
