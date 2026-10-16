import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { terminarzPrzegladowTool, TerminarzPrzegladowToolInput } from "../terminarz-przegladow-tool"

describe("terminarzPrzegladowTool (M13 7.32)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia)", () => {
    expect(terminarzPrzegladowTool.operationType).toBe("read")
    expect(terminarzPrzegladowTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(terminarzPrzegladowTool)).not.toThrow()
  })

  it("po terminie i przed terminem, od najpilniejszej; założenia PL", async () => {
    const w = await terminarzPrzegladowTool.handler(
      TerminarzPrzegladowToolInput.parse({
        dzisiaj: "2026-10-16",
        pozycje: [
          { nazwa: "Gaśnica", ostatniPrzegladData: "2025-01-16", interwalMiesiecy: 12 },
          { nazwa: "Akumulatory", ostatniPrzegladData: "2026-07-16", interwalMiesiecy: 6 },
        ],
      }),
    )
    expect(w.terminy.map((x) => [x.nazwa, x.nastepnyTermin, x.dniDoTerminu, x.status])).toEqual([
      ["Gaśnica", "2026-01-16", -273, "po-terminie"],
      ["Akumulatory", "2027-01-16", 92, "w-terminie"],
    ])
    expect(w.poTerminie).toBe(1)
    expect(w.zalozenia).toContain(t("pl", "TPRZ-ZAL-INTERWALY-UZYTKOWNIKA"))
  })

  it("zła data → INVALID_INPUT z tekstem PL", async () => {
    const w = await terminarzPrzegladowTool.handler(TerminarzPrzegladowToolInput.parse({ dzisiaj: "2026-10-16", pozycje: [{ nazwa: "X", ostatniPrzegladData: "2026-02-30", interwalMiesiecy: 6 }] }))
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.ostrzezenia[0]).toBe(t("pl", "TPRZ-DATA-NIEPOPRAWNA", { nazwa: "X" }))
  })
})
