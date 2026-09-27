import { describe, expect, it } from "vitest"
import { calculateRatowanieAkumulatoraMaly } from "../calculator"

describe("calculateRatowanieAkumulatoraMaly (M12/E42, dawne 8.70)", () => {
  it("przykład źródła: AGM → odsyła do Montaż baterii (B10 ocena, B11 ratowanie zasiarczonego)", () => {
    const w = calculateRatowanieAkumulatoraMaly({ chemia: "AGM", napiecieSpoczynkoweV: null })
    expect(w.status).toBe("VALID")
    expect(w.value.procedury.map((p) => p.ekran)).toEqual(["M11/B10", "M11/B11"])
    expect(w.value.krytycznieRozladowany).toBeNull()
  })

  it("LiFePO4 → A9 + info o pomiarze pojedynczych ogniw; napięcie pakietu nie jest oceniane", () => {
    const w = calculateRatowanieAkumulatoraMaly({ chemia: "LiFePO4", napiecieSpoczynkoweV: 9 })
    expect(w.value.procedury).toEqual([{ ekran: "M11/A9", href: "/kalkulatory/ratowanie-ogniwa" }])
    expect(w.value.krytycznieRozladowany).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["RAM-LIFEPO4-ZMIERZ-OGNIWA"])
  })

  it("kwasowy 10,4 V → krytycznie rozładowany (Biblia: < 10,5 V), tylko info — status VALID", () => {
    const w = calculateRatowanieAkumulatoraMaly({ chemia: "kwasowy", napiecieSpoczynkoweV: 10.4 })
    expect(w.value.krytycznieRozladowany).toBe(true)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.level)).toEqual(["info"])
  })

  it("granica 10,5 V → nie „krytycznie” (próg: poniżej 10,5 V)", () => {
    expect(calculateRatowanieAkumulatoraMaly({ chemia: "AGM", napiecieSpoczynkoweV: 10.5 }).value.krytycznieRozladowany).toBe(false)
  })

  it("0 V to prawidłowy pomiar (nie „brak danych”) → krytycznie", () => {
    expect(calculateRatowanieAkumulatoraMaly({ chemia: "AGM", napiecieSpoczynkoweV: 0 }).value.krytycznieRozladowany).toBe(true)
  })

  it("brak chemii → INCOMPLETE; napięcie ujemne → INVALID_INPUT", () => {
    expect(calculateRatowanieAkumulatoraMaly({ chemia: null, napiecieSpoczynkoweV: 12 }).status).toBe("INCOMPLETE")
    expect(calculateRatowanieAkumulatoraMaly({ chemia: "AGM", napiecieSpoczynkoweV: -1 }).status).toBe("INVALID_INPUT")
  })
})
