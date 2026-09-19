import { describe, expect, it } from "vitest"
import { calculateWylacznikiNadpradoweDc } from "../calculator"

describe("calculateWylacznikiNadpradoweDc", () => {
  it("certyfikowany do DC, AIC niesprawdzane -> VALID", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: 16,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 0,
      pradZwarciowyA: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("DOBRANY-POPRAWNIE")
  })

  it("KRYTYCZNE — wyłącznik niecertyfikowany do DC (AC w obwodzie DC)", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: 16,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: false,
      aicA: 0,
      pradZwarciowyA: 0,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings.some((w) => w.code === "WYLACZNIK-NIECERTYFIKOWANY-DO-DC")).toBe(true)
  })

  it("KRYTYCZNE — AIC poniżej prądu zwarciowego (przykład źródła: MCCB 20kA vs 4800A OK, tu odwrotny przypadek)", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: 125,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 2000,
      pradZwarciowyA: 4800,
    })
    expect(result.warnings.some((w) => w.code === "AIC-PONIZEJ-PRADU-ZWARCIOWEGO")).toBe(true)
  })

  it("AIC wystarczające (20000A >= 4800A) -> VALID", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: 125,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 20000,
      pradZwarciowyA: 4800,
    })
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — brak prądu i napięcia", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: 0,
      napiecieV: 0,
      liczbaBiegunow: 0,
      certyfikowanyDoDc: false,
      aicA: 0,
      pradZwarciowyA: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny prąd", () => {
    const result = calculateWylacznikiNadpradoweDc({
      pradA: -5,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 0,
      pradZwarciowyA: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): DOBRANY-POPRAWNIE/AIC-PONIZEJ-PRADU-ZWARCIOWEGO mają i18nKey, założenie to {kod}", () => {
    const ok = calculateWylacznikiNadpradoweDc({
      pradA: 16,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 0,
      pradZwarciowyA: 0,
    })
    expect(ok.warnings[0].i18nKey).toBe("WYLACZNIK-DC-DOBRANY-POPRAWNIE")
    expect(ok.warnings[0].message).toBeUndefined()
    expect(ok.assumptions).toEqual([{ kod: "AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA" }])

    const aicPoniewaz = calculateWylacznikiNadpradoweDc({
      pradA: 125,
      napiecieV: 48,
      liczbaBiegunow: 2,
      certyfikowanyDoDc: true,
      aicA: 2000,
      pradZwarciowyA: 4800,
    })
    const w = aicPoniewaz.warnings.find((x) => x.code === "AIC-PONIZEJ-PRADU-ZWARCIOWEGO")
    expect(w?.i18nKey).toBe("AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO")
    expect(w?.params).toEqual({ aic: 2000, pradZwarciowy: 4800 })
    expect(w?.message).toBeUndefined()
  })
})
