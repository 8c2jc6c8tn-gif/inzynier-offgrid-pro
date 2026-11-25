import { describe, expect, it } from "vitest"
import { buforZDraftu, wkladBojlera, wkladFalownika, wkladSezonowy, wkladWampirow } from "../zrodla-bilansu"

describe("sources of the demand balance (drafts of the Module 2 screens)", () => {
  it("boiler: Q = V·c·ΔT — 200 l heated by 35 K = 200 · 4186 · 35 / 3.6e6 ≈ 8.139 kWh/day (hand-checked)", () => {
    const w = wkladBojlera({ wolumenCwuLDoba: "200", deltaTK: "35", mocGrzalkiKw: "2", pojemnoscBojleraL: "200" })
    expect(w?.kwhDobaTypowa).toBeCloseTo((200 * 4186 * 35) / 3.6e6, 3)
    expect(w?.kwhDobaMiesiace).toHaveLength(12)
    expect(wkladBojlera({ wolumenCwuLDoba: "", deltaTK: "", mocGrzalkiKw: "", pojemnoscBojleraL: "" })).toBeNull()
    expect(wkladBojlera(null)).toBeNull()
  })

  it("standby: catalogue + measurement draw all day — 30 W → 0.72 kWh/day", () => {
    const w = wkladWampirow({ katalog: { items: [] }, pomiar: { pozycje: [{ id: "a", nazwa: "router", mocJalowaW: 30 }] } })
    expect(w?.kwhDobaTypowa).toBeCloseTo(0.72, 10)
    expect(wkladWampirow({ katalog: { items: [] }, pomiar: { pozycje: [] } })).toBeNull()
  })

  it("inverter self-consumption: 25 W idle → 0.6 kWh/day", () => {
    expect(wkladFalownika({ poborJalowyW: "25" })?.kwhDobaTypowa).toBeCloseTo(0.6, 10)
  })

  it("seasonal device: June–August only, not in the typical day; a year-round one every day", () => {
    const s = wkladSezonowy({ zapotrzebowanieKwhDoba: "3", typ: "sezonowy", miesiacOd: "6", miesiacDo: "8", aktualnyMiesiac: "1", czyWeekend: false })
    expect(s?.kwhDobaTypowa).toBe(0)
    expect(s?.kwhDobaMiesiace).toEqual([0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0])
    const c = wkladSezonowy({ zapotrzebowanieKwhDoba: "1.5", typ: "caloroczny", miesiacOd: "", miesiacDo: "", aktualnyMiesiac: "", czyWeekend: false })
    expect(c?.kwhDobaTypowa).toBe(1.5)
    expect(c?.kwhDobaMiesiace.every((x) => x === 1.5)).toBe(true)
  })

  it("buffer: the choice of the buffer screen, or none", () => {
    expect(buforZDraftu({ buforPct: 20 })).toBe(20)
    expect(buforZDraftu(null)).toBeNull()
  })
})
