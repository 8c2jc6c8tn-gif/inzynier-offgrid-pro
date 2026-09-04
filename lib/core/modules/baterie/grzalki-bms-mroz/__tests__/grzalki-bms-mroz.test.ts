import { describe, expect, it } from "vitest"
import { calculateGrzalkiBmsMroz } from "../calculator"

describe("calculateGrzalkiBmsMroz", () => {
  it("VALID — temperatura dokładnie na progu 5°C: brak potrzeby grzania", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: 5, socPct: 50, produkcjaPv: "nie" })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodloGrzania).toBe("brak-potrzeby")
  })

  it("VALID — temperatura powyżej progu: brak potrzeby grzania", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: 10, socPct: 10, produkcjaPv: "nie" })
    expect(result.value.zrodloGrzania).toBe("brak-potrzeby")
  })

  it("VALID — poniżej 5°C, jest PV: grzanie z paneli", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 10, produkcjaPv: "tak" })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodloGrzania).toBe("pv")
  })

  it("VALID_WITH_WARNINGS — poniżej 5°C, brak PV, SoC powyżej 30%: grzanie z baterii", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 31, produkcjaPv: "nie" })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zrodloGrzania).toBe("bateria")
    expect(result.warnings.some((w) => w.code === "GRZANIE-Z-BATERII")).toBe(true)
  })

  it("VALID_WITH_WARNINGS — poniżej 5°C, brak PV, SoC poniżej 30%: grzanie wstrzymane (krytyczne)", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 29, produkcjaPv: "nie" })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zrodloGrzania).toBe("wstrzymane")
    const w = result.warnings.find((w) => w.code === "GRZANIE-WSTRZYMANE")
    expect(w?.level).toBe("critical")
  })

  it("OUT_OF_SCOPE — granica SoC dokładnie 30%, źródło nie rozstrzyga strony", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 30, produkcjaPv: "nie" })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("INCOMPLETE — temperatura jeszcze nie wpisana (null)", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: null, socPct: 50, produkcjaPv: "tak" })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INCOMPLETE — produkcjaPv jeszcze nie wybrana", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 50, produkcjaPv: "" })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — SoC poza [0,100]", () => {
    const result = calculateGrzalkiBmsMroz({ temperaturaMinC: -3, socPct: 150, produkcjaPv: "nie" })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
