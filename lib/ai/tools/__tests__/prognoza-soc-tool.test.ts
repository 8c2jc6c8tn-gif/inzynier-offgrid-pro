import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { prognozaSocTool } from "../prognoza-soc-tool"

const BAZA = {
  pojemnoscUzytecznaKwh: 10,
  socStartPct: 50,
  socMinPct: 10,
  godzinaStartu: 0,
  horyzontH: 24,
  produkcjaKw: [0, 0, 1, 2, 4, 2, 0, 0],
  zuzycieKw: [0.5, 0.5, 0.5, 1, 1, 1, 2, 1],
}

describe("prognozaSocTool (M10, 12.4 + 12.43)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia, z frazą 'Użyj, gdy')", () => {
    expect(prognozaSocTool.operationType).toBe("read")
    expect(prognozaSocTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(prognozaSocTool)).not.toThrow()
  })

  it("doba z ręcznego rachunku: koniec 10 %, minimum po 24 h, nadwyżka 8,5 kWh, 4 odcinki osi czasu", async () => {
    const w = await prognozaSocTool.handler(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.socKoncowePct).toBeCloseTo(10, 9)
    expect(w.pierwszeMinimumPoGodz).toBe(24)
    expect(w.nadmiarKwh).toBeCloseTo(8.5, 9)
    expect(w.socCoGodzine).toHaveLength(25)
    expect(w.osCzasu).toEqual([
      { typ: "rozladowanie", odGodz: 0, doGodz: 6 },
      { typ: "ladowanie", odGodz: 6, doGodz: 13 },
      { typ: "nadwyzka", odGodz: 13, doGodz: 18 },
      { typ: "rozladowanie", odGodz: 18, doGodz: 24 },
    ])
    expect(w.ostrzezenia).toContain(t("pl", "PROGSOC-OSIAGNIE-MINIMUM", { min: 10, godz: 24 }))
    expect(w.ostrzezenia).toContain(t("pl", "PROGSOC-BRAK-SPRAWNOSCI"))
    expect(w.zalozenia).toContain(t("pl", "PROGSOC-ZAL-BEZ-POGODY"))
  })

  it("dzień bez słońca: niedobór 22,5 kWh przez 24 h", async () => {
    const w = await prognozaSocTool.handler({ ...BAZA, horyzontH: 48, wspolczynnikDniPct: [100, 0] })
    expect(w.niedoborKwh).toBeCloseTo(22.5, 9)
    expect(w.godzinyBezZasilania).toBe(24)
  })

  it("SoC poza 0–100 → INVALID_INPUT bez liczb", async () => {
    const w = await prognozaSocTool.handler({ ...BAZA, socStartPct: 120 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.socCoGodzine).toBeNull()
    expect(w.ostrzezenia).toContain(t("pl", "PROGSOC-WARTOSC-POZA-ZAKRESEM", { min: 0, max: 100 }))
  })
})
