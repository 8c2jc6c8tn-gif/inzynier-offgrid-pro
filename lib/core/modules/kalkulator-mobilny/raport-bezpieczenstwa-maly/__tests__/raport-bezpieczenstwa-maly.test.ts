import { describe, expect, it } from "vitest"
import { calculateRaportBezpieczenstwa } from "../calculator"

const WSZYSTKO_OK = {
  "bezpiecznik-akumulatora": "ok",
  "dobor-bezpiecznikow": "ok",
  "przekroje-przewodow": "ok",
  "ochrona-rozladowania": "ok",
  "wentylacja-akumulatora": "ok",
  polaczenia: "ok",
} as const

describe("calculateRaportBezpieczenstwa (M12/E14, dawne 8.22)", () => {
  it("nic nie sprawdzone → INCOMPLETE, 0%", () => {
    const w = calculateRaportBezpieczenstwa({ odpowiedzi: {} })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.value.procentBezpieczenstwa).toBe(0)
    expect(w.value.razem).toBe(6)
  })

  it("wszystko OK → 100%, VALID, bez ostrzeżeń", () => {
    const w = calculateRaportBezpieczenstwa({ odpowiedzi: WSZYSTKO_OK })
    expect(w.status).toBe("VALID")
    expect(w.value.procentBezpieczenstwa).toBe(100)
    expect(w.warnings).toEqual([])
  })

  it("brak bezpiecznika przy akumulatorze → 🔴 (alert Biblii §12.22)", () => {
    const w = calculateRaportBezpieczenstwa({ odpowiedzi: { ...WSZYSTKO_OK, "bezpiecznik-akumulatora": "blad" } })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["RB-BRAK-BEZPIECZNIKA-AKUMULATORA", "critical"]])
    expect(w.value.procentBezpieczenstwa).toBeCloseTo((5 / 6) * 100, 12)
  })

  it("błąd przewodów → 🟡 krok naprawczy; niesprawdzone → ℹ️ i nie liczą się jako OK", () => {
    const w = calculateRaportBezpieczenstwa({ odpowiedzi: { "przekroje-przewodow": "blad", polaczenia: "ok" } })
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["RB-NAPRAWA-PRZEKROJE-PRZEWODOW", "warning"],
      ["RB-NIESPRAWDZONE", "info"],
    ])
    expect(w.value.liczbaNiesprawdzonych).toBe(4)
    expect(w.value.procentBezpieczenstwa).toBeCloseTo((1 / 6) * 100, 12)
  })

  it("same OK, część niesprawdzona → VALID (ℹ️ nie podnosi statusu)", () => {
    const w = calculateRaportBezpieczenstwa({ odpowiedzi: { polaczenia: "ok" } })
    expect(w.status).toBe("VALID")
  })
})
