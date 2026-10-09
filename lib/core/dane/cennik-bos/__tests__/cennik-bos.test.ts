import { describe, expect, it } from "vitest"
import { CENNIK_BOS, VAT_OSPRZETU, znajdzPozycjeBos } from "../index"

describe("cennik BOS", () => {
  it("id unikalne, zakres min ≤ max, ceny dodatnie", () => {
    expect(new Set(CENNIK_BOS.map((p) => p.id)).size).toBe(CENNIK_BOS.length)
    for (const p of CENNIK_BOS) {
      expect(p.nettoMinZl, p.id).toBeGreaterThan(0)
      expect(p.nettoMinZl, p.id).toBeLessThanOrEqual(p.nettoMaxZl)
    }
  })

  it("wartości zgodne z zaakceptowaną tabelą (pkt 4 notatki źródłowej)", () => {
    expect(znajdzPozycjeBos("kabel-pv")).toMatchObject({ nettoMinZl: 3.89, nettoMaxZl: 4.6 })
    expect(znajdzPozycjeBos("rozlacznik-dc")).toMatchObject({ nettoMinZl: 31.71, nettoMaxZl: 216 })
    expect(znajdzPozycjeBos("konstrukcja")).toMatchObject({ nettoMinZl: 167, nettoMaxZl: 225, pewnosc: "bardzo-orientacyjna" })
    expect(VAT_OSPRZETU).toBe(0.23)
  })

  it("brutto ze strony źródłowej zgadza się z netto × 1,23 (kabel 6 mm²: 4,99 zł brutto = 4,06 zł netto)", () => {
    expect(4.06 * (1 + VAT_OSPRZETU)).toBeCloseTo(4.99, 2)
  })
})
