import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { dystrybucjaCieplaTool } from "../dystrybucja-ciepla-tool"

describe("dystrybucjaCieplaTool (M6/E13, dawne 5.13 + 5.17 + 5.18)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(dystrybucjaCieplaTool.operationType).toBe("read")
    expect(dystrybucjaCieplaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(dystrybucjaCieplaTool)).not.toThrow()
  })

  it("pompa + grzejniki standardowe → 🔴 jako tekst PL", async () => {
    const w = await dystrybucjaCieplaTool.handler({
      zrodloCiepla: "pompa-ciepla",
      system: "grzejniki-standardowe",
      cieploRocznieKwh: 0,
      copSystemu: 0,
      copOdniesienia: 0,
      doplataZl: 0,
      cenaPraduZlKwh: 0,
    })
    expect(w.dopasowanie).toBe("zle")
    expect(w.ostrzezenia).toContain(t("pl", "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA", { standard: "75/65/20", nisko: "45/35/20" }))
  })
})
