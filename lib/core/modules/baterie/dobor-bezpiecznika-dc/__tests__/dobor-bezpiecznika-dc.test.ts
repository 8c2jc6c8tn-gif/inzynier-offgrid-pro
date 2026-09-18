import { describe, expect, it } from "vitest"
import { calculateDoborBezpiecznika } from "../calculator"

describe("calculateDoborBezpiecznika", () => {
  it("przykład ze źródła: 48V / 0,01Ω = 4800A prądu zwarciowego (nie dokładnie 5200A z przykładu narracyjnego, ale ta sama skala)", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.01,
      aicBezpiecznikaA: 20000,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.pradZwarciowyA).toBe(4800)
    expect(result.warnings).toHaveLength(0)
  })

  it("AIC poniżej prądu zwarciowego -> ostrzeżenie krytyczne (twardy stop), status VALID_WITH_WARNINGS", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.01,
      aicBezpiecznikaA: 2000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.pradZwarciowyA).toBe(4800)
    expect(result.warnings[0].level).toBe("critical")
    expect(result.warnings[0].code).toBe("AIC-PONIZEJ-PRADU-ZWARCIOWEGO")
  })

  it("AIC wystarcza na prąd zwarciowy, ale poniżej zalecanego minimum 10000A dla LiFePO4 -> ostrzeżenie warning", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.02, // Izw = 2400A
      aicBezpiecznikaA: 5000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].level).toBe("warning")
    expect(result.warnings[0].code).toBe("AIC-PONIZEJ-ZALECANEGO-MINIMUM")
  })

  it("przypadek graniczny: AIC dokładnie równe prądowi zwarciowemu -> nie jest 'poniżej', przechodzi do sprawdzenia minimum", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.01, // Izw = 4800A
      aicBezpiecznikaA: 4800,
    })
    expect(result.warnings[0].code).toBe("AIC-PONIZEJ-ZALECANEGO-MINIMUM")
  })

  it("błędne dane: rezystancja wewnętrzna = 0 -> INVALID_INPUT", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0,
      aicBezpiecznikaA: 20000,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak danych: napięcie ujemne -> INVALID_INPUT", () => {
    const result = calculateDoborBezpiecznika({
      napiecieBateriiV: -48,
      rezystancjaWewnetrznaOhm: 0.01,
      aicBezpiecznikaA: 20000,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const ponizej = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.01,
      aicBezpiecznikaA: 2000,
    })
    expect(ponizej.warnings[0].i18nKey).toBe("AIC-PONIZEJ-PRADU-ZWARCIOWEGO")
    expect(ponizej.warnings[0].message).toBeUndefined()
    expect(ponizej.assumptions).toEqual([{ kod: "MODEL-ZWARCIA-PROSTEGO-NIZSZY" }])

    const min = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.02,
      aicBezpiecznikaA: 5000,
    })
    expect(min.warnings[0].i18nKey).toBe("AIC-PONIZEJ-ZALECANEGO-MINIMUM")
    expect(min.warnings[0].params).toEqual({ min: 10000 })

    const niedodatnia = calculateDoborBezpiecznika({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0,
      aicBezpiecznikaA: 20000,
    })
    expect(niedodatnia.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
  })
})
