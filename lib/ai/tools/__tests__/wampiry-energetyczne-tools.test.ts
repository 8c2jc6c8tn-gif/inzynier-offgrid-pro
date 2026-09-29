import { describe, expect, it } from "vitest"
import { validateAiToolDefinition } from "../../types"
import { wampiryAutomatyzacjaTool } from "../wampiry-automatyzacja-tool"
import { wampiryKatalogTool } from "../wampiry-katalog-tool"
import { wampiryPomiarTool } from "../wampiry-pomiar-tool"
import { wampiryRekomendacjeTool } from "../wampiry-rekomendacje-tool"
import { wampirySymulacjeTool } from "../wampiry-symulacje-tool"

// Control examples are the engines' own (wampiry-energetyczne/*/__tests__) — the tools only echo.
describe("narzędzia AI — Wampiry energetyczne (kalkulatory bez narzędzia do 29.09.2026)", () => {
  it.each([wampiryAutomatyzacjaTool, wampiryKatalogTool, wampiryPomiarTool, wampiryRekomendacjeTool, wampirySymulacjeTool])(
    "kontrakt 9.3: $name — 'read', bez potwierdzenia, opis z „Użyj, gdy”",
    (tool) => {
      expect(tool.operationType).toBe("read")
      expect(tool.requiresConfirmation).toBe(false)
      expect(tool.description).toContain("Użyj, gdy ")
      expect(() => validateAiToolDefinition(tool)).not.toThrow()
    },
  )

  it("policz_standby_z_katalogu — router + dekoder bez mocy → 10 + 20 = 30 W, 2 założenia z zakresem", async () => {
    const w = await wampiryKatalogTool.handler({
      urzadzenia: [
        { id: "router", nazwa: "Router", mocW: null },
        { id: "dekoder", nazwa: "Dekoder TV", mocW: null },
      ],
    })
    expect(w.status).toBe("VALID")
    expect(w.sumaW).toBe(30)
    expect(w.energiaDobowaKwh).toBeCloseTo(0.72, 9)
    expect(w.zalozenia).toHaveLength(2)
    expect(w.zakresyKatalogu).toContainEqual({ nazwa: "Router", minW: 5, maxW: 15 })
  })

  it("policz_standby_z_katalogu — 'inne' bez mocy → INVALID_INPUT (model nie zgaduje mocy)", async () => {
    const w = await wampiryKatalogTool.handler({ urzadzenia: [{ id: "inne", nazwa: "Drukarka", mocW: null }] })
    expect(w.status).toBe("INVALID_INPUT")
  })

  it("policz_standby_z_pomiarow — 8 W ciągle → 70,08 kWh/rok", async () => {
    const w = await wampiryPomiarTool.handler({ pozycje: [{ nazwa: "Sterownik", mocJalowaW: 8 }] })
    expect(w.status).toBe("VALID")
    expect(w.energiaRocznaKwh).toBeCloseTo(70.08, 9)
  })

  it("policz_scenariusz_automatyzacji_standby — 45 W → 15 W daje 0,72 kWh/dobę", async () => {
    const w = await wampiryAutomatyzacjaTool.handler({ standbyReferencyjnyW: 45, standbyWScenariuszuW: 15 })
    expect(w.redukcjaDobowaKwh).toBeCloseTo(0.72, 9)
  })

  it("porownaj_metody_odlaczania_standby — listwa 40/120 → 4 mies., Wi-Fi 150/200 → 9 mies.; router → gniazdo Wi-Fi", async () => {
    const w = await wampiryRekomendacjeTool.handler({
      metody: [
        { id: "listwa-z-wylacznikiem", kosztZakupuZl: 40, rocznaOszczednoscZl: 120 },
        { id: "gniazdo-wifi", kosztZakupuZl: 150, rocznaOszczednoscZl: 200 },
      ],
      kategoria: "router",
    })
    expect(w.metody[0].okresZwrotuMiesiecy).toBeCloseTo(4, 9)
    expect(w.metody[1].okresZwrotuMiesiecy).toBeCloseTo(9, 9)
    expect(w.metody[1].poborWlasny).toContain("Wi-Fi")
    expect(w.rekomendowanaMetoda).toBe("gniazdo-wifi")
  })

  it("porownaj_metody_odlaczania_standby — sam dobór metody (bez kosztów) to pełna odpowiedź", async () => {
    const w = await wampiryRekomendacjeTool.handler({ metody: [], kategoria: "ladowarki" })
    expect(w.status).toBe("VALID")
    expect(w.rekomendowanaMetoda).toBe("gniazdo-z-timerem")
  })

  it("symuluj_standby_bateria_koszt — autonomia: 45 W → 26 h, 15 W → 78 h przy 1,17 kWh", async () => {
    const w = await wampirySymulacjeTool.handler({
      tryb: "autonomia",
      standbyW: 45,
      standbyZredukowanyW: 15,
      pojemnoscUzytecznaKwh: 1.17,
      dodPct: 100,
    })
    expect(w.godzinyDoWyczerpania).toBeCloseTo(26, 9)
    expect(w.godzinyDoWyczerpaniaZredukowany).toBeCloseTo(78, 9)
    expect(w.kosztRocznyZl).toBeNull()
  })

  it("symuluj_standby_bateria_koszt — koszt-roczny: 50 W → 438 kWh/rok, 15% przy 2920 kWh", async () => {
    const w = await wampirySymulacjeTool.handler({
      tryb: "koszt-roczny",
      standbyW: 50,
      cenaEnergiiZlZaKwh: 1,
      zapotrzebowanieCalkowiteRocznaKwh: 2920,
    })
    expect(w.energiaRocznaKwh).toBeCloseTo(438, 9)
    expect(w.kosztRocznyZl).toBeCloseTo(438, 9)
    expect(w.udzialProcentowy).toBeCloseTo(15, 9)
  })

  it("symuluj_standby_bateria_koszt — wplyw-na-dobor: 0,56 kWh × 3 d / (0,95 × 0,8)", async () => {
    const w = await wampirySymulacjeTool.handler({
      tryb: "wplyw-na-dobor",
      standbyDobowaKwh: 0.7,
      eliminacjaPct: 80,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(w.redukcjaPojemnosciKwh).toBeCloseTo((0.56 * 3) / (0.95 * 0.8), 9)
  })

  it("symuluj_standby_bateria_koszt — brak ceny energii → INCOMPLETE z listą braków", async () => {
    const w = await wampirySymulacjeTool.handler({ tryb: "koszt-roczny", standbyW: 50 })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia[0]).toContain("cenaEnergiiZlZaKwh")
  })
})
