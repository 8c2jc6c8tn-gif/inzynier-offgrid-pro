import { describe, expect, it } from "vitest"
import { obliczPojemnoscUzytecznaKwh } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import { calculateDniBezSlonca } from "../calculator"

const BAZA = { pojemnoscAh: 100, napiecieV: 12, dodPct: 80, sprawnoscPct: 100, zuzycieDoboweWh: 300 }

describe("calculateDniBezSlonca (M12/E32, dawne 8.59)", () => {
  it("100 Ah / 12 V, DoD 80%, odbiorniki DC (η 100%), 300 Wh/dobę → 3,2 dnia (Python: 16/5)", () => {
    const w = calculateDniBezSlonca(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.dni).toBeCloseTo(3.2, 12)
    expect(w.value.pelneDoby).toBe(3)
    expect(w.value.energiaDostepnaWh).toBeCloseTo(960, 9)
  })

  it("AGM DoD 50%, przetwornica 95%, 400 Wh/dobę → 1,425 dnia (Python: 57/40)", () => {
    const w = calculateDniBezSlonca({ ...BAZA, dodPct: 50, sprawnoscPct: 95, zuzycieDoboweWh: 400 })
    expect(w.value.dni).toBeCloseTo(57 / 40, 12)
    expect(w.value.pelneDoby).toBe(1)
  })

  it("echo M4/E1: pojemność z wzoru w przód dla wyniku daje z powrotem pojemność akumulatora", () => {
    const w = calculateDniBezSlonca({ ...BAZA, sprawnoscPct: 95 })
    const pojemnoscKwh = obliczPojemnoscUzytecznaKwh(BAZA.zuzycieDoboweWh / 1000, w.value.dni, 95, BAZA.dodPct)
    expect(pojemnoscKwh).toBeCloseTo(1.2, 12)
  })

  it("przypadek graniczny DoD 100%, η 100% → cała energia znamionowa", () => {
    const w = calculateDniBezSlonca({ ...BAZA, dodPct: 100, zuzycieDoboweWh: 1200 })
    expect(w.value.dni).toBeCloseTo(1, 12)
    expect(w.value.pelneDoby).toBe(1)
  })

  it("puste pole → INCOMPLETE, bez ostrzeżeń i bez założeń", () => {
    const w = calculateDniBezSlonca({ ...BAZA, zuzycieDoboweWh: 0 })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.warnings).toEqual([])
    expect(w.value.dni).toBe(0)
  })

  it("wartość ujemna i DoD > 100% → INVALID_INPUT z polami", () => {
    const w = calculateDniBezSlonca({ ...BAZA, pojemnoscAh: -5, dodPct: 120 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["pojemnoscAh", "dodPct"])
    expect(w.warnings.every((x) => x.level === "critical")).toBe(true)
  })

  it("sprawność > 100% → INVALID_INPUT", () => {
    const w = calculateDniBezSlonca({ ...BAZA, sprawnoscPct: 101 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("sprawnoscPct")
  })

  it("wynik poprawny zawsze niesie oba założenia (bez doładowania, bez korekty temperatury)", () => {
    const w = calculateDniBezSlonca(BAZA)
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toEqual([
      "DBS-ZALOZENIE-BEZ-DOLADOWANIA",
      "DBS-ZALOZENIE-BEZ-KOREKTY-TEMPERATURY",
    ])
  })
})
