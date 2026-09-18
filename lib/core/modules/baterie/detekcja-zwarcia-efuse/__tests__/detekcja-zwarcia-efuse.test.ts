import { describe, expect, it } from "vitest"
import { calculateDetekcjaZwarciaEFuse } from "../calculator"

describe("calculateDetekcjaZwarciaEFuse", () => {
  it("VALID_WITH_WARNINGS — przykład ze źródła: 5000A prądu zwarciowego, tranzystory poniżej tego", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 500,
    })
    expect(result.value.pradZwarciowyA).toBeCloseTo(5000, 6)
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wymaganyEFuse).toBe(true)
    expect(result.warnings[0].code).toBe("WYMAGANY-E-FUSE")
  })

  it("VALID — zdolność łączeniowa tranzystorów wystarcza", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 6000,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.wymaganyEFuse).toBe(false)
  })

  it("granica: prąd zwarciowy dokładnie równy zdolności — nie wymaga e-Fuse (nie > )", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 5000,
    })
    expect(result.value.wymaganyEFuse).toBe(false)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — pola jeszcze nie wpisane (0)", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 0,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 500,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystancja", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: -1,
      zdolnoscLaczeniowaTranzystorowA: 500,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const wymagany = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 500,
    })
    expect(wymagany.warnings[0].i18nKey).toBe("WYMAGANY-E-FUSE")
    expect(wymagany.warnings[0].params).toEqual({ pradA: "5000", zdolnoscA: "500" })
    expect(wymagany.warnings[0].message).toBeUndefined()
    expect(wymagany.assumptions).toEqual([{ kod: "MODEL-ZWARCIA-PROSTEGO" }])

    const niepotrzebny = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: 0.0096,
      zdolnoscLaczeniowaTranzystorowA: 6000,
    })
    expect(niepotrzebny.warnings[0].i18nKey).toBe("E-FUSE-NIEPOTRZEBNY")
  })

  it("i18n (17.2): błąd walidacji reużywa wspólnego klucza WARTOSC-NIEDODATNIA", () => {
    const result = calculateDetekcjaZwarciaEFuse({
      napiecieBateriiV: 48,
      rezystancjaWewnetrznaOhm: -1,
      zdolnoscLaczeniowaTranzystorowA: 500,
    })
    expect(result.warnings[0].i18nKey).toBe("WARTOSC-NIEDODATNIA")
    expect(result.warnings[0].message).toBeUndefined()
  })
})
