import { describe, expect, it } from "vitest"
import { calculateStratyZlaczkiMc4 } from "../calculator"

describe("calculateStratyZlaczkiMc4", () => {
  it("przykład źródła: 20 złączek, 10A, dobry styk (R=1mΩ) -> strata całkowita 2W, info", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 1,
      liczbaZlaczek: 20,
      pradA: 10,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.strataNaZlaczkeW).toBeCloseTo(0.1, 6)
    expect(result.value.strataCalkowitaW).toBeCloseTo(2, 6)
    expect(result.warnings[0].code).toBe("DOBRY-STYK")
    expect(result.warnings[0].level).toBe("info")
  })

  it("zły styk (R=25mΩ, powyżej progu 10× górnej granicy dobrego stanu = 20mΩ) -> critical", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 25,
      liczbaZlaczek: 20,
      pradA: 10,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.strataCalkowitaW).toBeCloseTo(50, 6)
    expect(result.warnings[0].code).toBe("ZLY-STYK")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("rezystancja podwyższona ale poniżej 10x -> warning", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 5,
      liczbaZlaczek: 20,
      pradA: 10,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("PODWYZSZONA-REZYSTANCJA")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("rezystancja dokładnie na granicy dobrego stanu (2mΩ) -> info", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 2,
      liczbaZlaczek: 10,
      pradA: 8,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("DOBRY-STYK")
  })

  it("INCOMPLETE — prąd jeszcze nie wpisany", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 1,
      liczbaZlaczek: 20,
      pradA: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna liczba złączek", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 1,
      liczbaZlaczek: -20,
      pradA: 10,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ZLY-STYK ma i18nKey+params, assumptions to {kod}", () => {
    const result = calculateStratyZlaczkiMc4({
      rezystancjaZlaczkiMOhm: 25,
      liczbaZlaczek: 20,
      pradA: 10,
    })
    expect(result.warnings[0].i18nKey).toBe("ZLY-STYK")
    expect(result.warnings[0].params).toEqual({ rezystancja: "25.00", strata: "50.0" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([
      { kod: "REZYSTANCJA-ZLACZKI-RECZNIE" },
      { kod: "PRAD-SZEREGOWY-PRZEZ-WSZYSTKIE-ZLACZKI" },
    ])
  })
})
