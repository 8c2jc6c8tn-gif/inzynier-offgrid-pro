import { describe, expect, it } from "vitest"
import { calculateOcenaZuzycia } from "../calculator"
import { CHECKLIST_ITEMS } from "../constants"

const WSZYSTKIE_POMIARY = CHECKLIST_ITEMS.map((item) => item.id)

describe("calculateOcenaZuzycia", () => {
  it("brak oceny wizualnej (null) -> status INCOMPLETE", () => {
    const result = calculateOcenaZuzycia({ widocznePuchniecie: null, potwierdzoneIds: [] })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("widoczne puchnięcie -> ostrzeżenie krytyczne, natychmiast, niezależnie od checklisty", () => {
    const result = calculateOcenaZuzycia({ widocznePuchniecie: true, potwierdzoneIds: [] })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("WIDOCZNE-WYBRZUSZENIE")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("brak puchnięcia, wszystkie pomiary wykonane -> VALID", () => {
    const result = calculateOcenaZuzycia({ widocznePuchniecie: false, potwierdzoneIds: WSZYSTKIE_POMIARY })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ potwierdzone: 3, razem: 3 })
    expect(result.warnings).toHaveLength(0)
  })

  it("brak puchnięcia, pomiary niekompletne -> INCOMPLETE", () => {
    const result = calculateOcenaZuzycia({
      widocznePuchniecie: false,
      potwierdzoneIds: [CHECKLIST_ITEMS[0].id],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(1)
  })

  it("i18n (17.2): widoczne wybrzuszenie zwraca i18nKey bez params, nie message", () => {
    const result = calculateOcenaZuzycia({ widocznePuchniecie: true, potwierdzoneIds: [] })
    expect(result.warnings[0].i18nKey).toBe("WIDOCZNE-WYBRZUSZENIE")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })
})
