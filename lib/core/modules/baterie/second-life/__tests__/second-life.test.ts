import { describe, expect, it } from "vitest"
import { calculateSecondLife } from "../calculator"

describe("calculateSecondLife", () => {
  it("metoda wieku — 14 lat × 2%/rok daje SoH 72%, zgodne z przykładem źródła (10kWh/6000zł → 833 zł/kWh)", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(result.value.sohSzacowanyPct).toBeCloseTo(72, 6)
    expect(result.value.pojemnoscUzytecznaKwh).toBeCloseTo(7.2, 6)
    expect(result.value.kosztZaKwh).toBeCloseTo(833.3333333333333, 6)
    expect(result.status).toBe("VALID")
  })

  it("metoda przebiegu — 280 000 km × 1%/10 000km daje ten sam SoH 72%", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "przebieg",
      wiekLata: 0,
      przebiegKm: 280000,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(result.value.sohSzacowanyPct).toBeCloseTo(72, 6)
  })

  it("VALID_WITH_WARNINGS (info) — tańsza niż nowa LiFePO4", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: 1200,
    })
    expect(result.value.tansza).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("VALID_WITH_WARNINGS — droższa niż nowa LiFePO4", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 20000,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: 1200,
    })
    expect(result.value.tansza).toBe(false)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
  })

  it("VALID_WITH_WARNINGS (krytyczne) — SoH spada do 0% przy bardzo starej baterii", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "wiek",
      wiekLata: 60,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(result.value.sohSzacowanyPct).toBe(0)
    const w = result.warnings.find((w) => w.code === "SOH-ZEROWY")
    expect(w?.level).toBe("critical")
  })

  it("INCOMPLETE — metoda jeszcze nie wybrana", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "",
      wiekLata: 0,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna cena zakupu", () => {
    const result = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: -100,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia i assumption zwracają i18nKey/params, nie gotowy tekst", () => {
    const wiek = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: 1200,
    })
    expect(wiek.assumptions[0]).toEqual({ kod: "SOH-SZACUNEK-Z-WIEKU", params: { rate: 2 } })
    const tansza = wiek.warnings.find((w) => w.code === "TANSZA-NIZ-NOWA")
    expect(tansza?.i18nKey).toBe("TANSZA-NIZ-NOWA")
    expect(tansza?.message).toBeUndefined()

    const przebieg = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "przebieg",
      wiekLata: 0,
      przebiegKm: 280000,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(przebieg.assumptions[0]).toEqual({ kod: "SOH-SZACUNEK-Z-PRZEBIEGU", params: { rate: 1 } })

    const drozsza = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 20000,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: 1200,
    })
    expect(drozsza.warnings.find((w) => w.code === "DROZSZA-NIZ-NOWA")?.i18nKey).toBe("DROZSZA-NIZ-NOWA")

    const zerowy = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: 6000,
      metodaSzacunku: "wiek",
      wiekLata: 60,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(zerowy.warnings.find((w) => w.code === "SOH-ZEROWY")?.i18nKey).toBe("SOH-ZEROWY")

    const zlaCena = calculateSecondLife({
      pojemnoscDeklarowanaKwh: 10,
      cenaZakupuZl: -100,
      metodaSzacunku: "wiek",
      wiekLata: 14,
      przebiegKm: 0,
      cenaNowejLiFePO4ZlZaKwh: null,
    })
    expect(zlaCena.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
  })
})
