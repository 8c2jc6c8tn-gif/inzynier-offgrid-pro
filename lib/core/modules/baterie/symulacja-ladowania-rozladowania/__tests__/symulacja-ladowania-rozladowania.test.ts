import { describe, expect, it } from "vitest"
import { calculateSymulacjaLadowania } from "../calculator"

describe("calculateSymulacjaLadowania", () => {
  it("nominalny: ładuje się do pełna w oknie dnia i przetrwa noc", () => {
    // 10 kWh, start 50%, ładowanie 2kW przez 8h dnia -> energia do pełna = 5 kWh, t=2.5h <= 8h.
    // Rozładowanie 0.5 kW w nocy (16h): energia do progu 20% = 10*(100-20)/100=8 kWh, t=16h >= 16h.
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 10,
      socStartPct: 50,
      mocLadowaniaKw: 2,
      mocRozladowaniaKw: 0.5,
      dlugoscDniaGodz: 8,
      socProgPct: 20,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.godzinDoPelna).toBeCloseTo(2.5, 9)
    expect(result.value.zdazyNaladowacPrzedZachodem).toBe(true)
    expect(result.value.socOZachodzieSlonca).toBe(100)
    expect(result.value.godzinDoProguWNocy).toBeCloseTo(16, 9)
    expect(result.value.przetrwaCalaNoc).toBe(true)
  })

  it("nie zdąży naładować się przed zachodem -> SoC o zachodzie < 100, ostrzeżenie gdy nie przetrwa nocy", () => {
    // 20 kWh, start 0%, ładowanie 1kW przez 8h -> energia dostarczona 8 kWh -> SoC o zachodzie 40%.
    // Rozładowanie 2kW w nocy (16h): energia do progu 20% = 20*(40-20)/100=4 kWh, t=2h < 16h -> nie przetrwa.
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 20,
      socStartPct: 0,
      mocLadowaniaKw: 1,
      mocRozladowaniaKw: 2,
      dlugoscDniaGodz: 8,
      socProgPct: 20,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zdazyNaladowacPrzedZachodem).toBe(false)
    expect(result.value.socOZachodzieSlonca).toBeCloseTo(40, 9)
    expect(result.value.godzinDoProguWNocy).toBeCloseTo(2, 9)
    expect(result.value.przetrwaCalaNoc).toBe(false)
    expect(result.warnings.map((w) => w.code)).toContain("NIE-PRZETRWA-NOCY")
  })

  it("brak ładowania w dzień (mocLadowaniaKw=0, dzień bardzo pochmurny) -> SoC o zachodzie = SoC startowy", () => {
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 10,
      socStartPct: 60,
      mocLadowaniaKw: 0,
      mocRozladowaniaKw: 1,
      dlugoscDniaGodz: 8,
      socProgPct: 20,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.godzinDoPelna).toBe(Number.POSITIVE_INFINITY)
    expect(result.value.zdazyNaladowacPrzedZachodem).toBe(false)
    expect(result.value.socOZachodzieSlonca).toBe(60)
  })

  it("pojemność ujemna -> status INVALID_INPUT", () => {
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: -5,
      socStartPct: 50,
      mocLadowaniaKw: 1,
      mocRozladowaniaKw: 1,
      dlugoscDniaGodz: 8,
      socProgPct: 20,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("dlugoscDniaGodz poza zakresem (>24) -> status INVALID_INPUT", () => {
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 10,
      socStartPct: 50,
      mocLadowaniaKw: 1,
      mocRozladowaniaKw: 1,
      dlugoscDniaGodz: 25,
      socProgPct: 20,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (pojemność=0) -> status INCOMPLETE", () => {
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 0,
      socStartPct: 0,
      mocLadowaniaKw: 0,
      mocRozladowaniaKw: 0,
      dlugoscDniaGodz: 0,
      socProgPct: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateSymulacjaLadowania({
      pojemnoscUzytecznaKwh: 20,
      socStartPct: 0,
      mocLadowaniaKw: 1,
      mocRozladowaniaKw: 2,
      dlugoscDniaGodz: 8,
      socProgPct: 20,
    })
    expect(result.warnings[0]?.message).toBeUndefined()
    expect(result.warnings[0]?.i18nKey).toBe("NIE-PRZETRWA-NOCY")
    expect(result.assumptions[0]).toEqual({ kod: "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY" })
  })
})
