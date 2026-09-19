import { describe, expect, it } from "vitest"
import { calculatePaneleBifacjalne } from "../calculator"

describe("calculatePaneleBifacjalne", () => {
  it("przykład źródła: jasny beton, 12% (w zakresie 8-15%) -> zysk dokładnie 12%, info", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: 5000,
      typPowierzchni: "jasny_beton",
      dodatkowyUzyskPct: 12,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.dodatkowyUzyskKwh).toBe(600)
    expect(result.value.calkowityUzyskKwh).toBe(5600)
    expect(result.warnings[0].code).toBe("DOBRA-POWIERZCHNIA")
    expect(result.warnings[0].level).toBe("info")
  })

  it("trawa -> ostrzeżenie o niskim zysku (warning)", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: 5000,
      typPowierzchni: "trawa",
      dodatkowyUzyskPct: 4,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.dodatkowyUzyskKwh).toBe(200)
    expect(result.warnings[0].code).toBe("TRAWA-NISKI-ZYSK")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("biała membrana, 20% (górna granica zakresu) -> info", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: 4000,
      typPowierzchni: "biala_membrana",
      dodatkowyUzyskPct: 20,
    })
    expect(result.value.dodatkowyUzyskKwh).toBe(800)
    expect(result.value.calkowityUzyskKwh).toBe(4800)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — typ powierzchni jeszcze nie wybrany", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: 5000,
      typPowierzchni: null,
      dodatkowyUzyskPct: 12,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc bazowa", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: -5000,
      typPowierzchni: "piasek",
      dodatkowyUzyskPct: 10,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): DOBRA-POWIERZCHNIA ma i18nKey+params, assumption to {kod}", () => {
    const result = calculatePaneleBifacjalne({
      mocRocznaBazowaKwh: 5000,
      typPowierzchni: "jasny_beton",
      dodatkowyUzyskPct: 12,
    })
    expect(result.warnings[0].i18nKey).toBe("DOBRA-POWIERZCHNIA")
    expect(result.warnings[0].params).toEqual({ dodatkowyUzysk: "600" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "PROCENT-UZYSKU-RECZNIE" }])
  })
})
