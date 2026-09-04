import { describe, expect, it } from "vitest"
import { calculateLoadShedding } from "../calculator"

describe("calculateLoadShedding", () => {
  it("priorytet 1 — nigdy nie odłączany, nawet przy SoC=0%", () => {
    const result = calculateLoadShedding({ priorytet: 1, socPct: 0, maNadwyzkePv: false })
    expect(result.status).toBe("VALID")
    expect(result.value.odlaczone).toBe(false)
  })

  it("przykład źródła Sekcji C: SoC 18% -> priorytet 3 odłączony (zmywarka/suszarka)", () => {
    const result = calculateLoadShedding({ priorytet: 3, socPct: 18, maNadwyzkePv: false })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.odlaczone).toBe(true)
  })

  it("przykład źródła Sekcji C: SoC 18% -> priorytet 1 pozostaje aktywny (ogrzewanie/pompa)", () => {
    const result = calculateLoadShedding({ priorytet: 1, socPct: 18, maNadwyzkePv: false })
    expect(result.value.odlaczone).toBe(false)
  })

  it("priorytet 2 — aktywny przy SoC=20% (próg to <20%, nie <=)", () => {
    const result = calculateLoadShedding({ priorytet: 2, socPct: 20, maNadwyzkePv: false })
    expect(result.value.odlaczone).toBe(false)
  })

  it("priorytet 2 — odłączony przy SoC=19,9%", () => {
    const result = calculateLoadShedding({ priorytet: 2, socPct: 19.9, maNadwyzkePv: false })
    expect(result.value.odlaczone).toBe(true)
  })

  it("priorytet 3 — odłączony przy SoC=95% ale bez nadwyżki PV", () => {
    const result = calculateLoadShedding({ priorytet: 3, socPct: 95, maNadwyzkePv: false })
    expect(result.value.odlaczone).toBe(true)
  })

  it("priorytet 3 — aktywny przy SoC=95% z nadwyżką PV", () => {
    const result = calculateLoadShedding({ priorytet: 3, socPct: 95, maNadwyzkePv: true })
    expect(result.value.odlaczone).toBe(false)
  })

  it("INCOMPLETE — priorytet jeszcze nie wybrany", () => {
    const result = calculateLoadShedding({ priorytet: 0, socPct: 50, maNadwyzkePv: false })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — SoC poza zakresem", () => {
    const result = calculateLoadShedding({ priorytet: 2, socPct: 120, maNadwyzkePv: false })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
