import { describe, expect, it } from "vitest"
import { calculateOplacalnoscMagazynu } from "../calculator"

describe("calculateOplacalnoscMagazynu", () => {
  it("VALID — bez porównania z alternatywą, sam koszt za kWh", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: 25000,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 98,
      kosztAlternatywyZlZaKwh: null,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.energiaCalkowitaZyciaKwh).toBeCloseTo(73500, 6)
    expect(result.value.kosztZaKwh).toBeCloseTo(0.3401360544217687, 10)
    expect(result.value.tansze).toBeNull()
  })

  it("VALID_WITH_WARNINGS (info) — magazyn tańszy niż alternatywa", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: 25000,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 98,
      kosztAlternatywyZlZaKwh: 3.4,
    })
    expect(result.value.tansze).toBe(true)
    expect(result.warnings.some((w) => w.code === "TANSZE-NIZ-ALTERNATYWA")).toBe(true)
  })

  it("VALID_WITH_WARNINGS — magazyn droższy niż alternatywa", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: 25000,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 98,
      kosztAlternatywyZlZaKwh: 0.1,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.tansze).toBe(false)
    const w = result.warnings.find((w) => w.code === "DROZSZE-NIZ-ALTERNATYWA")
    expect(w?.level).toBe("warning")
  })

  it("INCOMPLETE — pola liczbowe jeszcze nie wpisane (0)", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: 0,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 98,
      kosztAlternatywyZlZaKwh: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna cena baterii", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: -100,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 98,
      kosztAlternatywyZlZaKwh: null,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — sprawność poza zakresem [0,100]", () => {
    const result = calculateOplacalnoscMagazynu({
      cenaBateriiZl: 25000,
      pojemnoscUzytecznaKwh: 15,
      liczbaCykli: 5000,
      sprawnoscPct: 150,
      kosztAlternatywyZlZaKwh: null,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
