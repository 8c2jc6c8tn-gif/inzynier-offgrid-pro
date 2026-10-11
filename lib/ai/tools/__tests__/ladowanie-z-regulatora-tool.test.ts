import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { ladowanieZRegulatoraTool } from "../ladowanie-z-regulatora-tool"

describe("ladowanieZRegulatoraTool (M12/O2)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia)", () => {
    expect(ladowanieZRegulatoraTool.operationType).toBe("read")
    expect(ladowanieZRegulatoraTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(ladowanieZRegulatoraTool)).not.toThrow()
  })

  it("400 W / 12 V, regulator 30 A, akumulator 20 A, 100 Ah, 20→80 %: 20 A (limit akumulatora), C/5, 3 h, 720 Wh", async () => {
    const w = await ladowanieZRegulatoraTool.handler({
      mocPaneliW: 400,
      napiecieAkumulatoraV: 12,
      regulatorPradMaxA: 30,
      maksPradLadowaniaAkumulatoraA: 20,
      pojemnoscAh: 100,
      socOdPct: 20,
      socDoPct: 80,
    })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.pradZPaneliA).toBeCloseTo(33.3333, 3)
    expect(w.pradLadowaniaA).toBe(20)
    expect(w.ograniczenie).toBe("akumulator")
    expect(w.wymagaLimituWRegulatorze).toBe(true)
    expect(w.cRate).toBeCloseTo(0.2, 9)
    expect(w.czasLadowaniaH).toBeCloseTo(3, 9)
    expect(w.energiaDoAkumulatoraWh).toBeCloseTo(720, 6)
    expect(w.ostrzezenia).toContain(t("pl", "LADREG-PRAD-PONAD-LIMIT-AKUMULATORA", { prad: 30, limit: 20 }))
  })

  it("bez limitów: ostrzeżenia PL o braku limitów; bez pojemności brak C i czasu", async () => {
    const w = await ladowanieZRegulatoraTool.handler({ mocPaneliW: 200, napiecieAkumulatoraV: 12 })
    expect(w.ostrzezenia).toEqual([t("pl", "LADREG-BRAK-LIMITU-REGULATORA"), t("pl", "LADREG-BRAK-LIMITU-AKUMULATORA")])
    expect(w.cRate).toBeNull()
    expect(w.czasLadowaniaH).toBeNull()
  })

  it("niepoprawne dane → INVALID_INPUT i brak liczb", async () => {
    const w = await ladowanieZRegulatoraTool.handler({ mocPaneliW: -5, napiecieAkumulatoraV: 12 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.pradLadowaniaA).toBeNull()
  })
})
