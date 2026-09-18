import { describe, expect, it } from "vitest"
import { calculateOptymalizacjaTrasyKabla } from "../calculator"

const BAZA = {
  pradA: 20,
  napiecieV: 48,
  material: "Cu" as const,
  sposobUlozenia: "swobodnie" as const,
  temperaturaOtoczeniaC: 30,
  liczbaKabliWWiazce: 1,
  dopuszczalnySpadekNapieciaPct: 5,
  cenaEnergiiZlZaKwh: 1.0,
  liczbaLat: 10,
}

describe("calculateOptymalizacjaTrasyKabla", () => {
  it("porównanie dwóch tras — TCO liczony z echa dobor-przekroju-kabla (podwójna weryfikacja ręczna)", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      trasaA: { dlugoscTrasyM: 15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 300 },
    })
    expect(result.status).toBe("VALID")
    // R_A = 0,0175*2*15/16 = 0,0328125 Ω ; strata = 20²*R*8760/1000
    expect(result.value.strataRocznaAKwh).toBeCloseTo(114.975, 2)
    // R_B = 0,0175*2*25/10 = 0,0875 Ω
    expect(result.value.strataRocznaBKwh).toBeCloseTo(306.6, 1)
    expect(result.value.tcoAZl).toBeCloseTo(1549.75, 2)
    expect(result.value.tcoBZl).toBeCloseTo(3366, 1)
    const porownanie = result.warnings.find((w) => w.code === "POROWNANIE-KOSZTOW")
    expect(porownanie?.i18nKey).toBe("POROWNANIE-KOSZTOW-TRAS")
    expect(porownanie?.params?.tansza).toBe("A")
    expect(porownanie?.message).toBeUndefined()
  })

  it("KRYTYCZNE — trasa B ma przekrój niewystarczający na obciążalność: TCO NIE pokazywany (nie fałszywie 'tańszy')", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      pradA: 70,
      trasaA: { dlugoscTrasyM: 15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 300 },
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const etykieta = result.warnings.find((w) => w.code === "TRASA-B-NIE-SPELNIA-WYMAGAN")
    expect(etykieta?.i18nKey).toBe("TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU")
    expect(etykieta?.params).toEqual({ oznaczenie: "B" })
    expect(etykieta?.message).toBeUndefined()
    // szczegółowa przyczyna z echa dobor-przekroju-kabla dochodzi obok etykiety, z zachowanym i18nKey.
    const szczegol = result.warnings.find((w) => w.field === "trasaB")
    expect(szczegol?.i18nKey).toBe("PRZEKROJ-PONIZEJ-WYLICZONEGO-MINIMUM")
    expect(szczegol?.message).toBeUndefined()
    expect(result.warnings.some((w) => w.code === "POROWNANIE-KOSZTOW")).toBe(false)
    expect(result.value.tcoAZl).toBe(0)
    expect(result.value.tcoBZl).toBe(0)
  })

  it("i18n (17.2): assumptions to obiekty {kod}, nie string", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      trasaA: { dlugoscTrasyM: 15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 300 },
    })
    expect(result.assumptions).toEqual([
      { kod: "STRATY-ROCZNE-LICZONE-PRZEZ-ECHO" },
      { kod: "KOSZT-ZAKUPU-JEDNA-SUMA-NA-TRASE" },
    ])
  })

  it("OUT_OF_SCOPE — temperatura poza zakresem tabel normy", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      temperaturaOtoczeniaC: 999,
      trasaA: { dlugoscTrasyM: 15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 300 },
    })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("INCOMPLETE — koszt trasy B niepodany", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      trasaA: { dlugoscTrasyM: 15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 0 },
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna długość trasy A", () => {
    const result = calculateOptymalizacjaTrasyKabla({
      ...BAZA,
      trasaA: { dlugoscTrasyM: -15, przekrojMm2: 16, kosztZakupuZl: 400 },
      trasaB: { dlugoscTrasyM: 25, przekrojMm2: 10, kosztZakupuZl: 300 },
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
