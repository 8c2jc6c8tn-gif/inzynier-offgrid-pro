import { describe, expect, it } from "vitest"
import { validateAiToolDefinition } from "../../types"
import { zestawyUstawienJkBmsTool } from "../zestawy-ustawien-jk-bms-tool"

describe("narzędzie AI — zestawy ustawień JK BMS", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, opis z „Użyj, gdy”", () => {
    expect(zestawyUstawienJkBmsTool.operationType).toBe("read")
    expect(zestawyUstawienJkBmsTool.requiresConfirmation).toBe(false)
    expect(zestawyUstawienJkBmsTool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(zestawyUstawienJkBmsTool)).not.toThrow()
  })

  it("zestaw autora — napięcia pakietu, prąd w C i ostrzeżenia z silnika", async () => {
    const w = await zestawyUstawienJkBmsTool.handler({ zestawId: "pozytywnie-nauczeni-314ah-16s" })
    expect(w.autor).toBe("Pozytywnie nauczeni")
    expect(w.ovpPakietV).toBeCloseTo(57.6, 6)
    expect(w.uvpPakietV).toBeCloseTo(42.4, 6)
    expect(w.parametry.find((p) => p.nazwaJk === "Continued Charge")?.cRate).toBeCloseTo(0.318, 3)
    expect(w.parametry.filter((p) => p.zgodnoscZeZrodlem === "do-potwierdzenia")).toHaveLength(5)
    expect(w.ostrzezenia.length).toBeGreaterThan(0)
  })

  it("nieznany zestaw → INVALID_INPUT, pusta lista parametrów", async () => {
    const w = await zestawyUstawienJkBmsTool.handler({ zestawId: "nie-ma" })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.parametry).toEqual([])
  })
})
