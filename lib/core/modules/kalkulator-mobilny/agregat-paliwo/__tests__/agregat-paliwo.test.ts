import { describe, expect, it } from "vitest"
import { calculateAgregatPaliwo } from "../calculator"

const BAZA = {
  miejsceAgregatu: null,
  podlaczenieAgregatu: null,
  mocAgregatuKw: 2,
  obciazeniePct: 50,
  zuzycieLH: 0.5,
  godzinNaDobe: 3,
  cenaZlL: 6.5,
  kosztPorownawczyZlKwh: 0,
}

describe("calculateAgregatPaliwo (M12/E35, dawne 8.62)", () => {
  it("przykład Biblii §12.50: 2 kW, 50%, 0,5 l/h, 3 h → 1,5 l; przy 6,5 zł/l 9,75 zł; 3 kWh; 3,25 zł/kWh", () => {
    const w = calculateAgregatPaliwo(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.litrowNaDobe).toBeCloseTo(1.5, 12)
    expect(w.value.kosztNaDobeZl).toBeCloseTo(9.75, 12)
    expect(w.value.energiaNaDobeKwh).toBeCloseTo(3, 12)
    expect(w.value.kosztKwhZl).toBeCloseTo(3.25, 12)
    expect(w.warnings.map((x) => x.code)).toContain("AP-DROGIE-PALIWO")
  })

  it("porównanie z 1,30 zł/kWh → 2,5 razy drożej", () => {
    expect(calculateAgregatPaliwo({ ...BAZA, kosztPorownawczyZlKwh: 1.3 }).value.krotnoscPorownania).toBeCloseTo(2.5, 12)
  })

  it("agregat w budynku → 🔴 AGREGAT-W-BUDYNKU-CZAD, także przy niepełnych danych", () => {
    const pelne = calculateAgregatPaliwo({ ...BAZA, miejsceAgregatu: "wewnatrz-budynku" })
    expect(pelne.status).toBe("VALID_WITH_WARNINGS")
    expect(pelne.warnings.some((x) => x.code === "AGREGAT-W-BUDYNKU-CZAD" && x.level === "critical")).toBe(true)
    const niepelne = calculateAgregatPaliwo({ ...BAZA, zuzycieLH: 0, miejsceAgregatu: "wewnatrz-budynku" })
    expect(niepelne.status).toBe("INCOMPLETE")
    expect(niepelne.warnings.some((x) => x.code === "AGREGAT-W-BUDYNKU-CZAD")).toBe(true)
  })

  it("brak danych bez odpowiedzi bezpieczeństwa → INCOMPLETE bez ostrzeżeń", () => {
    const w = calculateAgregatPaliwo({ ...BAZA, cenaZlL: 0 })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.warnings).toEqual([])
  })

  it("ponad 24 h na dobę i obciążenie 120% → INVALID_INPUT", () => {
    const w = calculateAgregatPaliwo({ ...BAZA, godzinNaDobe: 25, obciazeniePct: 120 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.code).sort()).toEqual(["AP-PONAD-DOBE", "M12-PROCENT-POZA-ZAKRESEM"])
  })
})
