import { describe, expect, it } from "vitest"
import { calculateKalibracjaSoc } from "../calculator"

describe("calculateKalibracjaSoc", () => {
  it("13 dni (poniżej progu 14) -> kalibracja niepotrzebna", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: 13 })
    expect(result.value.kalibracjaRekomendowana).toBe(false)
    expect(result.warnings[0].code).toBe("KALIBRACJA-NIEPOTRZEBNA")
  })

  it("dokładnie 14 dni (próg włącznie) -> kalibracja rekomendowana", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: 14 })
    expect(result.value.kalibracjaRekomendowana).toBe(true)
    expect(result.warnings[0].code).toBe("REKOMENDOWANA-KALIBRACJA-SOC")
  })

  it("30 dni -> kalibracja rekomendowana", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: 30 })
    expect(result.value.kalibracjaRekomendowana).toBe(true)
  })

  it("0 dni (dziś było pełne ładowanie) -> prawidłowa wartość, nie placeholder, kalibracja niepotrzebna", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: 0 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.kalibracjaRekomendowana).toBe(false)
  })

  it("dni ujemne -> status INVALID_INPUT", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: -1 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak pomiaru (null) -> status INCOMPLETE", () => {
    const result = calculateKalibracjaSoc({ dniOdOstatniegoPelnegoNaladowania: null })
    expect(result.status).toBe("INCOMPLETE")
  })
})
