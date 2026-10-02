import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { taryfaNocnaPompyCieplaTool } from "../taryfa-nocna-pompy-ciepla-tool"

const r2 = (x: number) => Math.round(x * 100) / 100

// Test numbers only — the tool knows no tariff.
const wejscie = {
  cieploDobaKwh: 48,
  godzinyNocH: 12,
  cenaDzienZlKwh: 1,
  cenaNocZlKwh: 0.5,
  copDzien: 3,
  copNoc: 0,
  pojemnoscBuforaL: 5000,
  deltaTBuforaK: 20,
  zasilanieNocy: "siec" as const,
}

describe("taryfaNocnaPompyCieplaTool (M6 Część 2C, dawne 5.59)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(taryfaNocnaPompyCieplaTool.operationType).toBe("read")
    expect(taryfaNocnaPompyCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(taryfaNocnaPompyCieplaTool)).not.toThrow()
  })

  it("z sieci: oszczędność dodatnia, założenie o cenach od usera jako tekst PL", async () => {
    const w = await taryfaNocnaPompyCieplaTool.handler(wejscie)
    expect(w.oszczednoscDobaZl).toBeGreaterThan(0)
    expect(w.przesunieteKwh).toBeCloseTo(24, 9)
    expect(w.zalozenia).toContain(t("pl", "TAN-ZAL-CENY-OD-USERA"))
  })

  it("z baterii off-grid: 🟡 ostrzeżenie o rozładowaniu jako tekst PL", async () => {
    const w = await taryfaNocnaPompyCieplaTool.handler({ ...wejscie, zasilanieNocy: "bateria" })
    expect(w.ostrzezenia).toContain(t("pl", "TAN-NOC-Z-BATERII", { kwh: r2(w.pradNocKwh), kw: r2(w.mocNocSredniaKw) }))
  })
})
