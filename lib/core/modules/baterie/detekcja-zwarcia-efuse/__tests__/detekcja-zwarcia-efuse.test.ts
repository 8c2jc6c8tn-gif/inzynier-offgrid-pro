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
})
