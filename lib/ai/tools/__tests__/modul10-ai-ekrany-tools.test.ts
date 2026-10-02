import { describe, expect, it } from "vitest"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { przesuwanieZadanTool } from "../przesuwanie-zadan-tool"

// Control examples are the engines' own (__tests__ next to each engine) — the tools only echo.
describe("przesuwanieZadanTool (M10/E5, dawne 12.10)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, opis z „Użyj, gdy”", () => {
    expect(przesuwanieZadanTool.operationType).toBe("read")
    expect(przesuwanieZadanTool.requiresConfirmation).toBe(false)
    expect(przesuwanieZadanTool.description).toContain("Użyj, gdy ")
    expect(() => validateAiToolDefinition(przesuwanieZadanTool)).not.toThrow()
  })

  it("pranie 2 kW × 1,5 h do 18:00 → 12:00, całe z PV; zadanie poza oknem → tekst PL", async () => {
    const w = await przesuwanieZadanTool.handler({
      prognoza: SAMPLE_PROGNOZA_24H,
      zadania: [
        { id: "a", nazwa: "Pranie", mocKw: 2, czasTrwaniaH: 1.5, najwczesniejOdH: 8, gotoweDoH: 18 },
        { id: "b", nazwa: "Piec", mocKw: 2, czasTrwaniaH: 3, najwczesniejOdH: 10, gotoweDoH: 12 },
      ],
    })
    expect(w.zadania[0]!.startH).toBe(12)
    expect(w.zadania[0]!.zPvKwh).toBeCloseTo(3, 9)
    expect(w.ostrzezenia).toContain(t("pl", "PRZES-ZADANIE-POZA-OKNEM", { nazwa: "Piec", czas: 3, od: "10:00", do: "12:00" }))
  })
})
