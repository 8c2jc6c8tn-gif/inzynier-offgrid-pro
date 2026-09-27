import { describe, expect, it } from "vitest"
import { calculateLadowanieWGarazu } from "../calculator"

describe("calculateLadowanieWGarazu (M12/E36, dawne 8.63)", () => {
  it("kwasowy: 3 pozycje; bez wentylacji → ostrzeżenie o wodorze (Biblia §12.51)", () => {
    const w = calculateLadowanieWGarazu({ chemia: "kwasowy", potwierdzoneIds: ["ladowarka-chemia"] })
    expect(w.value).toMatchObject({ potwierdzone: 1, razem: 3 })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["LG-OLOW-BEZ-WENTYLACJI", "warning"]])
  })

  it("LiFePO4: tylko ładowarka; info „nie wydziela gazów”", () => {
    const w = calculateLadowanieWGarazu({ chemia: "LiFePO4", potwierdzoneIds: ["ladowarka-chemia"] })
    expect(w.value.razem).toBe(1)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["LG-LIFEPO4-BEZ-GAZOW"])
  })

  it("AGM komplet → VALID bez ostrzeżeń", () => {
    const w = calculateLadowanieWGarazu({ chemia: "AGM", potwierdzoneIds: ["wentylacja", "brak-iskrzenia", "ladowarka-chemia"] })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
  })
})
