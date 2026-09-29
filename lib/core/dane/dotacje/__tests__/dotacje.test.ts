import { describe, expect, it } from "vitest"
import { DOTACJE, stanNaboru } from ".."

const pozycja = (id: string) => DOTACJE.find((d) => d.id === id)!

describe("dotacje — stan naboru z datą (§9)", () => {
  it("FEPK po 31.03.2026 → zakończony", () => {
    expect(stanNaboru(pozycja("fepk-02-03"), "2026-09-28")).toBe("zakonczony")
    expect(stanNaboru(pozycja("fepk-02-03"), "2026-03-31")).toBe("trwa")
  })
  it("PME: przed 4.09.2026 przyszły, potem trwa do 31.08.2027", () => {
    expect(stanNaboru(pozycja("pme"), "2026-09-01")).toBe("przyszly")
    expect(stanNaboru(pozycja("pme"), "2026-09-28")).toBe("trwa")
    expect(stanNaboru(pozycja("pme"), "2027-09-01")).toBe("zakonczony")
  })
  it("ulga bez terminu naboru", () => {
    expect(stanNaboru(pozycja("ulga-termo"), "2026-09-28")).toBe("bez-terminu")
  })
  it("każda pozycja ma stanNa i dotyczy", () => {
    for (const d of DOTACJE) {
      expect(d.stanNa).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(d.dotyczy.length).toBeGreaterThan(0)
    }
  })
})
