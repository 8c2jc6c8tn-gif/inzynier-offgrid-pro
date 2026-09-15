import { describe, expect, it } from "vitest"
import { calculateKonfiguratorStringow } from "../calculator"

describe("calculateKonfiguratorStringow", () => {
  it("szereg: dodaje napięcia, prąd bez zmian (referencja ręczna: 8 × 40V = 320V, 11A)", () => {
    const result = calculateKonfiguratorStringow({
      mode: "szereg",
      vmpV: 40,
      impA: 11,
      liczbaPaneli: 8,
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ voltageV: 320, currentA: 11 })
  })

  it("rownolegle: napięcie bez zmian, dodaje prądy (referencja ręczna: 40V, 4 × 11A = 44A)", () => {
    const result = calculateKonfiguratorStringow({
      mode: "rownolegle",
      vmpV: 40,
      impA: 11,
      liczbaPaneli: 4,
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ voltageV: 40, currentA: 44 })
  })

  it("mieszany: grupy szeregowe połączone równolegle (4 w grupie, 2 grupy: 160V, 22A)", () => {
    const result = calculateKonfiguratorStringow({
      mode: "mieszany",
      vmpV: 40,
      impA: 11,
      panelWGrupie: 4,
      liczbaGrup: 2,
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ voltageV: 160, currentA: 22 })
    expect(result.assumptions.some((a) => typeof a === "string" && a.includes("Razem 8 paneli"))).toBe(true)
  })

  it("przypadek graniczny: 1 panel w szeregu to po prostu ten panel", () => {
    const result = calculateKonfiguratorStringow({
      mode: "szereg",
      vmpV: 40,
      impA: 11,
      liczbaPaneli: 1,
    })
    expect(result.value).toEqual({ voltageV: 40, currentA: 11 })
  })

  it("błędne dane: ujemne Vmp -> INVALID_INPUT", () => {
    const result = calculateKonfiguratorStringow({
      mode: "szereg",
      vmpV: -5,
      impA: 11,
      liczbaPaneli: 8,
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.field === "vmpV")).toBe(true)
  })

  it("błędne dane: niecałkowita liczba paneli -> INVALID_INPUT", () => {
    const result = calculateKonfiguratorStringow({
      mode: "szereg",
      vmpV: 40,
      impA: 11,
      liczbaPaneli: 3.5,
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.code === "LICZBAPANELI-NIE-CALKOWITA")).toBe(true)
  })

  it("brak danych: liczba grup = 0 w trybie mieszanym -> INVALID_INPUT", () => {
    const result = calculateKonfiguratorStringow({
      mode: "mieszany",
      vmpV: 40,
      impA: 11,
      panelWGrupie: 4,
      liczbaGrup: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings.some((w) => w.field === "liczbaGrup")).toBe(true)
  })

  it("ostrzeżenie: nietypowo duża liczba paneli -> VALID_WITH_WARNINGS, ale policzone", () => {
    const result = calculateKonfiguratorStringow({
      mode: "rownolegle",
      vmpV: 40,
      impA: 11,
      liczbaPaneli: 50,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value).toEqual({ voltageV: 40, currentA: 550 })
  })
})
