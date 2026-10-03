import { describe, expect, it } from "vitest"
import { podsumowanieTelemetriiTool } from "./podsumowanie-telemetrii-tool"

const pomiary = [
  { kanal: "pv", wielkosc: "moc" as const, wartosc: 2000, czasIso: "2026-01-01T10:00:00Z" },
  { kanal: "pv", wielkosc: "moc" as const, wartosc: 2000, czasIso: "2026-01-01T11:00:00Z" },
  { kanal: "pv", wielkosc: "moc" as const, wartosc: null, czasIso: "2026-01-01T11:30:00Z" },
]

describe("podsumowanieTelemetriiTool", () => {
  it("integrates energy in kWh within the user's gap limit and counts skipped readings", async () => {
    const w = await podsumowanieTelemetriiTool.handler({ pomiary, maxPrzerwaMin: 90 })
    expect(w.serie[0].energiaKwh).toBeCloseTo(2)
    expect(w.serie[0].pominiete).toBe(1)
  })
  it("gives no energy without the user's gap limit", async () => {
    const w = await podsumowanieTelemetriiTool.handler({ pomiary })
    expect(w.serie[0].energiaKwh).toBeNull()
    expect(w.serie[0].max).toBe(2000)
  })
})
