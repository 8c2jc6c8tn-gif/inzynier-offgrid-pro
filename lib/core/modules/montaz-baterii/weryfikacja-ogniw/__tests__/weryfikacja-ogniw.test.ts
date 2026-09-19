import { describe, expect, it } from "vitest"
import { calculateWeryfikacjaOgniw } from "../calculator"
import { CHECKLIST_ITEMS } from "../constants"

const WSZYSTKIE_POTWIERDZONE = CHECKLIST_ITEMS.map((item) => item.id)

describe("calculateWeryfikacjaOgniw", () => {
  it("przypadek nominalny: 48V/16S, wszystkie ogniwa równe, BMS z balancerem, checklist pełny -> VALID", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 48,
      napieciaOgniwV: Array(16).fill(3.3),
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ liczbaOgniw: 16, minNapiecieV: 3.3, maxNapiecieV: 3.3, roznicaNapiecV: 0 })
    expect(result.warnings).toHaveLength(0)
  })

  it("przypadek graniczny: różnica napięć dokładnie 0,05V -> nie przekracza progu, brak ostrzeżenia", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 3.3, 3.25],
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.value.roznicaNapiecV).toBe(0.05)
    expect(result.warnings.filter((w) => w.code === "ROZNICA-NAPIEC-OGNIW-ZA-DUZA")).toHaveLength(0)
  })

  it("różnica napięć 0,051V (tuż nad progiem 0,05V) -> ostrzeżenie krytyczne (twardy stop)", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 3.3, 3.249],
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].level).toBe("critical")
    expect(result.warnings[0].code).toBe("ROZNICA-NAPIEC-OGNIW-ZA-DUZA")
  })

  it("brak BMS z balancerem -> ostrzeżenie krytyczne, nawet gdy checklist niekompletny", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 24,
      napieciaOgniwV: Array(8).fill(3.3),
      bmsMaBalancer: false,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].code).toBe("BRAK-BMS-Z-BALANSEREM")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("liczba ogniw niezgodna z napięciem systemu (12V=4S, podano 3) -> ostrzeżenie poziomu warning, nie critical", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 3.3],
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("LICZBA-OGNIW-NIEZGODNA")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("napięcie ogniwa ujemne -> status INVALID_INPUT", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 48,
      napieciaOgniwV: [3.3, -1, 3.3],
      bmsMaBalancer: true,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
    expect(result.warnings[0].code).toBe("NAPIECIE-OGNIWA-NIEDODATNIE")
  })

  it("brak wprowadzonych ogniw -> status INCOMPLETE", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 48,
      napieciaOgniwV: [],
      bmsMaBalancer: true,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.liczbaOgniw).toBe(0)
  })

  it("część ogniw wciąż na placeholderze 0 (jeszcze nie wpisane) -> status INCOMPLETE, nie błąd", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 0, 0],
      bmsMaBalancer: true,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings).toHaveLength(0)
  })

  it("dane liczbowe w porządku, ale checklist niekompletny -> status INCOMPLETE (nie VALID)", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 48,
      napieciaOgniwV: Array(16).fill(3.3),
      bmsMaBalancer: true,
      potwierdzoneIds: [CHECKLIST_ITEMS[0].id],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings).toHaveLength(0)
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey/params, nie message", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 48,
      napieciaOgniwV: [3.3, -1, 3.3],
      bmsMaBalancer: true,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("NAPIECIE-OGNIWA-NIEDODATNIE")
    expect(result.warnings[0].params).toEqual({ numer: 2 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): brak BMS z balancerem zwraca i18nKey bez params, nie message", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 24,
      napieciaOgniwV: Array(8).fill(3.3),
      bmsMaBalancer: false,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("BRAK-BMS-Z-BALANSEREM")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): różnica napięć za duża zwraca i18nKey/params, nie message", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 3.3, 3.249],
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.warnings[0].i18nKey).toBe("ROZNICA-NAPIEC-OGNIW-ZA-DUZA")
    expect(result.warnings[0].params).toEqual({ roznica: "0.051", prog: 0.05 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): liczba ogniw niezgodna zwraca i18nKey/params, nie message", () => {
    const result = calculateWeryfikacjaOgniw({
      napiecieSystemu: 12,
      napieciaOgniwV: [3.3, 3.3, 3.3],
      bmsMaBalancer: true,
      potwierdzoneIds: WSZYSTKIE_POTWIERDZONE,
    })
    expect(result.warnings[0].i18nKey).toBe("LICZBA-OGNIW-NIEZGODNA")
    expect(result.warnings[0].params).toEqual({ system: 12, oczekiwana: 4, podana: 3 })
    expect(result.warnings[0].message).toBeUndefined()
  })
})
