import { describe, expect, it } from "vitest"
import { validateAiToolDefinition } from "../../types"
import { czystoscISniegTool } from "../czystosc-i-snieg-tool"
import { komunikacjaBmsTool } from "../komunikacja-bms-tool"
import { porownanieTechnologiiTool } from "../porownanie-technologii-tool"

// Control examples are the engines' own (baterie/*, pv/czystosc-i-snieg __tests__) — the tools only echo.
describe("narzędzia AI — komunikacja BMS, porównanie technologii, czystość i śnieg (29.09.2026)", () => {
  it.each([komunikacjaBmsTool, porownanieTechnologiiTool, czystoscISniegTool])(
    "kontrakt 9.3: $name — 'read', bez potwierdzenia, opis z „Użyj, gdy”",
    (tool) => {
      expect(tool.operationType).toBe("read")
      expect(tool.requiresConfirmation).toBe(false)
      expect(tool.description).toContain("Użyj, gdy ")
      expect(() => validateAiToolDefinition(tool)).not.toThrow()
    },
  )

  it("sprawdz_komunikacje_bms — CAN/CAN zgodne; Pylontech/CAN niezgodne z ostrzeżeniem; 'inny' → OUT_OF_SCOPE", async () => {
    expect((await komunikacjaBmsTool.handler({ protokolBms: "can", protokolFalownika: "can" })).zgodne).toBe(true)
    const niezgodne = await komunikacjaBmsTool.handler({ protokolBms: "pylontech", protokolFalownika: "can" })
    expect(niezgodne.status).toBe("VALID_WITH_WARNINGS")
    expect(niezgodne.zgodne).toBe(false)
    expect(niezgodne.ostrzezenia[0]).not.toBe("PROTOKOLY-NIEZGODNE")
    const inny = await komunikacjaBmsTool.handler({ protokolBms: "inny", protokolFalownika: "can" })
    expect(inny.status).toBe("OUT_OF_SCOPE")
  })

  it("porownaj_technologie_magazynow — 10 kWh LiFePO4: 10 × 5000 × 0,8 = 40 000 kWh; bez pojemności → per 1 kWh", async () => {
    const w = await porownanieTechnologiiTool.handler({ pojemnoscKwh: 10 })
    expect(w.technologie).toHaveLength(4)
    expect(w.technologie.find((t) => t.nazwa === "LiFePO4")?.energiaCalkowitaKwh).toBeCloseTo(40000, 9)
    const baza = await porownanieTechnologiiTool.handler({ pojemnoscKwh: null })
    expect(baza.technologie[0].energiaCalkowitaKwh).toBeCloseTo(4000, 9)
    expect(baza.zalozenia.length).toBe(2)
  })

  it("ocen_czystosc_i_snieg_paneli — 35° zsuwanie; spadek 12% bez deszczu → myć, z deszczem → odroczone", async () => {
    const w = await czystoscISniegTool.handler({ katStopni: 35, spadekProdukcjiPct: 12, deszczWCiaguKilkuDni: false })
    expect(w.samooczyszczanie?.pasmo).toBe("zsuwanie")
    expect(w.mycie?.rekomendacjaMycia).toBe(true)
    const deszcz = await czystoscISniegTool.handler({ katStopni: null, spadekProdukcjiPct: 12, deszczWCiaguKilkuDni: true })
    expect(deszcz.samooczyszczanie).toBeNull()
    expect(deszcz.mycie?.rekomendacjaMycia).toBe(false)
  })

  it("ocen_czystosc_i_snieg_paneli — spadek bez informacji o deszczu → uwaga zamiast zgadywania", async () => {
    const w = await czystoscISniegTool.handler({ katStopni: null, spadekProdukcjiPct: 12, deszczWCiaguKilkuDni: null })
    expect(w.mycie).toBeNull()
    expect(w.uwagi[0]).toContain("deszczWCiaguKilkuDni")
  })
})
