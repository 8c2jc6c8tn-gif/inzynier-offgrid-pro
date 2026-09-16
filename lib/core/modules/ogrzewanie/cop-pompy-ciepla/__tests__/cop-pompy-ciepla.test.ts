import { describe, expect, it } from "vitest"
import { calculateCopPompyCiepla } from "../calculator"

describe("calculateCopPompyCiepla", () => {
  it("referencja ręczna: 40 kW cieplnych, COP 2,8 -> 14,285714... kW elektrycznych", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 40, cop: 2.8 })
    expect(result.status).toBe("VALID")
    expect(result.value).toBeCloseTo(40 / 2.8, 6)
  })

  it("COP wysoki (mroźny dzień, niski COP) daje wyższe zużycie elektryczne", () => {
    const zimny = calculateCopPompyCiepla({ mocCieplnaKw: 10, cop: 2 })
    const cieply = calculateCopPompyCiepla({ mocCieplnaKw: 10, cop: 4 })
    expect(zimny.value).toBeGreaterThan(cieply.value)
  })

  it("przypadek graniczny: COP = 1 (grzałka elektryczna, brak wzmocnienia)", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 5, cop: 1 })
    expect(result.value).toBe(5)
  })

  it("błędne dane: moc cieplna ujemna -> INVALID_INPUT", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: -5, cop: 3 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("błędne dane: COP poza sensownym zakresem (np. 15) -> INVALID_INPUT", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 5, cop: 15 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("ostrzeżenie: nietypowo wysoka moc cieplna -> VALID_WITH_WARNINGS", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 150, cop: 3 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
  })

  it("i18n (17.2): warnings mają i18nKey/params, nie gotowy tekst PL", () => {
    const ujemna = calculateCopPompyCiepla({ mocCieplnaKw: -5, cop: 3 })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
    expect(ujemna.warnings[0].params).toEqual({ label: "moc cieplna" })
    expect(ujemna.warnings[0].message).toBeUndefined()

    const copZly = calculateCopPompyCiepla({ mocCieplnaKw: 5, cop: 15 })
    expect(copZly.warnings[0].i18nKey).toBe("COP-POZA-ZAKRESEM")
    expect(copZly.warnings[0].message).toBeUndefined()

    const wysoka = calculateCopPompyCiepla({ mocCieplnaKw: 150, cop: 3 })
    expect(wysoka.warnings[0].i18nKey).toBe("MOC-CIEPLNA-NIETYPOWO-WYSOKA")
    expect(wysoka.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): assumption to {kod}, nie gotowy tekst PL", () => {
    const result = calculateCopPompyCiepla({ mocCieplnaKw: 40, cop: 2.8 })
    expect(result.assumptions).toEqual([{ kod: "COP-ZALEZY-OD-TEMPERATURY" }])
  })
})
