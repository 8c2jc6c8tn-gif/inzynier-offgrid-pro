import { describe, expect, it } from "vitest"
import { calculateStarzenieDegradacja } from "../calculator"

describe("calculateStarzenieDegradacja", () => {
  it("przykład ze źródła: 45 kWh dziś, 10 lat, 2%/rok -> 56,25 kWh (źródło zaokrągla do 56 kWh, zweryfikowane niezależnie w Pythonie)", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 45,
      horyzontLata: 10,
      degradacjaRocznaPct: 2,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pojemnoscPoczatkowaKwh).toBeCloseTo(56.25, 9)
    expect(result.value.ulamekPozostalyPoHoryzoncie).toBeCloseTo(0.8, 9)
  })

  it("100 kWh dziś, 5 lat, 3%/rok -> 117,647... kWh", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 100,
      horyzontLata: 5,
      degradacjaRocznaPct: 3,
    })
    expect(result.value.pojemnoscPoczatkowaKwh).toBeCloseTo(117.64705882352942, 9)
  })

  it("20 kWh dziś, 5 lat, 2%/rok -> 22,222... kWh", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 20,
      horyzontLata: 5,
      degradacjaRocznaPct: 2,
    })
    expect(result.value.pojemnoscPoczatkowaKwh).toBeCloseTo(22.22222222222222, 9)
  })

  it("degradacja × horyzont >= 100% -> status INVALID_INPUT (model liniowy się załamuje)", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 45,
      horyzontLata: 15,
      degradacjaRocznaPct: 7,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("pojemność ujemna -> status INVALID_INPUT", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: -1,
      horyzontLata: 10,
      degradacjaRocznaPct: 2,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (0) -> status INCOMPLETE", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 0,
      horyzontLata: 10,
      degradacjaRocznaPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): assumptions i błędy walidacji zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 45,
      horyzontLata: 10,
      degradacjaRocznaPct: 2,
    })
    expect(result.assumptions).toEqual([
      { kod: "MODEL-LINIOWY-DEGRADACJI" },
      { kod: "WYNIK-DOKLADNY-BEZ-ZAOKRAGLENIA" },
    ])

    const przekroczona = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: 45,
      horyzontLata: 15,
      degradacjaRocznaPct: 7,
    })
    const w = przekroczona.warnings.find((w) => w.code === "CALKOWITA-DEGRADACJA-W-HORYZONCIE")
    expect(w?.i18nKey).toBe("CALKOWITA-DEGRADACJA-W-HORYZONCIE")
    expect(w?.params).toEqual({ rate: 7, lata: 15 })
    expect(w?.message).toBeUndefined()

    const ujemna = calculateStarzenieDegradacja({
      pojemnoscUzytecznaDzisKwh: -1,
      horyzontLata: 10,
      degradacjaRocznaPct: 2,
    })
    expect(ujemna.warnings[0].i18nKey).toBe("POJEMNOSC-DZIS-NIEDODATNIA")
  })
})
