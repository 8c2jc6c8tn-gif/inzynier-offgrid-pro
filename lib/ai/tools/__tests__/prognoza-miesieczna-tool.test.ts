import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { prognozaMiesiecznaTool } from "../prognoza-miesieczna-tool"

const HISTORIA = [180, 220, 350, 500, null, null, null, null, null, null, null, null]

describe("prognozaMiesiecznaTool (M10, 12.3)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia, z frazą 'Użyj, gdy')", () => {
    expect(prognozaMiesiecznaTool.operationType).toBe("read")
    expect(prognozaMiesiecznaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(prognozaMiesiecznaTool)).not.toThrow()
  })

  it("styczeń–marzec przy degradacji 2 %: 176,4 + 215,6 + 343 = 735 kWh, zmiana −2 %", async () => {
    const w = await prognozaMiesiecznaTool.handler({ produkcjaHistoriaKwh: HISTORIA, degradacjaRocznaPct: 2, miesiacStartu: 1, miesiecyNaprzod: 3 })
    expect(w.status).toBe("VALID")
    expect(w.sumaPrognozyKwh).toBeCloseTo(735, 9)
    expect(w.zmianaPct).toBeCloseTo(-2, 9)
    expect(w.wiersze).toHaveLength(3)
  })

  it("bez degradacji: ostrzeżenie PL i założenie o braku pogody; miesiąc bez danych bez prognozy", async () => {
    const w = await prognozaMiesiecznaTool.handler({ produkcjaHistoriaKwh: HISTORIA, miesiacStartu: 4, miesiecyNaprzod: 2 })
    expect(w.ostrzezenia).toContain(t("pl", "PROGMIES-BRAK-DEGRADACJI"))
    expect(w.ostrzezenia).toContain(t("pl", "PROGMIES-BRAK-MIESIECY", { liczba: 1 }))
    expect(w.zalozenia).toContain(t("pl", "PROGMIES-ZAL-BEZ-POGODY"))
    expect(w.wiersze![1]!.prognozaKwh).toBeNull()
  })

  it("miesiąc poza 1–12 → INVALID_INPUT bez liczb", async () => {
    const w = await prognozaMiesiecznaTool.handler({ produkcjaHistoriaKwh: HISTORIA, miesiacStartu: 13, miesiecyNaprzod: 3 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.sumaPrognozyKwh).toBeNull()
    expect(w.ostrzezenia).toContain(t("pl", "PROGMIES-WARTOSC-POZA-ZAKRESEM", { min: 1, max: 12 }))
  })
})
