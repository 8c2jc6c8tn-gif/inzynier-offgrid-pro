import { describe, expect, it } from "vitest"
import { calculateDoborBezpiecznikaRozlacznika } from "../calculator"

describe("calculateDoborBezpiecznikaRozlacznika (Ekran 6, Moduł 5)", () => {
  it("nominalny: 100A → bezpiecznik 125A, AIC wystarczające → VALID", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 2000,
      aicBezpiecznikaA: 10_000,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pradBezpiecznikaZalecanyA).toBeCloseTo(125)
    expect(result.value.aicWystarczajace).toBe(true)
  })

  it("graniczny: prąd znamionowy 80A → bezpiecznik dokładnie 100A (1,25×)", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 80,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(result.value.pradBezpiecznikaZalecanyA).toBe(100)
  })

  it("AIC dokładnie równe prądowi zwarciowemu → wystarczające (>=)", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 5000,
      aicBezpiecznikaA: 5000,
    })
    expect(result.value.aicWystarczajace).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("AIC poniżej prądu zwarciowego → VALID_WITH_WARNINGS, twardy stop krytyczny", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 12_000,
      aicBezpiecznikaA: 10_000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.aicWystarczajace).toBe(false)
    expect(result.warnings[0].code).toBe("AIC-PONIZEJ-PRADU-ZWARCIOWEGO")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("błędne dane: prąd znamionowy ujemny → INVALID_INPUT", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: -5,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: prąd znamionowy = 0 → INCOMPLETE", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 0,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("AIC i prąd zwarciowy niepodane → sprawdzenie AIC pominięte (null), status VALID mimo to", () => {
    const result = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.aicWystarczajace).toBeNull()
    expect(result.assumptions.length).toBeGreaterThan(0)
  })

  it("i18n (17.2): ostrzeżenia, błędy walidacji i assumptions zwracają i18nKey/kod, nie gotowy tekst", () => {
    const aicZaMalo = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 12_000,
      aicBezpiecznikaA: 10_000,
    })
    expect(aicZaMalo.warnings[0].i18nKey).toBe("AIC-BEZPIECZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO")
    expect(aicZaMalo.warnings[0].params).toEqual({ aic: 10_000, pradZwarciowy: 12_000 })
    expect(aicZaMalo.warnings[0].message).toBeUndefined()

    const bezSprawdzenia = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(bezSprawdzenia.assumptions).toEqual([
      { kod: "SELEKTYWNOSC-NIE-SPRAWDZONA" },
      { kod: "AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA" },
    ])

    const pradUjemny = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: -5,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: 0,
    })
    expect(pradUjemny.warnings[0].i18nKey).toBe("PRAD-ZNAMIONOWY-NIEDODATNI")

    const zwarciowyUjemny = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: -1,
      aicBezpiecznikaA: 0,
    })
    expect(zwarciowyUjemny.warnings[0].i18nKey).toBe("PRAD-ZWARCIOWY-UJEMNY")

    const aicUjemne = calculateDoborBezpiecznikaRozlacznika({
      pradZnamionowyA: 100,
      pradZwarciowyA: 0,
      aicBezpiecznikaA: -1,
    })
    expect(aicUjemne.warnings[0].i18nKey).toBe("AIC-UJEMNE")
  })
})
