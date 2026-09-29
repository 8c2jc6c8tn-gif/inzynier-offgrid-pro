import { describe, expect, it } from "vitest"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { validateAiToolDefinition } from "../../types"
import { prognozyTool } from "../prognozy-tool"

// Control example is the engine's own (ai/prognozy __tests__) — the tool only echoes.
describe("narzędzie AI — prognozy (29.09.2026)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, opis z „Użyj, gdy”", () => {
    expect(prognozyTool.operationType).toBe("read")
    expect(prognozyTool.requiresConfirmation).toBe(false)
    expect(prognozyTool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(prognozyTool)).not.toThrow()
  })

  it("policz_bilans_prognozy — demo: 9,1 kW × 3 h = 27,3 kWh; 8,7 × 3 = 26,1; bilans +1,2; szczyt 18:00", async () => {
    const w = await prognozyTool.handler({ punkty: SAMPLE_PROGNOZA_24H })
    expect(w.status).toBe("VALID")
    expect(w.produkcjaLacznaKwh).toBeCloseTo(27.3, 6)
    expect(w.zuzycieLaczneKwh).toBeCloseTo(26.1, 6)
    expect(w.bilansKwh).toBeCloseTo(1.2, 6)
    expect(w.godzinaSzczytuZuzycia).toBe(18)
    expect(w.krokProbkowaniaH).toBe(3)
    expect(w.zalozenia[1]).not.toBe("PROGNOZY-ZALOZENIE-PROBKOWANIE-3H")
  })

  it("policz_bilans_prognozy — brak punktów → INCOMPLETE bez godziny szczytu", async () => {
    const w = await prognozyTool.handler({ punkty: [] })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.godzinaSzczytuZuzycia).toBeNull()
  })
})
