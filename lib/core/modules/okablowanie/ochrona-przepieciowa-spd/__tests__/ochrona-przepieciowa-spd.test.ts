import { describe, expect, it } from "vitest"
import { calculateOchronaPrzepieciowaSpd } from "../calculator"

describe("calculateOchronaPrzepieciowaSpd", () => {
  it("przykład źródła: 320V -> Typ 2, Uc min 400V, wszystko OK -> VALID", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: false,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.typWymagany).toBe("Typ 2")
    expect(result.value.ucMinimalneV).toBeCloseTo(400, 9)
    expect(result.warnings[0].code).toBe("SPD-DOBRANY-POPRAWNIE")
  })

  it("instalacja odgromowa wymaga Typu 1 -> KRYTYCZNE gdy brak", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: true,
      odlegloscOdZwoduM: 2,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.typWymagany).toBe("Typ 1")
    expect(result.warnings.some((w) => w.code === "BRAK-TYPU-1-PRZY-ODGROMOWEJ")).toBe(true)
  })

  it("KRYTYCZNE — panele 0,3m od zwodu (poniżej 0,5m)", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: true,
      odlegloscOdZwoduM: 0.3,
      maZainstalowanySpdTyp1: true,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(result.warnings.some((w) => w.code === "ZA-BLISKO-ZWODU")).toBe(true)
  })

  it("KRYTYCZNE — Uc poniżej minimum (350V < 400V wymagane)", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: false,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 350,
      uziemienieViaGsw: true,
    })
    expect(result.warnings.some((w) => w.code === "UC-PONIZEJ-MINIMUM")).toBe(true)
  })

  it("KRYTYCZNE — SPD uziemiony osobno, nie przez GSW", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: false,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: false,
    })
    expect(result.warnings.some((w) => w.code === "SPD-UZIEMIONY-OSOBNO")).toBe(true)
  })

  it("INCOMPLETE — odległość od zwodu niepodana mimo instalacji odgromowej", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: true,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemne napięcie", () => {
    const result = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: -10,
      maInstalacjeOdgromowa: false,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): SPD-DOBRANY-POPRAWNIE i ZA-BLISKO-ZWODU mają i18nKey+params, nie message", () => {
    const ok = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: false,
      odlegloscOdZwoduM: null,
      maZainstalowanySpdTyp1: false,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    expect(ok.warnings[0].i18nKey).toBe("SPD-DOBRANY-POPRAWNIE")
    expect(ok.warnings[0].params).toEqual({ typ: "Typ 2" })
    expect(ok.warnings[0].message).toBeUndefined()

    const zaBlisko = calculateOchronaPrzepieciowaSpd({
      vocMaxStringuV: 320,
      maInstalacjeOdgromowa: true,
      odlegloscOdZwoduM: 0.3,
      maZainstalowanySpdTyp1: true,
      ucSpdV: 400,
      uziemienieViaGsw: true,
    })
    const w = zaBlisko.warnings.find((x) => x.code === "ZA-BLISKO-ZWODU")
    expect(w?.i18nKey).toBe("ZA-BLISKO-ZWODU")
    expect(w?.params).toEqual({ odleglosc: 0.3, min: 0.5 })
    expect(w?.message).toBeUndefined()
  })
})
