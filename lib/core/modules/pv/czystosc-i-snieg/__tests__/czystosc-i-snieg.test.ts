import { describe, expect, it } from "vitest"
import { classifyKatSamooczyszczania, ocenHarmonogramCzyszczenia } from "../calculator"

describe("classifyKatSamooczyszczania", () => {
  it("kąt 5° -> zaleganie", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 5 })
    expect(result.status).toBe("VALID")
    expect(result.value.band).toBe("zaleganie")
  })

  it("kąt 12° -> zakres przejściowy, VALID_WITH_WARNINGS (luka źródła zgłoszona, nie ukryta)", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 12 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.band).toBe("przejsciowy")
  })

  it("kąt 20° -> spłukiwanie deszczem", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 20 })
    expect(result.value.band).toBe("splukiwanie")
  })

  it("przypadek graniczny: dokładnie 30° -> jeszcze spłukiwanie (włącznie)", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 30 })
    expect(result.value.band).toBe("splukiwanie")
  })

  it("kąt 45° -> zsuwanie się śniegu/liści", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 45 })
    expect(result.value.band).toBe("zsuwanie")
  })

  it("błędne dane: kąt -10 -> INVALID_INPUT", () => {
    const result = classifyKatSamooczyszczania({ katStopni: -10 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("błędne dane: kąt 100 (poza 0-90) -> INVALID_INPUT", () => {
    const result = classifyKatSamooczyszczania({ katStopni: 100 })
    expect(result.status).toBe("INVALID_INPUT")
  })
})

describe("ocenHarmonogramCzyszczenia", () => {
  it("spadek poniżej progu -> brak rekomendacji mycia", () => {
    const result = ocenHarmonogramCzyszczenia({ spadekProdukcjiPct: 3, deszczWCiaguKilkuDni: false })
    expect(result.status).toBe("VALID")
    expect(result.value.rekomendacjaMycia).toBe(false)
  })

  it("spadek powyżej progu, brak deszczu -> rekomendacja mycia", () => {
    const result = ocenHarmonogramCzyszczenia({ spadekProdukcjiPct: 12, deszczWCiaguKilkuDni: false })
    expect(result.value.rekomendacjaMycia).toBe(true)
  })

  it("spadek powyżej progu, ale nadchodzi deszcz -> rekomendacja odroczona", () => {
    const result = ocenHarmonogramCzyszczenia({ spadekProdukcjiPct: 12, deszczWCiaguKilkuDni: true })
    expect(result.value.rekomendacjaMycia).toBe(false)
    expect(result.value.powod).toContain("deszcz")
  })

  it("przypadek graniczny: dokładnie na progu (7.5%) -> jeszcze brak rekomendacji (> nie >=)", () => {
    const result = ocenHarmonogramCzyszczenia({ spadekProdukcjiPct: 7.5, deszczWCiaguKilkuDni: false })
    expect(result.value.rekomendacjaMycia).toBe(false)
  })

  it("błędne dane: spadek -5% -> INVALID_INPUT", () => {
    const result = ocenHarmonogramCzyszczenia({ spadekProdukcjiPct: -5, deszczWCiaguKilkuDni: false })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
