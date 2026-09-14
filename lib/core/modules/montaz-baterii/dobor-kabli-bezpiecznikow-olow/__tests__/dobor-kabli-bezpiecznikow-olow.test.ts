import { describe, expect, it } from "vitest"
import { calculateDoborKabliBezpiecznikowOlow } from "../calculator"

const BAZA = {
  pradA: 50,
  napiecieV: 12,
  dlugoscTrasyM: 3,
  material: "Cu" as const,
  sposobUlozenia: "swobodnie" as const,
  temperaturaOtoczeniaC: 30,
  liczbaKabliWWiazce: 1,
  dopuszczalnySpadekNapieciaPct: 3,
  sprawdzanyPrzekrojMm2: null,
  pradZwarciowyA: 0,
  aicBezpiecznikaA: 0,
}

describe("calculateDoborKabliBezpiecznikowOlow", () => {
  it("echo dobor-przekroju-kabla + dobor-bezpiecznika-rozlacznika — podwójna weryfikacja ręczna", () => {
    const result = calculateDoborKabliBezpiecznikowOlow(BAZA)
    // R(16mm²) = 0,0175*2*3/16 = 0,0065625 Ω ; spadek% = 50*R/12*100 ≈ 2,73% <= 3% ; obc.=85A>=50A
    expect(result.value.przekrojMm2).toBe(16)
    expect(result.value.spadekNapieciaPct).toBeCloseTo(2.734, 2)
    // bezpiecznik = 1,25 * 50 = 62,5 A
    expect(result.value.pradBezpiecznikaZalecanyA).toBeCloseTo(62.5, 5)
    expect(result.value.aicWystarczajace).toBeNull()
  })

  it("KRYTYCZNE — AIC bezpiecznika poniżej prądu zwarciowego zestawu kwasowego", () => {
    const result = calculateDoborKabliBezpiecznikowOlow({ ...BAZA, pradZwarciowyA: 200, aicBezpiecznikaA: 100 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings.some((w) => w.code === "AIC-PONIZEJ-PRADU-ZWARCIOWEGO")).toBe(true)
  })

  it("AIC wystarczające", () => {
    const result = calculateDoborKabliBezpiecznikowOlow({ ...BAZA, pradZwarciowyA: 200, aicBezpiecznikaA: 500 })
    expect(result.value.aicWystarczajace).toBe(true)
  })

  it("INCOMPLETE — prąd niepodany", () => {
    const result = calculateDoborKabliBezpiecznikowOlow({ ...BAZA, pradA: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna długość trasy", () => {
    const result = calculateDoborKabliBezpiecznikowOlow({ ...BAZA, dlugoscTrasyM: -3 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
