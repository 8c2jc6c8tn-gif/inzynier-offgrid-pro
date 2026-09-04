import { describe, expect, it } from "vitest"
import { calculateDogrzewaniePaliwemStalym } from "../calculator"

describe("calculateDogrzewaniePaliwemStalym", () => {
  it("wszystko w porządku (50cm, nawiew, czujnik CO) -> VALID, margines +10cm", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.marginesOdlegloscCm).toBe(10)
    expect(result.warnings.every((w) => w.level === "info")).toBe(true)
  })

  it("za mała odległość (30cm < 40cm) -> critical", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 30,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.marginesOdlegloscCm).toBe(-10)
    expect(result.warnings.find((w) => w.code === "ZA-MALA-ODLEGLOSC")?.level).toBe("critical")
  })

  it("brak czujnika CO -> critical (zagrożenie życia)", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "pellet",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings.find((w) => w.code === "BRAK-CZUJNIKA-CO")?.level).toBe("critical")
  })

  it("brak nawiewu powietrza do spalania -> critical", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "wegiel",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: false,
      maCzujnikCo: true,
    })
    expect(result.warnings.find((w) => w.code === "BRAK-NAWIEWU")?.level).toBe("critical")
  })

  it("INCOMPLETE — typ paliwa jeszcze nie wybrany", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: null,
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna odległość", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: -10,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
