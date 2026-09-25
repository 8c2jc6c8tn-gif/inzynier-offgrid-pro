import { describe, expect, it } from "vitest"
import { calculateMikropeknieciaTermiczne } from "../calculator"
import { validateInput } from "../validation"
import { ODSTEP_DYLATACYJNY_MIN_MM } from "../constants"

describe("calculateMikropeknieciaTermiczne (M3/E7)", () => {
  it("nominalny: EPDM + odstęp 5 mm (dokładnie minimum źródła) → montaż elastyczny, VALID, tylko info", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: 5, podkladkiEpdm: true })
    expect(wynik.status).toBe("VALID")
    expect(wynik.value.montazSztywny).toBe(false)
    expect(wynik.warnings.map((w) => w.code)).toEqual(["MIKROPEKNIECIA-MONTAZ-ELASTYCZNY"])
    expect(wynik.warnings[0].level).toBe("info")
    expect(wynik.assumptions).toEqual([{ kod: "MIKROPEKNIECIA-DANE-ZE-ZRODLA" }])
  })

  it("wartość graniczna: odstęp tuż poniżej 5 mm → ostrzeżenie o odstępie (warning)", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: 4.9, podkladkiEpdm: true })
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.value.montazSztywny).toBe(true)
    const w = wynik.warnings.find((x) => x.code === "MIKROPEKNIECIA-ODSTEP-ZA-MALY")
    expect(w?.level).toBe("warning")
    expect(w?.params).toMatchObject({ odstep: 4.9, min: ODSTEP_DYLATACYJNY_MIN_MM, lata: 2 })
  })

  it("montaż na styk (0 mm, legalna wartość) i bez EPDM → oba ostrzeżenia, brak info", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: 0, podkladkiEpdm: false })
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.warnings.map((w) => w.code).sort()).toEqual([
      "MIKROPEKNIECIA-BRAK-EPDM",
      "MIKROPEKNIECIA-ODSTEP-ZA-MALY",
    ])
  })

  it("wystarczający odstęp, ale bez EPDM → montaż nadal sztywny", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: 10, podkladkiEpdm: false })
    expect(wynik.value.montazSztywny).toBe(true)
    expect(wynik.warnings.map((w) => w.code)).toEqual(["MIKROPEKNIECIA-BRAK-EPDM"])
  })

  it("brak danych (odstęp nie wpisany) → INCOMPLETE, bez ostrzeżeń i bez fabrykowanego wyniku", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: null, podkladkiEpdm: true })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.warnings).toEqual([])
    expect(wynik.inputs).toEqual({})
  })

  it("wartość ujemna → INVALID_INPUT z kodem walidacji", () => {
    const wynik = calculateMikropeknieciaTermiczne({ odstepDylatacyjnyMm: -2, podkladkiEpdm: true })
    expect(wynik.status).toBe("INVALID_INPUT")
    expect(wynik.warnings[0].code).toBe("WARTOSC-UJEMNA")
  })

  it("K3: funkcja walidująca sama zgłasza WARTOSC-UJEMNA i milczy dla poprawnych danych", () => {
    expect(validateInput({ odstepDylatacyjnyMm: -1, podkladkiEpdm: false }).errors.map((e) => e.code)).toEqual([
      "WARTOSC-UJEMNA",
    ])
    expect(validateInput({ odstepDylatacyjnyMm: 0, podkladkiEpdm: false }).errors).toEqual([])
    expect(validateInput({ odstepDylatacyjnyMm: null, podkladkiEpdm: false }).errors).toEqual([])
  })
})
