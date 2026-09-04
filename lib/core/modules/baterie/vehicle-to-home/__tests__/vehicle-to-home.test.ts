import { describe, expect, it } from "vitest"
import { calculateVehicleToHome } from "../calculator"

describe("calculateVehicleToHome", () => {
  it("VALID — wspiera V2H, wartości self-konsystentne (nie wymuszone dopasowanie do przykładu źródła)", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: true,
      pojemnoscBaterEvKwh: 80,
      rezerwaNaDojazdKwh: 10,
      sprawnoscEfektywnaPct: 60,
      kosztWymianyBateriiZl: 20000,
      liczbaCykli: 1000,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pojemnoscRealnaKwh).toBeCloseTo(42, 9)
    expect(result.value.kosztZaKwh).toBeCloseTo(0.4166666666666667, 9)
    expect(result.warnings).toHaveLength(0)
  })

  it("VALID_WITH_WARNINGS — nie wspiera V2H (tylko V2L)", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: false,
      pojemnoscBaterEvKwh: 80,
      rezerwaNaDojazdKwh: 10,
      sprawnoscEfektywnaPct: 60,
      kosztWymianyBateriiZl: 20000,
      liczbaCykli: 1000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("TYLKO-V2L")
  })

  it("rezerwa=0 (legalna wartość) — cała pojemność (po sprawności) dostępna", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: true,
      pojemnoscBaterEvKwh: 60,
      rezerwaNaDojazdKwh: 0,
      sprawnoscEfektywnaPct: 80,
      kosztWymianyBateriiZl: 15000,
      liczbaCykli: 800,
    })
    expect(result.value.pojemnoscRealnaKwh).toBeCloseTo(48, 9)
  })

  it("INCOMPLETE — sprawność jeszcze nie wpisana", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: true,
      pojemnoscBaterEvKwh: 80,
      rezerwaNaDojazdKwh: 10,
      sprawnoscEfektywnaPct: 0,
      kosztWymianyBateriiZl: 20000,
      liczbaCykli: 1000,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — rezerwa większa niż cała pojemność", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: true,
      pojemnoscBaterEvKwh: 80,
      rezerwaNaDojazdKwh: 100,
      sprawnoscEfektywnaPct: 60,
      kosztWymianyBateriiZl: 20000,
      liczbaCykli: 1000,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("INVALID_INPUT — sprawność poza zakresem", () => {
    const result = calculateVehicleToHome({
      wspieraV2h: true,
      pojemnoscBaterEvKwh: 80,
      rezerwaNaDojazdKwh: 10,
      sprawnoscEfektywnaPct: 150,
      kosztWymianyBateriiZl: 20000,
      liczbaCykli: 1000,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
