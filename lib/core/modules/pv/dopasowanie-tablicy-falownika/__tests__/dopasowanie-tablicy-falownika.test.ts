import { describe, expect, it } from "vitest"
import { calculateDopasowanieTablicyFalownika } from "../calculator"

describe("calculateDopasowanieTablicyFalownika", () => {
  it("wszystkie 4 kryteria spełnione -> VALID, same info", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -15,
      liczbaPaneliWStringu: 8,
      vMaxFalownikaV: 500,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 15,
      mocFalownikaAcW: 2200,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.vStringColdV).toBeCloseTo(403.2, 6)
    expect(result.value.vStringStcV).toBe(296)
    expect(result.value.iStringA).toBe(9)
    expect(result.value.mocPvW).toBe(2664)
    expect(result.value.dcAcRatio).toBeCloseTo(1.21090909, 6)
    expect(result.warnings.every((w) => w.level === "info")).toBe(true)
  })

  it("napięcie zimowe przekracza limit falownika -> critical", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 12,
      vMaxFalownikaV: 500,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 15,
      mocFalownikaAcW: 3500,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.vStringColdV).toBeCloseTo(621, 6)
    expect(result.warnings.find((w) => w.code === "NAPIECIE-ZIMOWE-ZA-WYSOKIE")?.level).toBe("critical")
  })

  it("napięcie robocze powyżej okna MPPT -> warning", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 12,
      vMaxFalownikaV: 900,
      mpptMinV: 150,
      mpptMaxV: 400,
      iMaxMpptA: 15,
      mocFalownikaAcW: 3500,
    })
    expect(result.value.vStringStcV).toBe(444)
    expect(result.warnings.find((w) => w.code === "POWYZEJ-OKNA-MPPT")?.level).toBe("warning")
  })

  it("prąd stringu przekracza max MPPT -> critical", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 8,
      vMaxFalownikaV: 900,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 8,
      mocFalownikaAcW: 2200,
    })
    expect(result.warnings.find((w) => w.code === "PRAD-PRZEKROCZONY")?.level).toBe("critical")
  })

  it("przewymiarowanie DC/AC za duże (>1,3) -> warning", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 12,
      vMaxFalownikaV: 900,
      mpptMinV: 150,
      mpptMaxV: 500,
      iMaxMpptA: 15,
      mocFalownikaAcW: 2000,
    })
    expect(result.value.mocPvW).toBe(3996)
    expect(result.value.dcAcRatio).toBeCloseTo(1.998, 6)
    expect(result.warnings.find((w) => w.code === "DC-AC-ZA-DUZE")?.level).toBe("warning")
  })

  it("przewymiarowanie DC/AC za małe (<1,1) -> warning", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 6,
      vMaxFalownikaV: 900,
      mpptMinV: 100,
      mpptMaxV: 500,
      iMaxMpptA: 15,
      mocFalownikaAcW: 2200,
    })
    expect(result.warnings.find((w) => w.code === "DC-AC-ZA-MALE")?.level).toBe("warning")
  })

  it("INCOMPLETE — moc falownika jeszcze nie wpisana", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 8,
      vMaxFalownikaV: 500,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 15,
      mocFalownikaAcW: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — okno MPPT odwrócone (min > max)", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 8,
      vMaxFalownikaV: 500,
      mpptMinV: 450,
      mpptMaxV: 150,
      iMaxMpptA: 15,
      mocFalownikaAcW: 2200,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — ujemne Voc", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: -45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -10,
      liczbaPaneliWStringu: 8,
      vMaxFalownikaV: 500,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 15,
      mocFalownikaAcW: 2200,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): NAPIECIE-ZIMOWE-ZA-WYSOKIE ma i18nKey+params, assumptions to {kod}", () => {
    const result = calculateDopasowanieTablicyFalownika({
      vocStcV: 45,
      vmpStcV: 37,
      impA: 9,
      betaPctNaC: -0.3,
      tminC: -25,
      liczbaPaneliWStringu: 12,
      vMaxFalownikaV: 500,
      mpptMinV: 150,
      mpptMaxV: 450,
      iMaxMpptA: 15,
      mocFalownikaAcW: 3500,
    })
    const w = result.warnings.find((x) => x.code === "NAPIECIE-ZIMOWE-ZA-WYSOKIE")
    expect(w?.i18nKey).toBe("NAPIECIE-ZIMOWE-ZA-WYSOKIE")
    expect(w?.params).toEqual({ vStringCold: "621.0", vMax: "500.0" })
    expect(w?.message).toBeUndefined()
    expect(result.assumptions).toEqual([
      { kod: "ZAKLADA-JEDEN-STRING" },
      { kod: "MOC-PV-WZOR-VMP-IMP" },
      { kod: "KRYTERIUM-4-NIE-SPRAWDZANE" },
    ])
  })
})
