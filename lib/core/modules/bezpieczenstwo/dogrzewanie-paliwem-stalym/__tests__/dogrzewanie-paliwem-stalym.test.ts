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

  it("i18n (17.2): błąd walidacji zwraca i18nKey bez params, nie message", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: -10,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
    expect(result.warnings[0].params).toBeUndefined()
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): za mała odległość zwraca i18nKey/params, nie message", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 30,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    const w = result.warnings.find((x) => x.code === "ZA-MALA-ODLEGLOSC")
    expect(w?.i18nKey).toBe("ZA-MALA-ODLEGLOSC")
    expect(w?.params).toEqual({ odleglosc: "30", min: 40 })
    expect(w?.message).toBeUndefined()
  })

  it("i18n (17.2): odległość OK zwraca i18nKey/params, nie message", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    const w = result.warnings.find((x) => x.code === "ODLEGLOSC-OK")
    expect(w?.i18nKey).toBe("ODLEGLOSC-OK")
    expect(w?.params).toEqual({ odleglosc: "50", min: 40 })
    expect(w?.message).toBeUndefined()
  })

  it("i18n (17.2): brak nawiewu/czujnika i ich obecność zwracają i18nKey bez params, nie message", () => {
    const result = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: false,
      maCzujnikCo: false,
    })
    const nawiew = result.warnings.find((x) => x.code === "BRAK-NAWIEWU")
    const czujnik = result.warnings.find((x) => x.code === "BRAK-CZUJNIKA-CO")
    expect(nawiew?.i18nKey).toBe("BRAK-NAWIEWU")
    expect(nawiew?.message).toBeUndefined()
    expect(czujnik?.i18nKey).toBe("BRAK-CZUJNIKA-CO")
    expect(czujnik?.message).toBeUndefined()

    const result2 = calculateDogrzewaniePaliwemStalym({
      typPaliwa: "drewno",
      odlegloscOdMaterialowPalnychCm: 50,
      maNawiewPowietrzaDoSpalania: true,
      maCzujnikCo: true,
    })
    const nawiewOk = result2.warnings.find((x) => x.code === "NAWIEW-OBECNY")
    const czujnikOk = result2.warnings.find((x) => x.code === "CZUJNIK-CO-OBECNY")
    expect(nawiewOk?.i18nKey).toBe("NAWIEW-OBECNY")
    expect(nawiewOk?.message).toBeUndefined()
    expect(czujnikOk?.i18nKey).toBe("CZUJNIK-CO-OBECNY")
    expect(czujnikOk?.message).toBeUndefined()
  })
})
