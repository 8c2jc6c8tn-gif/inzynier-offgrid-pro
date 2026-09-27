import { describe, expect, it } from "vitest"
import { calculatePojemnoscCieplna } from "../calculator"
import type { PojemnoscCieplnaInput } from "../input"

// Stropy 100 m² × 20 cm, ρ 2000, c 1000 → 40 000 kg·1000 J/(kg·K); air 300 m³ (values checked in Python).
// Since 27.09.2026 (EN ISO 13786 Zał. A): one surface, dT = min(10, 20, 10) = 10 cm, κ′ with Rsi = 0,13.
const BAZA: PojemnoscCieplnaInput = {
  warstwy: [{ nazwa: "Strop", powierzchniaM2: 100, gruboscCm: 20, gestoscKgM3: 2000, cieploWlasciweJKgK: 1000 }],
  kubaturaM3: 300,
  hZewnetrzneWK: 200,
  stratyDoInnychStref: [{ hWK: 50, temperaturaC: 10 }],
  temperaturaPoczatkowaC: 20,
  temperaturaZewnetrznaC: -20,
  temperaturaGranicznaC: 5,
}

describe("calculatePojemnoscCieplna (M6/E8, dawne 5.8 + 6.11)", () => {
  it("C = Σ A·κ′ (warstwa czynna) + powietrze, τ = C/H, θ∞ ze średniej ważonej H; cała masa osobno", () => {
    const w = calculatePojemnoscCieplna(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    const v = w.value!
    expect(v.pojemnoscKwhK).toBeCloseTo(2.697852009995183, 12)
    expect(v.pojemnoscCalkowitaKwhK).toBeCloseTo(11.211611111111111, 12)
    expect(v.pojemnoscPowietrzaKwhK).toBeCloseTo(0.1005, 12)
    expect(v.warstwy[0]).toMatchObject({ gruboscCzynnaCm: 10, liczbaStron: 1 })
    expect(v.warstwy[0]!.udzialPct).toBeCloseTo(96.2748141993089, 9)
    expect(v.hWK).toBe(250)
    expect(v.temperaturaRownowagiC).toBeCloseTo(-14, 12)
    expect(v.stalaCzasowaH).toBeCloseTo(10.791408039980732, 9)
  })

  it("EN ISO 13786 Zał. D.1/D.2: beton 2400·1000, dT 100 mm → κ′ = 96,8 kJ/(m²·K) z Rsi 0,13 (tablica: 97)", () => {
    const beton = { nazwa: "Beton", powierzchniaM2: 1, gestoscKgM3: 2400, cieploWlasciweJKgK: 1000 }
    const bez = { ...BAZA, kubaturaM3: null }
    // D.1: jednorodna ściana 200 mm; D.2: beton 200 mm + 100 mm styropianu + powłoka 5 mm → element 305 mm.
    for (const w of [{ ...beton, gruboscCm: 20 }, { ...beton, gruboscCm: 20, gruboscElementuCm: 30.5 }]) {
      const v = calculatePojemnoscCieplna({ ...bez, warstwy: [w] }).value!
      expect(v.warstwy[0]!.gruboscCzynnaCm).toBe(10)
      expect(v.pojemnoscKwhK * 3.6e6).toBeCloseTo(96792.80986887579, 6)
    }
  })

  it("ściana wewnątrz strefy liczy obie powierzchnie; warstwa za izolacją nie pracuje", () => {
    const bez = { ...BAZA, kubaturaM3: null }
    const scianka = { nazwa: "Działowa", powierzchniaM2: 10, gruboscCm: 12, gestoscKgM3: 1800, cieploWlasciweJKgK: 880 }
    const v = calculatePojemnoscCieplna({ ...bez, warstwy: [{ ...scianka, strona: "obie" }] }).value!
    expect(v.warstwy[0]).toMatchObject({ gruboscCzynnaCm: 6, liczbaStron: 2 })
    expect(v.pojemnoscKwhK).toBeCloseTo(0.3927529897708347, 12)
    expect(v.pojemnoscCalkowitaKwhK).toBeCloseTo(0.528, 12)
    const z = calculatePojemnoscCieplna({ ...bez, warstwy: [BAZA.warstwy[0]!, { ...scianka, strona: "za-izolacja" }] }).value!
    expect(z.warstwy[1]).toMatchObject({ gruboscCzynnaCm: 0, pojemnoscKwhK: 0 })
    expect(calculatePojemnoscCieplna({ ...bez, warstwy: [{ ...scianka, strona: "za-izolacja" }] }).status).toBe("INCOMPLETE")
  })

  it("wychładzanie wykładnicze: pierwszy 1 °C, czas do granicy, przebieg", () => {
    const v = calculatePojemnoscCieplna(BAZA).value!
    expect(v.czasPierwszegoStopniaH).toBeCloseTo(0.32215550655071745, 9)
    expect(v.czasDoGranicyH).toBeCloseTo(6.279752844204132, 9)
    expect(v.przebieg.map((p) => p.godzina)).toEqual([6, 12, 24, 48, 72])
    expect(v.przebieg[2]!.temperaturaC).toBeCloseTo(-10.322000457420417, 9)
    expect(v.przebieg[4]!.temperaturaC).toBeCloseTo(-13.956959512812729, 9)
  })

  it("🟡 adnotacja EN ISO 13786 A.1 (Załącznik A, przybliżenie) zawsze przy wyniku", () => {
    const w = calculatePojemnoscCieplna(BAZA)
    expect(w.warnings.find((x) => x.code === "POJC-ZALACZNIK-A-PRZYBLIZENIE")?.level).toBe("warning")
    expect(w.warnings.some((x) => x.code === "POJC-CALA-MASA-ZAWYZA")).toBe(false)
  })

  it("granica poniżej θ∞ nigdy nie zostanie osiągnięta → null + info", () => {
    const w = calculatePojemnoscCieplna({ ...BAZA, temperaturaGranicznaC: -15 })
    expect(w.value!.czasDoGranicyH).toBeNull()
    expect(w.warnings.some((x) => x.code === "POJC-GRANICA-NIEOSIAGALNA")).toBe(true)
    expect(calculatePojemnoscCieplna({ ...BAZA, temperaturaGranicznaC: null }).value!.czasDoGranicyH).toBeNull()
  })

  it("start nie wyżej niż θ∞ → brak wychładzania", () => {
    const w = calculatePojemnoscCieplna({ ...BAZA, temperaturaZewnetrznaC: 25, stratyDoInnychStref: [], temperaturaGranicznaC: null })
    expect(w.value!.czasPierwszegoStopniaH).toBeNull()
    expect(w.warnings.some((x) => x.code === "POJC-BRAK-WYCHLADZANIA")).toBe(true)
  })

  it("bez kubatury powietrze pominięte", () => {
    const v = calculatePojemnoscCieplna({ ...BAZA, kubaturaM3: null }).value!
    expect(v.pojemnoscPowietrzaKwhK).toBe(0)
    expect(v.pojemnoscCalkowitaKwhK).toBeCloseTo(40000000 / 3600 / 1000, 12)
  })

  it("INCOMPLETE: brak H z Ekranu 1, temperatur albo niepełna warstwa", () => {
    expect(calculatePojemnoscCieplna({ ...BAZA, hZewnetrzneWK: null }).status).toBe("INCOMPLETE")
    expect(calculatePojemnoscCieplna({ ...BAZA, temperaturaZewnetrznaC: null }).status).toBe("INCOMPLETE")
    expect(calculatePojemnoscCieplna({ ...BAZA, warstwy: [{ ...BAZA.warstwy[0]!, gestoscKgM3: null }] }).status).toBe("INCOMPLETE")
    expect(calculatePojemnoscCieplna({ ...BAZA, warstwy: [] }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: c w kJ/(kg·K), grubość w mm, granica nad startem", () => {
    const w = calculatePojemnoscCieplna({
      ...BAZA,
      warstwy: [{ ...BAZA.warstwy[0]!, cieploWlasciweJKgK: 0.84, gruboscCm: 200.5 }],
      temperaturaGranicznaC: 20,
    })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.field)).toEqual(["warstwy.0.gruboscCm", "warstwy.0.cieploWlasciweJKgK", "temperaturaGranicznaC"])
    const e = calculatePojemnoscCieplna({ ...BAZA, warstwy: [{ ...BAZA.warstwy[0]!, gruboscElementuCm: 15 }] })
    expect(e.warnings[0]).toMatchObject({ code: "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA", field: "warstwy.0.gruboscElementuCm" })
  })

  it("założenia jako kody i18n", () => {
    const kody = calculatePojemnoscCieplna(BAZA).assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    expect(kody).toEqual(["POJC-ZALOZENIE-JEDEN-WEZEL", "POJC-ZALOZENIE-BEZ-ZYSKOW", "POJC-ZALOZENIE-STALA-TEMP-ZEWN", "POJC-ZALOZENIE-ZALACZNIK-A"])
  })
})
