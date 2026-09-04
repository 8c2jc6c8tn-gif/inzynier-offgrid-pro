import { describe, expect, it } from "vitest"
import { calculateLongTermStorage } from "../calculator"

describe("calculateLongTermStorage", () => {
  it("VALID — SoC w zakresie, temperatura bezpieczna, checklist w komplecie", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 55,
      temperaturaMinC: 5,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    expect(result.status).toBe("VALID")
    expect(result.value.socWZakresie).toBe(true)
    expect(result.value.temperaturaBezpieczna).toBe(true)
    expect(result.value.potwierdzoneCzynnosci).toBe(2)
    expect(result.warnings).toHaveLength(0)
  })

  it("granica: SoC=50% i SoC=60% mieszczą się w zakresie (włącznie)", () => {
    const dolna = calculateLongTermStorage({
      socDocelowyPct: 50,
      temperaturaMinC: 0,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    const gorna = calculateLongTermStorage({
      socDocelowyPct: 60,
      temperaturaMinC: 0,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    expect(dolna.value.socWZakresie).toBe(true)
    expect(gorna.value.socWZakresie).toBe(true)
    expect(dolna.status).toBe("VALID")
    expect(gorna.status).toBe("VALID")
  })

  it("VALID_WITH_WARNINGS — SoC poza zakresem (100%, bateria pełna przed odstawieniem)", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 100,
      temperaturaMinC: 0,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.socWZakresie).toBe(false)
    expect(result.warnings.some((w) => w.code === "SOC-POZA-ZALECANYM-ZAKRESEM")).toBe(true)
  })

  it("VALID_WITH_WARNINGS — temperatura poniżej -20°C (granica: -20.1°C)", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 55,
      temperaturaMinC: -20.1,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.temperaturaBezpieczna).toBe(false)
    expect(result.warnings.some((w) => w.code === "TEMPERATURA-PONIZEJ-MINIMUM")).toBe(true)
  })

  it("granica: temperatura dokładnie -20°C jest jeszcze bezpieczna", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 55,
      temperaturaMinC: -20,
      potwierdzoneIds: ["odlaczenie", "uspienie-bms"],
    })
    expect(result.value.temperaturaBezpieczna).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — dane liczbowe poprawne, ale checklist nie w komplecie i brak ostrzeżeń", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 55,
      temperaturaMinC: 5,
      potwierdzoneIds: ["odlaczenie"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzoneCzynnosci).toBe(1)
    expect(result.value.razemCzynnosci).toBe(2)
  })

  it("INCOMPLETE — socDocelowyPct jeszcze nie wpisano (0)", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 0,
      temperaturaMinC: 5,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INCOMPLETE — temperaturaMinC jeszcze nie wpisana (null)", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 55,
      temperaturaMinC: null,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — socDocelowyPct poza [0,100]", () => {
    const result = calculateLongTermStorage({
      socDocelowyPct: 150,
      temperaturaMinC: 5,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "SOC-UJEMNY")).toBe(true)
  })
})
