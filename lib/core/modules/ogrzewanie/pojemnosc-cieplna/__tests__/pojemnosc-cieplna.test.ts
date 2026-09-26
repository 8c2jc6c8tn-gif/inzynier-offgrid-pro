import { describe, expect, it } from "vitest"
import { calculatePojemnoscCieplna } from "../calculator"
import type { PojemnoscCieplnaInput } from "../input"

// Stropy 100 m² × 20 cm, ρ 2000, c 1000 → 40 000 kg·1000 J/(kg·K); air 300 m³ (values checked in Python).
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
  it("C = Σ ρ·A·d·c + powietrze, τ = C/H, θ∞ ze średniej ważonej H", () => {
    const w = calculatePojemnoscCieplna(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    const v = w.value!
    expect(v.pojemnoscKwhK).toBeCloseTo(11.211611111111111, 12)
    expect(v.pojemnoscPowietrzaKwhK).toBeCloseTo(0.1005, 12)
    expect(v.warstwy[0]!.udzialPct).toBeCloseTo(99.10360786684438, 9)
    expect(v.hWK).toBe(250)
    expect(v.temperaturaRownowagiC).toBeCloseTo(-14, 12)
    expect(v.stalaCzasowaH).toBeCloseTo(44.846444444444444, 9)
  })

  it("wychładzanie wykładnicze: pierwszy 1 °C, czas do granicy, przebieg", () => {
    const v = calculatePojemnoscCieplna(BAZA).value!
    expect(v.czasPierwszegoStopniaH).toBeCloseTo(1.338799253394222, 9)
    expect(v.czasDoGranicyH).toBeCloseTo(26.097112259036162, 9)
    expect(v.przebieg.map((p) => p.godzina)).toEqual([6, 12, 24, 48, 72])
    expect(v.przebieg[2]!.temperaturaC).toBeCloseTo(5.909580382438548, 9)
    expect(v.przebieg[4]!.temperaturaC).toBeCloseTo(-7.173022264605247, 9)
  })

  it("🟡 decyzja właściciela: ostrzeżenie o zawyżonej pojemności zawsze przy wyniku", () => {
    const w = calculatePojemnoscCieplna(BAZA)
    expect(w.warnings.find((x) => x.code === "POJC-CALA-MASA-ZAWYZA")?.level).toBe("warning")
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
    expect(v.pojemnoscKwhK).toBeCloseTo(40000000 / 3600 / 1000, 12)
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
  })

  it("założenia jako kody i18n", () => {
    const kody = calculatePojemnoscCieplna(BAZA).assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    expect(kody).toEqual(["POJC-ZALOZENIE-JEDEN-WEZEL", "POJC-ZALOZENIE-BEZ-ZYSKOW", "POJC-ZALOZENIE-STALA-TEMP-ZEWN"])
  })
})
