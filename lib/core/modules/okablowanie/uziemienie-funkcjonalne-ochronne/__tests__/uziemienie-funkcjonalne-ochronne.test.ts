import { describe, expect, it } from "vitest"
import { calculateUziemienieFunkcjonalneOchronne } from "../calculator"

describe("calculateUziemienieFunkcjonalneOchronne", () => {
  it("wszystko OK -> VALID, info", () => {
    const result = calculateUziemienieFunkcjonalneOchronne({
      ukladSieci: "TN-S",
      falownikWymagaUkladuIt: false,
      biegunDcUziemiony: true,
      obudowaPolaczonaZGsw: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("UZIEMIENIE-OK")
  })

  it("KRYTYCZNE — biegun DC uziemiony wbrew wymaganiom układu IT", () => {
    const result = calculateUziemienieFunkcjonalneOchronne({
      ukladSieci: "IT",
      falownikWymagaUkladuIt: true,
      biegunDcUziemiony: true,
      obudowaPolaczonaZGsw: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings.some((w) => w.code === "BIEGUN-UZIEMIONY-WBREW-IT")).toBe(true)
  })

  it("Falownik IT, biegun nieuziemiony -> ostrzeżenie o monitorze izolacji (nie krytyczne)", () => {
    const result = calculateUziemienieFunkcjonalneOchronne({
      ukladSieci: "IT",
      falownikWymagaUkladuIt: true,
      biegunDcUziemiony: false,
      obudowaPolaczonaZGsw: true,
    })
    expect(result.warnings.some((w) => w.code === "WYMAGANY-MONITOR-IZOLACJI")).toBe(true)
    expect(result.warnings.some((w) => w.level === "critical")).toBe(false)
  })

  it("KRYTYCZNE — obudowa niepołączona z GSW", () => {
    const result = calculateUziemienieFunkcjonalneOchronne({
      ukladSieci: "TN-S",
      falownikWymagaUkladuIt: false,
      biegunDcUziemiony: true,
      obudowaPolaczonaZGsw: false,
    })
    expect(result.warnings.some((w) => w.code === "OBUDOWA-NIEPOLACZONA-Z-GSW")).toBe(true)
  })
})
