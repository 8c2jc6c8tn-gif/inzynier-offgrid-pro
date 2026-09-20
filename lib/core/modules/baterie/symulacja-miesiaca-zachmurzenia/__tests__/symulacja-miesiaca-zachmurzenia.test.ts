import { describe, expect, it } from "vitest"
import { calculateSymulacjaZachmurzenia } from "../calculator"

describe("calculateSymulacjaZachmurzenia", () => {
  it("nominalny: nie przetrwa 10 dni, blackout w dniu 7 o godz. 16, brakuje 10 kWh", () => {
    // Deficyt dobowy: 5 - 20*0.10 = 3 kWh/dzień. Energia startowa: 20*100%=20 kWh.
    // Dni pełne: floor(20/3)=6 -> dzień 7. Reszta: 20-3*6=2 kWh -> godzina (2/3)*24=16h.
    // Energia potrzebna na 10 dni: 3*10=30 kWh, brakuje 30-20=10 kWh.
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 20,
      socStartPct: 100,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 20,
      poziomZachmurzeniaPct: 10,
      liczbaDniScenariusza: 10,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.dobowyDeficytKwh).toBeCloseTo(3, 9)
    expect(result.value.przetrwaCalyScenariusz).toBe(false)
    expect(result.value.dzienPadnieSystem).toBe(7)
    expect(result.value.godzinaPadnieSystemW24H).toBeCloseTo(16, 6)
    expect(result.value.energiaBrakujacaKwh).toBeCloseTo(10, 6)
    expect(result.warnings.map((w) => w.code)).toContain("SYSTEM-NIE-PRZETRWA-SCENARIUSZA")
  })

  it("większa pojemność (40 kWh) -> przetrwa cały scenariusz bez blackoutu", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 40,
      socStartPct: 100,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 20,
      poziomZachmurzeniaPct: 10,
      liczbaDniScenariusza: 10,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.przetrwaCalyScenariusz).toBe(true)
    expect(result.value.dzienPadnieSystem).toBeNull()
    expect(result.value.energiaBrakujacaKwh).toBe(0)
  })

  it("produkcja w scenariuszu zachmurzenia przewyższa zapotrzebowanie -> deficyt <= 0, zawsze przetrwa", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 5,
      socStartPct: 10,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 80,
      poziomZachmurzeniaPct: 10,
      liczbaDniScenariusza: 10,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.dobowyDeficytKwh).toBeLessThanOrEqual(0)
    expect(result.value.przetrwaCalyScenariusz).toBe(true)
  })

  it("pojemność ujemna -> status INVALID_INPUT", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: -1,
      socStartPct: 100,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 20,
      poziomZachmurzeniaPct: 10,
      liczbaDniScenariusza: 10,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("poziom zachmurzenia poza zakresem (>100) -> status INVALID_INPUT", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 20,
      socStartPct: 100,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 20,
      poziomZachmurzeniaPct: 150,
      liczbaDniScenariusza: 10,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (pojemność=0) -> status INCOMPLETE", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 0,
      socStartPct: 0,
      zapotrzebowanieDoboweKwh: 0,
      produkcjaNominalnaDobowaKwh: 0,
      poziomZachmurzeniaPct: 0,
      liczbaDniScenariusza: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateSymulacjaZachmurzenia({
      pojemnoscUzytecznaKwh: 20,
      socStartPct: 100,
      zapotrzebowanieDoboweKwh: 5,
      produkcjaNominalnaDobowaKwh: 20,
      poziomZachmurzeniaPct: 10,
      liczbaDniScenariusza: 10,
    })
    expect(result.warnings[0]?.message).toBeUndefined()
    expect(result.warnings[0]?.i18nKey).toBe("SYSTEM-NIE-PRZETRWA-SCENARIUSZA")
    expect(result.assumptions[0]).toEqual({ kod: "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY" })
  })
})
