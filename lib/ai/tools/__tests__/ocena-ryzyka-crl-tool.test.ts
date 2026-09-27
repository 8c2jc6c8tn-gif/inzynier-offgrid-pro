import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { ocenaRyzykaCrlTool } from "../ocena-ryzyka-crl-tool"

describe("ocenaRyzykaCrlTool (M5/E2, HD 60364-4-443)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia", () => {
    expect(ocenaRyzykaCrlTool.operationType).toBe("read")
    expect(ocenaRyzykaCrlTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(ocenaRyzykaCrlTool)).not.toThrow()
  })

  it("Załącznik A.1: CRL = 81,7 → SPD wymagany, ostrzeżenie jako tekst PL", async () => {
    const w = await ocenaRyzykaCrlTool.handler({ srodowisko: "wiejskie", gestoscWyladowanNg: 1, napowietrznaNnKm: 0.4, napowietrznaSnKm: 0.6 })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.crl).toBeCloseTo(81.73076923076923, 9)
    expect(w.spdWymagany).toBe(true)
    expect(w.ostrzezenia).toContain(t("pl", "CRL-SPD-WYMAGANY", { crl: "81.7" }))
  })

  it("off-grid bez linii → brak wymogu z 443.5, bez zgadywania Ng", async () => {
    const w = await ocenaRyzykaCrlTool.handler({})
    expect(w).toMatchObject({ status: "VALID", spdWymagany: false, powod: "brak-linii", crl: null })
  })
})
