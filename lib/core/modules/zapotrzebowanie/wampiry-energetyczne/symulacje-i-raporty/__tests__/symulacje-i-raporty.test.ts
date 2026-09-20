import { describe, expect, it } from "vitest"
import { calculateAutonomiaStandby, calculateKosztRocznyStandby, calculateWplywNaDobor } from "../calculator"

describe("Wampiry energetyczne — Symulacje i raporty: autonomia (dawne 1.28+1.31+1.42)", () => {
  it("przykład źródła 1.31: 45 W → 26 h, 15 W (po redukcji) → 78 h — energia dostępna 1170 Wh", () => {
    // 1170 Wh = 1,17 kWh użytecznej × 100% DoD
    const result = calculateAutonomiaStandby({
      standbyW: 45,
      standbyZredukowanyW: 15,
      pojemnoscUzytecznaKwh: 1.17,
      dodPct: 100,
    })

    expect(result.status).toBe("VALID")
    expect(result.value.godzinyDoWyczerpania).toBeCloseTo(26, 5)
    expect(result.value.godzinyDoWyczerpaniaZredukowany).toBeCloseTo(78, 5)
  })

  it("graniczny: bez drugiego scenariusza (standbyZredukowanyW=0) → null", () => {
    const result = calculateAutonomiaStandby({
      standbyW: 35,
      standbyZredukowanyW: 0,
      pojemnoscUzytecznaKwh: 1.2,
      dodPct: 80,
    })
    expect(result.value.godzinyDoWyczerpaniaZredukowany).toBeNull()
  })

  it("błędne dane: DoD poza zakresem → INVALID_INPUT", () => {
    const result = calculateAutonomiaStandby({
      standbyW: 45,
      standbyZredukowanyW: 0,
      pojemnoscUzytecznaKwh: 1,
      dodPct: 150,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych → INCOMPLETE", () => {
    const result = calculateAutonomiaStandby({
      standbyW: 0,
      standbyZredukowanyW: 0,
      pojemnoscUzytecznaKwh: 0,
      dodPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })
})

describe("Wampiry energetyczne — Symulacje i raporty: roczny koszt (dawne 1.43)", () => {
  it("przykład źródła: 50 W ciągłego poboru → 438 kWh/rok, 15% udziału przy zapotrzebowaniu 2920 kWh/rok", () => {
    const result = calculateKosztRocznyStandby({
      standbyW: 50,
      cenaEnergiiZlZaKwh: 350 / 438,
      zapotrzebowanieCalkowiteRocznaKwh: 2920,
    })

    expect(result.status).toBe("VALID")
    expect(result.value.energiaRocznaKwh).toBeCloseTo(438, 1)
    expect(result.value.kosztRocznyZl).toBeCloseTo(350, 1)
    expect(result.value.udzialProcentowy).toBeCloseTo(15, 5)
  })

  it("bez podania całkowitego zużycia → udzialProcentowy = null", () => {
    const result = calculateKosztRocznyStandby({
      standbyW: 45,
      cenaEnergiiZlZaKwh: 0.8,
      zapotrzebowanieCalkowiteRocznaKwh: 0,
    })
    expect(result.value.udzialProcentowy).toBeNull()
    expect(result.status).toBe("VALID")
  })

  it("brak ceny energii → INCOMPLETE", () => {
    const result = calculateKosztRocznyStandby({ standbyW: 45, cenaEnergiiZlZaKwh: 0, zapotrzebowanieCalkowiteRocznaKwh: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })
})

describe("Wampiry energetyczne — Symulacje i raporty: wpływ na dobór systemu (dawne 1.45)", () => {
  it("nominalny: echo wzoru z dobor-pojemnosci zastosowany do redukcji standby", () => {
    const result = calculateWplywNaDobor({
      standbyDobowaKwh: 0.7,
      eliminacjaPct: 80,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })

    expect(result.status).toBe("VALID")
    // redukcjaDobowaKwh = 0.7*0.8 = 0.56
    expect(result.value.redukcjaDobowaKwh).toBeCloseTo(0.56, 5)
    // redukcjaPojemnosciKwh = 0.56*3/(0.95*0.8) = 2.2105...
    expect(result.value.redukcjaPojemnosciKwh).toBeCloseTo((0.56 * 3) / (0.95 * 0.8), 5)
  })

  it("brak eliminacji (0%) → INCOMPLETE", () => {
    const result = calculateWplywNaDobor({
      standbyDobowaKwh: 0.7,
      eliminacjaPct: 0,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("błędne dane: eliminacjaPct poza zakresem → INVALID_INPUT", () => {
    const result = calculateWplywNaDobor({
      standbyDobowaKwh: 0.7,
      eliminacjaPct: 150,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n: warnings mają i18nKey, nie gotowy tekst PL", () => {
    const result = calculateWplywNaDobor({
      standbyDobowaKwh: 0.7,
      eliminacjaPct: 150,
      dniAutonomii: 3,
      sprawnoscFalownikaPct: 95,
      dodPct: 80,
    })
    expect(result.warnings[0].i18nKey).toBe("WAMPIR-ELIMINACJA-POZA-ZAKRESEM")
    expect(result.warnings[0].message).toBeUndefined()
  })
})
