import { describe, expect, it } from "vitest"
import { calculateObwodPrecharge, obliczCzasPreChargeS } from "../calculator"

describe("obliczCzasPreChargeS (formuła czysta, re-używana przez M11/A4)", () => {
  it("R=50Ω, C=2200µF -> T=0,55s (zweryfikowane niezależnie w Pythonie)", () => {
    expect(obliczCzasPreChargeS(50, 2200)).toBe(0.55)
  })

  it("R=50Ω, C=10000µF -> T=2,5s", () => {
    expect(obliczCzasPreChargeS(50, 10000)).toBe(2.5)
  })

  it("przykład ze źródła (R=50Ω/50W, T≈3s) odpowiada C≈12000µF -> potwierdzone przeliczeniem odwrotnym", () => {
    expect(obliczCzasPreChargeS(50, 12000)).toBe(3)
  })
})

describe("calculateObwodPrecharge", () => {
  it("R=50Ω, C=2200µF -> VALID, 0,55s", () => {
    const result = calculateObwodPrecharge({ pojemnoscFalownikaUf: 2200, rezystancjaPreChargeOhm: 50 })
    expect(result.status).toBe("VALID")
    expect(result.value.czasPreChargeS).toBe(0.55)
  })

  it("przykładowy rezystor ze źródła (50Ω/50W) z dużą pojemnością -> ok. 3s", () => {
    const result = calculateObwodPrecharge({ pojemnoscFalownikaUf: 12000, rezystancjaPreChargeOhm: 50 })
    expect(result.value.czasPreChargeS).toBe(3)
  })

  it("pojemność ujemna -> status INVALID_INPUT", () => {
    const result = calculateObwodPrecharge({ pojemnoscFalownikaUf: -1, rezystancjaPreChargeOhm: 50 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("rezystancja ujemna -> status INVALID_INPUT", () => {
    const result = calculateObwodPrecharge({ pojemnoscFalownikaUf: 2200, rezystancjaPreChargeOhm: -5 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (0/0) -> status INCOMPLETE", () => {
    const result = calculateObwodPrecharge({ pojemnoscFalownikaUf: 0, rezystancjaPreChargeOhm: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })
})
