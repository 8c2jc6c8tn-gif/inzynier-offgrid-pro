import { describe, expect, it } from "vitest"
import { validateAiToolDefinition } from "../../types"
import { czasBalansowaniaTool } from "../czas-balansowania-tool"

describe("narzędzie AI — czas balansowania", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, opis z „Użyj, gdy”", () => {
    expect(czasBalansowaniaTool.operationType).toBe("read")
    expect(czasBalansowaniaTool.requiresConfirmation).toBe(false)
    expect(czasBalansowaniaTool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(czasBalansowaniaTool)).not.toThrow()
  })

  it("314 Ah, 3%, 2 A, okno 2 h → 4,71 h i 2,36 doby z ostrzeżeniem", async () => {
    const w = await czasBalansowaniaTool.handler({ pojemnoscAh: 314, rozjazdProc: 3, pradBalanseraA: 2, oknoGodzinDobe: 2 })
    expect(w.czasPracyH).toBeCloseTo(4.71, 2)
    expect(w.dniOkna).toBeCloseTo(2.36, 2)
    expect(w.ostrzezenia.length).toBe(1)
    expect(w.zalozenia.length).toBe(3)
  })

  it("brak danych → INCOMPLETE", async () => {
    const w = await czasBalansowaniaTool.handler({ pojemnoscAh: 0, rozjazdProc: 0, pradBalanseraA: 0, oknoGodzinDobe: 0 })
    expect(w.status).toBe("INCOMPLETE")
  })
})
