import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { miejsceNaRozbudoweTool } from "../miejsce-na-rozbudowe-tool"

describe("miejsceNaRozbudoweTool (M12, 8.58)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia, z frazą 'Użyj, gdy')", () => {
    expect(miejsceNaRozbudoweTool.operationType).toBe("read")
    expect(miejsceNaRozbudoweTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(miejsceNaRozbudoweTool)).not.toThrow()
  })

  it("miejsce 2000×1000, element 500×400, odstępy 0: 10 szt. obrócone o 90°, 5×2", async () => {
    const w = await miejsceNaRozbudoweTool.handler({
      miejsceDlugoscMm: 2000,
      miejsceSzerokoscMm: 1000,
      elementDlugoscMm: 500,
      elementSzerokoscMm: 400,
      odstepMiedzyMm: 0,
      marginesPrzyScianieMm: 0,
    })
    expect(w.status).toBe("VALID")
    expect(w.maksSztuk).toBe(10)
    expect(w.uklad).toBe("wszerz")
    expect(w.kolumny).toBe(5)
    expect(w.rzedy).toBe(2)
    expect(w.zmiesciSiePlan).toBeNull()
  })

  it("bez odstępów: ostrzeżenie PL i założenie; plan 12 przy 10 miejscach → brakuje 2", async () => {
    const w = await miejsceNaRozbudoweTool.handler({
      miejsceDlugoscMm: 2000,
      miejsceSzerokoscMm: 1000,
      elementDlugoscMm: 500,
      elementSzerokoscMm: 400,
      planowanaLiczba: 12,
    })
    expect(w.brakujeSztuk).toBe(2)
    expect(w.zmiesciSiePlan).toBe(false)
    expect(w.ostrzezenia).toContain(t("pl", "MIEJROZ-PLAN-PONAD-MIEJSCE", { plan: 12, maks: 10, brak: 2 }))
    expect(w.ostrzezenia).toContain(t("pl", "MIEJROZ-BRAK-ODSTEPOW"))
    expect(w.zalozenia).toContain(t("pl", "MIEJROZ-ZAL-ODSTEPY-ZERO"))
  })

  it("piętrowanie akumulatorów: 600 mm / 200 mm = 3 warstwy", async () => {
    const w = await miejsceNaRozbudoweTool.handler({
      miejsceDlugoscMm: 500,
      miejsceSzerokoscMm: 400,
      miejsceWysokoscMm: 600,
      elementDlugoscMm: 250,
      elementSzerokoscMm: 200,
      elementWysokoscMm: 200,
      odstepMiedzyMm: 0,
      marginesPrzyScianieMm: 0,
      moznaPietrowac: true,
    })
    expect(w.warstwy).toBe(3)
    expect(w.maksSztuk).toBe(12)
  })

  it("zerowy lub ujemny wymiar → INVALID_INPUT bez liczb", async () => {
    const zero = await miejsceNaRozbudoweTool.handler({ miejsceDlugoscMm: 1000, miejsceSzerokoscMm: 500, elementDlugoscMm: 0, elementSzerokoscMm: 0 })
    expect(zero.status).toBe("INVALID_INPUT")
    expect(zero.maksSztuk).toBeNull()
    const zle = await miejsceNaRozbudoweTool.handler({ miejsceDlugoscMm: -1, miejsceSzerokoscMm: 500, elementDlugoscMm: 100, elementSzerokoscMm: 100 })
    expect(zle.status).toBe("INVALID_INPUT")
    expect(zle.ostrzezenia).toContain(t("pl", "MIEJROZ-WARTOSC-UJEMNA"))
  })
})
