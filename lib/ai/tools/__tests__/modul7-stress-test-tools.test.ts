import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { obciazenieDachuSniegiemTool } from "../obciazenie-dachu-sniegiem-tool"

describe("obciazenieDachuSniegiemTool (M7/E23, dawne 6.34→7.32)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(obciazenieDachuSniegiemTool.operationType).toBe("read")
    expect(obciazenieDachuSniegiemTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(obciazenieDachuSniegiemTool)).not.toThrow()
  })

  it("strefa 4, dach płaski, nośność 1,2 kN/m² → s = 1,28, twardy stop jako tekst PL", async () => {
    const w = await obciazenieDachuSniegiemTool.handler({
      strefa: 4,
      wysokoscNpmM: 50,
      katDachuDeg: 0,
      ekspozycja: "normalny",
      barierkiLubAttyka: false,
      nosnoscDachuKnM2: 1.2,
      gruboscWarstwyCm: 0,
      rodzajSniegu: null,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.sKnM2).toBeCloseTo(1.28, 12)
    expect(w.ostrzezenia).toContain(
      t("pl", "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC", { s: "1.28", nosnosc: "1.20" }),
    )
    expect(w.zalozenia).toContain(t("pl", "SNIEG-ZALOZENIE-WARTOSC-CHARAKTERYSTYCZNA"))
  })
})
