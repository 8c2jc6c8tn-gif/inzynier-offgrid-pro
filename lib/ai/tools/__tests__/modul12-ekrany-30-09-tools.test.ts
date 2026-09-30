import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { akumulatorSamochodowyTool } from "../akumulator-samochodowy-tool"

describe("akumulatorSamochodowyTool (M12/E16, dawne 8.14)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(akumulatorSamochodowyTool.operationType).toBe("read")
    expect(akumulatorSamochodowyTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(akumulatorSamochodowyTool)).not.toThrow()
  })

  it("60 Ah rozruchowy, 50%, 50 W, plan 10 h → 7,2 h i 🔴 jako tekst PL", async () => {
    const w = await akumulatorSamochodowyTool.handler({
      typ: "rozruchowy",
      pojemnoscAh: 60,
      napiecieV: 12,
      uzytecznaPct: 50,
      mocW: 50,
      planowanyCzasH: 10,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.czasH).toBeCloseTo(7.2, 12)
    expect(w.ostrzezenia).toContain(t("pl", "AS-ROZRUCHOWY-PONAD-UZYTECZNA", { planowany: 10, czas: 7.2 }))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})
