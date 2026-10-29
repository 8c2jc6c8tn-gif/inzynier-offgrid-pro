import { describe, expect, it } from "vitest"
import { calculateColdCRate } from "../calculator"

describe("calculateColdCRate", () => {
  it("-5°C, 280Ah -> strefa blokada (jedna reguła: zakaz ładowania poniżej 0°C), maxPradA=0, ostrzeżenie critical", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: -5, pojemnoscAh: 280 })
    expect(result.value.strefa).toBe("blokada")
    expect(result.value.maxPradA).toBe(0)
    expect(result.warnings[0].level).toBe("critical")
  })

  it("2°C, 280Ah -> strefa limit-02c, maxPradA=56A", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 2, pojemnoscAh: 280 })
    expect(result.value.strefa).toBe("limit-02c")
    expect(result.value.maxPradA).toBeCloseTo(56, 9)
    expect(result.warnings[0].level).toBe("warning")
  })

  it("-15°C -> strefa blokada, maxPradA=0, ostrzeżenie critical", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: -15, pojemnoscAh: 280 })
    expect(result.value.strefa).toBe("blokada")
    expect(result.value.maxPradA).toBe(0)
    expect(result.warnings[0].level).toBe("critical")
  })

  it("-0,1°C -> strefa blokada (tuż poniżej progu 0°C)", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: -0.1, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("blokada")
    expect(result.value.maxPradA).toBe(0)
  })

  it("dokładnie 0°C -> strefa limit-02c (0°C wchodzi do przedziału 0-5°C, blokada jest ściśle poniżej 0°C)", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 0, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("limit-02c")
    expect(result.value.maxPradA).toBe(20)
  })

  it("4,9°C -> wciąż strefa limit-02c", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 4.9, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("limit-02c")
  })

  it("5°C -> strefa luka-zrodla, status OUT_OF_SCOPE (źródło nie definiuje tego zakresu)", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 5, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("luka-zrodla")
    expect(result.status).toBe("OUT_OF_SCOPE")
    expect(result.value.maxPradA).toBeNull()
  })

  it("10°C (górny kraniec luki włącznie) -> wciąż luka-zrodla", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 10, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("luka-zrodla")
  })

  it("10,1°C -> strefa pelny-prad, status VALID, brak wymyślonego maxPradA", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: 10.1, pojemnoscAh: 100 })
    expect(result.value.strefa).toBe("pelny-prad")
    expect(result.status).toBe("VALID")
    expect(result.value.maxPradA).toBeNull()
  })

  it("pojemność ujemna -> status INVALID_INPUT", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: -5, pojemnoscAh: -1 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak pomiaru temperatury (null) -> status INCOMPLETE", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: null, pojemnoscAh: 280 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("pojemność nie wpisana (0) przy realnej temperaturze -> status INCOMPLETE", () => {
    const result = calculateColdCRate({ temperaturaOgniwaC: -5, pojemnoscAh: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenia i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const blokada = calculateColdCRate({ temperaturaOgniwaC: -15, pojemnoscAh: 280 })
    expect(blokada.warnings[0].i18nKey).toBe("BLOKADA-LADOWANIA-MROZ")
    expect(blokada.warnings[0].message).toBeUndefined()

    const limitChlodno = calculateColdCRate({ temperaturaOgniwaC: 2, pojemnoscAh: 280 })
    expect(limitChlodno.warnings[0].i18nKey).toBe("LIMIT-PRADU-CHLODNO")
    expect(limitChlodno.warnings[0].params).toEqual({ temp: "2.0", maxPrad: "56.0" })

    const luka = calculateColdCRate({ temperaturaOgniwaC: 5, pojemnoscAh: 100 })
    expect(luka.warnings[0].i18nKey).toBe("LUKA-TABELI-ZRODLA")

    const pelnyPrad = calculateColdCRate({ temperaturaOgniwaC: 10.1, pojemnoscAh: 100 })
    expect(pelnyPrad.assumptions).toEqual([{ kod: "BRAK-LIMITU-PRADU-POWYZEJ-10C" }])
  })
})
