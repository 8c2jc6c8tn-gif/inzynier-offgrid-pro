import { describe, expect, it } from "vitest"
import { calculateMontazMechaniczny } from "../calculator"
import { CHECKLIST_ITEMS } from "../constants"

const WSZYSTKIE_ID = CHECKLIST_ITEMS.map((item) => item.id)

describe("calculateMontazMechaniczny (Ekran A2, Moduł 11)", () => {
  it("nominalny: docisk w zakresie + checklist pełny → VALID", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 350, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.status).toBe("VALID")
    expect(result.value.dociskWZakresie).toBe(true)
    expect(result.warnings).toHaveLength(0)
  })

  it("graniczny: docisk dokładnie na dolnej granicy zakresu (300 kgf) → VALID", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 300, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.status).toBe("VALID")
    expect(result.value.dociskWZakresie).toBe(true)
  })

  it("docisk poniżej zakresu → VALID_WITH_WARNINGS (echo z pozycjonowanie-ogniw)", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 250, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.dociskWZakresie).toBe(false)
    expect(result.warnings[0].code).toBe("DOCISK-ZA-MALY")
  })

  it("docisk powyżej zakresu → VALID_WITH_WARNINGS", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 450, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("DOCISK-ZA-DUZY")
  })

  it("błędne dane: docisk ujemny → INVALID_INPUT", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: -10, potwierdzoneIds: [] })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: docisk = 0 (niewypełnione) → INCOMPLETE", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 0, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("docisk w zakresie, ale checklist niepełny → INCOMPLETE, nie VALID", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 350, potwierdzoneIds: ["separatory"] })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.potwierdzone).toBe(1)
    expect(result.value.razem).toBe(3)
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: -10, potwierdzoneIds: [] })
    expect(result.warnings[0].i18nKey).toBe("DOCISK-NIEDODATNI")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): ostrzeżenie echo (docisk za mały) ma już i18nKey/params z pozycjonowanie-ogniw, nie message", () => {
    const result = calculateMontazMechaniczny({ dociskKgf: 250, potwierdzoneIds: WSZYSTKIE_ID })
    expect(result.warnings[0].i18nKey).toBe("DOCISK-ZA-MALY")
    expect(result.warnings[0].params).toEqual({ docisk: 250, min: 300, max: 400 })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
