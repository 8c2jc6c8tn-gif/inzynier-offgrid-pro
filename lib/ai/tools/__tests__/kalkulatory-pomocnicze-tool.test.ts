import { describe, expect, it } from "vitest"
import { kalkulatoryPomocniczeTool } from "../kalkulatory-pomocnicze-tool"
import { CALCULATOR_VERSION } from "@/lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/calculator"
import { t } from "@/lib/i18n/t"

describe("kalkulatoryPomocniczeTool", () => {
  it("9.3: handler deleguje do prawdziwego kalkulatora (watt-to-amp)", async () => {
    const wynik = await kalkulatoryPomocniczeTool.handler({ tryb: "watt-to-amp", mocW: 100, napiecieV: 12 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.wartosc).toBeCloseTo(100 / (12 * 0.92), 6)
    expect(wynik.jednostka).toBe("A")
    expect(wynik.wersjaKalkulatora).toBe(CALCULATOR_VERSION)
    expect(wynik.zalozenia.length).toBeGreaterThan(0)
  })

  it("założenia i ostrzeżenia modułu zmigrowanego do i18n trafiają do modelu jako tekst PL, nie kod/JSON", async () => {
    const domyslna = await kalkulatoryPomocniczeTool.handler({ tryb: "watt-to-amp", mocW: 100, napiecieV: 12 })
    expect(domyslna.zalozenia).toEqual([t("pl", "SPRAWNOSC-DOMYSLNA", { efficiency: 0.92 })])
    expect(domyslna.zalozenia[0]).toMatch(/^Sprawność układu przyjęta jako 0\.92/)

    const ujemne = await kalkulatoryPomocniczeTool.handler({ tryb: "watt-to-amp", mocW: 100, napiecieV: -12 })
    expect(ujemne.status).toBe("INVALID_INPUT")
    expect(ujemne.ostrzezenia).toContain(t("pl", "WARTOSC-NIEDODATNIA", { label: "napięcie systemu" }))
    expect(ujemne.ostrzezenia.join(" ")).not.toMatch(/NIEDODATNI|⚠ \[/)
  })

  it("deleguje do prawdziwego kalkulatora (ah-to-wh)", async () => {
    const wynik = await kalkulatoryPomocniczeTool.handler({ tryb: "ah-to-wh", pojemnoscAh: 100, napiecieV: 12 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.wartosc).toBe(1200)
    expect(wynik.jednostka).toBe("Wh")
  })

  it("deleguje do prawdziwego kalkulatora (wh-to-ah)", async () => {
    const wynik = await kalkulatoryPomocniczeTool.handler({ tryb: "wh-to-ah", energiaWh: 1200, napiecieV: 12 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.wartosc).toBe(100)
    expect(wynik.jednostka).toBe("Ah")
  })

  it("deleguje do prawdziwego kalkulatora (runtime) z jawną sprawnością", async () => {
    const wynik = await kalkulatoryPomocniczeTool.handler({
      tryb: "runtime",
      pojemnoscAh: 100,
      napiecieV: 12,
      mocW: 120,
      sprawnosc: 0.9,
    })
    expect(wynik.status).toBe("VALID")
    expect(wynik.wartosc).toBeCloseTo((100 * 12 * 0.9) / 120, 6)
    expect(wynik.jednostka).toBe("h")
    expect(wynik.zalozenia).toEqual([])
  })

  it("brakujące pole wymagane dla trybu -> INVALID_INPUT z komunikatem, nie wyjątek", async () => {
    const wynik = await kalkulatoryPomocniczeTool.handler({ tryb: "watt-to-amp", napiecieV: 12 })
    expect(wynik.status).toBe("INVALID_INPUT")
    expect(wynik.ostrzezenia[0]).toMatch(/mocW/)
  })

  it("9.3: operationType 'read' i requiresConfirmation: false (kalkulator tylko liczy, nic nie zapisuje)", () => {
    expect(kalkulatoryPomocniczeTool.operationType).toBe("read")
    expect(kalkulatoryPomocniczeTool.requiresConfirmation).toBe(false)
  })
})
