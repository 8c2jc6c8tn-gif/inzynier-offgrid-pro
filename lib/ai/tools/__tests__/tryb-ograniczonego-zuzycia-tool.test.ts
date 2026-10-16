import { describe, expect, it } from "vitest"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { trybOgraniczonegoZuzyciaTool, TrybOgraniczonegoZuzyciaToolInput } from "../tryb-ograniczonego-zuzycia-tool"

const odbiorniki = [
  { nazwa: "Lodówka", zuzycieDobaWh: 600, zostaje: true },
  { nazwa: "Telewizor", zuzycieDobaWh: 400, zostaje: false },
]

describe("trybOgraniczonegoZuzyciaTool (M13 7.27 + 7.49)", () => {
  it("kontrakt 9.3 ('read', bez potwierdzenia)", () => {
    expect(trybOgraniczonegoZuzyciaTool.operationType).toBe("read")
    expect(trybOgraniczonegoZuzyciaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(trybOgraniczonegoZuzyciaTool)).not.toThrow()
  })

  it("wyjazd 7 dób, lodówka zostaje: 0,6 kWh/dobę × 7 = 4,2 kWh zamiast 7 kWh; bateria 2,1 kWh = 3,5 doby (ograniczone) wobec 2,1", async () => {
    const w = await trybOgraniczonegoZuzyciaTool.handler(TrybOgraniczonegoZuzyciaToolInput.parse({ tryb: "wyjazd", odbiorniki, dniNieobecnosci: 7, pojemnoscUzytecznaKwh: 2.1 }))
    expect(w.okresOgraniczoneKwh).toBeCloseTo(4.2, 10)
    expect(w.okresNormalnieKwh).toBeCloseTo(7, 10)
    expect(w.oszczednoscPct).toBeCloseTo(40, 10)
    expect(w.bateriaWystarczaOgraniczone).toBeCloseTo(3.5, 10)
    expect(w.bateriaWystarczaNormalnie).toBeCloseTo(2.1, 10)
    expect(w.zostaja).toEqual(["Lodówka"])
    expect(w.zalozenia).toContain(t("pl", "TOGR-ZAL-BEZ-OCENY-BEZPIECZENSTWA"))
  })

  it("noc 12 h: połowa doby; błąd danych daje tekst PL", async () => {
    const w = await trybOgraniczonegoZuzyciaTool.handler(TrybOgraniczonegoZuzyciaToolInput.parse({ tryb: "noc", odbiorniki, godzinNocy: 12 }))
    expect(w.nocOgraniczoneKwh).toBeCloseTo(0.3, 10)
    const b = await trybOgraniczonegoZuzyciaTool.handler(TrybOgraniczonegoZuzyciaToolInput.parse({ tryb: "noc", odbiorniki, godzinNocy: 30 }))
    expect(b.status).toBe("INVALID_INPUT")
    expect(b.ostrzezenia[0]).toBe(t("pl", "TOGR-GODZINY-POZA-ZAKRESEM", { godzin: 30 }))
  })
})
