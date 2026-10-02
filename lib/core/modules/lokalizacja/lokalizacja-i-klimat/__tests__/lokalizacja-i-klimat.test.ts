import { describe, expect, it } from "vitest"
import { calculateLokalizacja } from "../calculator"

describe("calculateLokalizacja", () => {
  it("brak danych -> INCOMPLETE", () => {
    const result = calculateLokalizacja({})
    expect(result.status).toBe("INCOMPLETE")
    expect(result.value.zapisano).toBe(false)
  })

  it("częściowe dane (brak temperatury) -> INCOMPLETE", () => {
    const result = calculateLokalizacja({ szerokoscGeograficzna: 52.2, dlugoscGeograficzna: 21.0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("komplet poprawnych danych -> VALID, zapisano", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 52.2,
      dlugoscGeograficzna: 21.0,
      temperaturaMinimalnaC: -22,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zapisano).toBe(true)
  })

  it("przypadek graniczny: szerokość dokładnie 90 -> VALID (na granicy, nie poza)", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 90,
      dlugoscGeograficzna: 0,
      temperaturaMinimalnaC: 0,
    })
    expect(result.status).toBe("VALID")
  })

  it("błędne dane: szerokość 120 (poza zakresem) -> INVALID_INPUT", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 120,
      dlugoscGeograficzna: 21.0,
      temperaturaMinimalnaC: -22,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("błędne dane: temperatura minimalna nierealistycznie wysoka -> INVALID_INPUT", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 52.2,
      dlugoscGeograficzna: 21.0,
      temperaturaMinimalnaC: 40,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): warning ma i18nKey/params, nie gotowy tekst PL", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 120,
      dlugoscGeograficzna: 21.0,
      temperaturaMinimalnaC: -22,
    })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-POZA-ZAKRESEM")
    expect(result.warnings[0].params).toEqual({ labelKey: "POLE-SZEROKOSC-GEOGRAFICZNA", min: -90, max: 90 })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): assumption to {kod}, nie gotowy tekst PL", () => {
    const result = calculateLokalizacja({
      szerokoscGeograficzna: 52.2,
      dlugoscGeograficzna: 21.0,
      temperaturaMinimalnaC: -22,
    })
    expect(result.assumptions).toEqual([{ kod: "DANE-KLIMATYCZNE-TRYB-OFFLINE" }])
  })
})
