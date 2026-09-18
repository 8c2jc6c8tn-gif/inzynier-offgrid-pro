import { describe, expect, it } from "vitest"
import { calculateChlodzenieLatem } from "../calculator"

describe("calculateChlodzenieLatem", () => {
  it("VALID — temperatura w środku zakresu", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: 25 })
    expect(result.status).toBe("VALID")
    expect(result.value.wZakresie).toBe(true)
    expect(result.warnings[0].code).toBe("TEMPERATURA-W-ZAKRESIE")
  })

  it("granica: 15°C i 35°C mieszczą się w zakresie (włącznie)", () => {
    const dolna = calculateChlodzenieLatem({ temperaturaOgniwC: 15 })
    const gorna = calculateChlodzenieLatem({ temperaturaOgniwC: 35 })
    expect(dolna.value.wZakresie).toBe(true)
    expect(gorna.value.wZakresie).toBe(true)
    expect(dolna.status).toBe("VALID")
    expect(gorna.status).toBe("VALID")
  })

  it("VALID_WITH_WARNINGS — powyżej zakresu (przykład ze źródła: 48°C)", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: 48 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wZakresie).toBe(false)
    const w = result.warnings.find((w) => w.code === "TEMPERATURA-POWYZEJ-ZAKRESU")
    expect(w?.level).toBe("critical")
  })

  it("VALID_WITH_WARNINGS — poniżej zakresu", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: 5 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wZakresie).toBe(false)
    expect(result.warnings[0].code).toBe("TEMPERATURA-PONIZEJ-ZAKRESU")
  })

  it("INCOMPLETE — temperatura jeszcze nie wpisana (null)", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: null })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("VALID — 0°C jest poprawną, ujemnie-poniżej-zakresu wartością, nie placeholderem", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: 0 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.temperaturaOgniwC).toBe(0)
  })

  it("INVALID_INPUT — temperatura fizycznie niemożliwa (poniżej zera bezwzględnego)", () => {
    const result = calculateChlodzenieLatem({ temperaturaOgniwC: -300 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia zwracają i18nKey/params, nie message", () => {
    const powyzej = calculateChlodzenieLatem({ temperaturaOgniwC: 48 })
    expect(powyzej.warnings[0].i18nKey).toBe("TEMPERATURA-POWYZEJ-ZAKRESU")
    expect(powyzej.warnings[0].params).toEqual({ temp: "48.0", max: 35 })
    expect(powyzej.warnings[0].message).toBeUndefined()

    const ponizej = calculateChlodzenieLatem({ temperaturaOgniwC: 5 })
    expect(ponizej.warnings[0].i18nKey).toBe("TEMPERATURA-PONIZEJ-ZAKRESU")
    expect(ponizej.warnings[0].message).toBeUndefined()

    const wZakresie = calculateChlodzenieLatem({ temperaturaOgniwC: 25 })
    expect(wZakresie.warnings[0].i18nKey).toBe("TEMPERATURA-W-ZAKRESIE")
    expect(wZakresie.warnings[0].message).toBeUndefined()

    const fizycznieNiemozliwa = calculateChlodzenieLatem({ temperaturaOgniwC: -300 })
    expect(fizycznieNiemozliwa.warnings[0].i18nKey).toBe("TEMPERATURA-FIZYCZNIE-NIEMOZLIWA")
    expect(fizycznieNiemozliwa.warnings[0].message).toBeUndefined()
  })
})
