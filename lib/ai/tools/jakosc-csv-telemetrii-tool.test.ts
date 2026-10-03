import { describe, expect, it } from "vitest"
import { jakoscCsvTelemetriiTool } from "./jakosc-csv-telemetrii-tool"

const profil = {
  kolumnaCzasu: "time",
  formatCzasu: "iso" as const,
  kolumny: [{ kolumna: "u", kanal: "bat", wielkosc: "napiecie", jednostka: "V" }],
}

describe("jakoscCsvTelemetriiTool", () => {
  it("reports gaps and bad rows without storing anything", async () => {
    const csv = ["time,u", "2026-01-01 00:00:00,12.5", "2026-01-01 00:01:00,12.6", "2026-01-01 00:10:00,12.7", "zle,12.8"].join("\n")
    const w = await jakoscCsvTelemetriiTool.handler({ tekstCsv: csv, profil, krokS: 60 })
    expect(w.probek).toBe(3)
    expect(w.bledyWierszy).toBe(1)
    expect(w.luki).toHaveLength(1)
  })

  it("rejects a non-positive step", () => {
    expect(jakoscCsvTelemetriiTool.inputSchema.safeParse({ tekstCsv: "a", profil, krokS: 0 }).success).toBe(false)
  })
})
