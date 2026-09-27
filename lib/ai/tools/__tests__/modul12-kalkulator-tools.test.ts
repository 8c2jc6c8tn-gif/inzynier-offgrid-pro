import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dniBezSloncaTool } from "../dni-bez-slonca-tool"

describe("dniBezSloncaTool (M12/E32, dawne 8.59)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(dniBezSloncaTool.operationType).toBe("read")
    expect(dniBezSloncaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(dniBezSloncaTool)).not.toThrow()
  })

  it("100 Ah / 12 V, DoD 80%, η 100%, 300 Wh → 3,2 dnia; założenia jako tekst PL", async () => {
    const w = await dniBezSloncaTool.handler({
      pojemnoscAh: 100,
      napiecieV: 12,
      dodPct: 80,
      sprawnoscPct: 100,
      zuzycieDoboweWh: 300,
    })
    expect(w.status).toBe("VALID")
    expect(w.dni).toBeCloseTo(3.2, 12)
    expect(w.pelneDoby).toBe(3)
    expect(w.zalozenia).toContain(t("pl", "DBS-ZALOZENIE-BEZ-DOLADOWANIA"))
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })
})
