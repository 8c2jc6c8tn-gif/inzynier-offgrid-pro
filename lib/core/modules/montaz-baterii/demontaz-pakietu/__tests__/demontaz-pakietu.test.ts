import { describe, expect, it } from "vitest"
import { calculateDemontazPakietu } from "../calculator"

const WSZYSTKIE_KROKI = [
  "zatrzymaj-obciazenia",
  "wylacz-bms",
  "odlacz-wtyczke-balansujaca",
  "odlacz-p-minus",
  "odlacz-b-minus",
  "odlacz-b-plus",
  "demontaz-ogniw",
]

describe("calculateDemontazPakietu", () => {
  it("48V/16S, pakiet 49,6V (3,1V/ogniwo, w zalecanym zakresie), wszystkie kroki po kolei -> VALID", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 48,
      napieciePakietuV: 49.6,
      potwierdzoneIds: WSZYSTKIE_KROKI,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieOgniwaV).toBe(3.1)
    expect(result.warnings).toHaveLength(0)
  })

  it("przypadek graniczny: dokładnie 3,2V/ogniwo -> nie przekracza progu, brak ostrzeżenia", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 48,
      napieciePakietuV: 51.2,
      potwierdzoneIds: [],
    })
    expect(result.value.napiecieOgniwaV).toBe(3.2)
    expect(result.warnings.filter((w) => w.code === "PAKIET-WCIAZ-NALADOWANY")).toHaveLength(0)
  })

  it("pakiet wciąż naładowany (3,5V/ogniwo) -> ostrzeżenie krytyczne, niezależnie od checklisty", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 48,
      napieciePakietuV: 56,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("PAKIET-WCIAZ-NALADOWANY")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("napięcie pakietu niedodatnie -> INVALID_INPUT", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 24,
      napieciePakietuV: 0,
      potwierdzoneIds: [],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("krok potwierdzony poza kolejnością -> ostrzeżenie, nie liczy się do postępu", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 24,
      napieciePakietuV: 24.8, // 8S -> 3,1V/ogniwo, bezpieczne
      potwierdzoneIds: ["zatrzymaj-obciazenia", "demontaz-ogniw"],
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.potwierdzoneWKolejnosci).toBe(1)
    expect(result.warnings.some((w) => w.code === "KROK-POZA-KOLEJNOSCIA")).toBe(true)
  })

  it("dane w porządku, checklist niekompletny -> INCOMPLETE", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 12,
      napieciePakietuV: 12.4, // 4S -> 3,1V/ogniwo
      potwierdzoneIds: ["zatrzymaj-obciazenia"],
    })
    expect(result.status).toBe("INCOMPLETE")
    expect(result.warnings).toHaveLength(0)
  })

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 24,
      napieciePakietuV: 0,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("NAPIECIE-PAKIETU-NIEDODATNIE")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): pakiet wciąż naładowany zwraca i18nKey/params, nie message", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 48,
      napieciePakietuV: 56,
      potwierdzoneIds: [],
    })
    expect(result.warnings[0].i18nKey).toBe("PAKIET-WCIAZ-NALADOWANY")
    expect(result.warnings[0].params).toEqual({ napiecie: "3.50", max: 3.2 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): krok poza kolejnością zwraca i18nKey bez params, nie message", () => {
    const result = calculateDemontazPakietu({
      napiecieSystemu: 24,
      napieciePakietuV: 24.8,
      potwierdzoneIds: ["zatrzymaj-obciazenia", "demontaz-ogniw"],
    })
    const w = result.warnings.find((x) => x.code === "KROK-POZA-KOLEJNOSCIA")
    expect(w?.i18nKey).toBe("KROK-POZA-KOLEJNOSCIA")
    expect(w?.params).toBeUndefined()
    expect(w?.message).toBeUndefined()
  })
})
