import { describe, expect, it } from "vitest"
import { alarmyTelemetriiTool } from "./alarmy-telemetrii-tool"

describe("alarmyTelemetriiTool", () => {
  it("raises an alarm only for the latest valid reading and skips missing ones", async () => {
    const w = await alarmyTelemetriiTool.handler({
      pomiary: [
        { kanal: "bms", wielkosc: "soc", wartosc: 80, czasIso: "2026-01-01T10:00:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: 20, czasIso: "2026-01-01T10:05:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: null, czasIso: "2026-01-01T10:10:00Z" },
      ],
      progi: [{ id: "p1", wielkosc: "soc", kierunek: "ponizej", wartosc: 25, priorytet: "krytyczny" }],
    })
    expect(w.aktywne).toHaveLength(1)
    expect(w.aktywne[0].wartosc).toBe(20)
    expect(w.pominieteOdczyty).toBe(1)
  })

  it("requires at least one threshold", () => {
    const wynik = alarmyTelemetriiTool.inputSchema.safeParse({
      pomiary: [{ kanal: "bms", wielkosc: "soc", wartosc: 50, czasIso: "2026-01-01T10:00:00Z" }],
      progi: [],
    })
    expect(wynik.success).toBe(false)
  })
})
