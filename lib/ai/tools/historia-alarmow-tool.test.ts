import { describe, expect, it } from "vitest"
import { historiaAlarmowTool } from "./historia-alarmow-tool"

const prog = { id: "p1", wielkosc: "soc" as const, kierunek: "ponizej" as const, wartosc: 25, priorytet: "krytyczny" as const }

describe("historiaAlarmowTool", () => {
  it("finds a closed episode with duration and extreme, skipping missing readings", async () => {
    const w = await historiaAlarmowTool.handler({
      pomiary: [
        { kanal: "bms", wielkosc: "soc", wartosc: 80, czasIso: "2026-01-01T10:00:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: 20, czasIso: "2026-01-01T10:05:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: null, czasIso: "2026-01-01T10:10:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: 12, czasIso: "2026-01-01T10:15:00Z" },
        { kanal: "bms", wielkosc: "soc", wartosc: 60, czasIso: "2026-01-01T10:35:00Z" },
      ],
      progi: [prog],
    })
    expect(w.epizody).toHaveLength(1)
    expect(w.epizody[0]).toMatchObject({ czasTrwaniaMin: 30, ekstremum: 12, doIso: "2026-01-01T10:35:00.000Z" })
    expect(w.pominieteOdczyty).toBe(1)
  })

  it("reports an ongoing episode with no end", async () => {
    const w = await historiaAlarmowTool.handler({
      pomiary: [{ kanal: "bms", wielkosc: "soc", wartosc: 10, czasIso: "2026-01-01T10:00:00Z" }],
      progi: [prog],
    })
    expect(w.epizody[0].doIso).toBeNull()
    expect(w.epizody[0].czasTrwaniaMin).toBeNull()
  })

  it("requires at least one threshold", () => {
    const wynik = historiaAlarmowTool.inputSchema.safeParse({
      pomiary: [{ kanal: "bms", wielkosc: "soc", wartosc: 50, czasIso: "2026-01-01T10:00:00Z" }],
      progi: [],
    })
    expect(wynik.success).toBe(false)
  })
})
