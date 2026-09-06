import { describe, expect, it } from "vitest"
import { calculateOchronaStringow } from "../calculator"

/**
 * PRZEPISANE wg normy HD 60364-7-712 (patrz calculator.ts). Przykład źródła produktowego
 * (Isc=12A -> bezpiecznik 15A, próg "≥3 stringi") NIE jest odtwarzalny pod nowym wzorem — mylił
 * K1 (Załącznik B.2) z doborem bezpiecznika (§712.431.102). Wszystkie wartości poniżej policzone
 * i zweryfikowane niezależnie przed zapisaniem:
 *   Isc_STC=10A, K1=1,25 -> I_SC_MAX=12,5A; inMinA=1,1×12,5=13,75A.
 */
describe("calculateOchronaStringow", () => {
  it("Ns=4, ochrona wymagana i zainstalowana -> VALID", () => {
    // 1,35×20=27 < (4-1)×12,5=37,5 -> ochrona wymagana; zainstalowana -> brak krytycznych.
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 4,
      maZabezpieczeniaPerString: true,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.iScMaxA).toBeCloseTo(12.5, 9)
    expect(result.value.inMinA).toBeCloseTo(13.75, 9)
    expect(result.value.inMaxA).toBe(20)
    expect(result.value.zakresPoprawny).toBe(true)
    expect(result.value.ochronaWymagana).toBe(true)
    expect(result.value.alternatywaKablowaWymagana).toBe(false)
    expect(result.warnings[0].code).toBe("BEZPIECZNIK-DOBRANY")
  })

  it("KRYTYCZNE — Ns=4, ochrona wymagana, brak zabezpieczenia", () => {
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 4,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.ochronaWymagana).toBe(true)
    expect(result.warnings[0].code).toBe("OCHRONA-OBOWIAZKOWA-BRAK")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("Ns=2 — norma wprost wyklucza wymóg ochrony niezależnie od pozostałych wartości", () => {
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.ochronaWymagana).toBe(false)
    expect(result.value.alternatywaKablowaWymagana).toBe(false)
  })

  it("Ns=4, test obowiązkowości NIE spełniony -> wymagana alternatywa kablowa (ostrzeżenie)", () => {
    // 1,35×40=54, (4-1)×12,5=37,5 -> 54 < 37,5 fałsz -> ochrona niewymagana wzorem.
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 40,
      liczbaStringowRownoleglych: 4,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.ochronaWymagana).toBe(false)
    expect(result.value.alternatywaKablowaWymagana).toBe(true)
    expect(result.warnings.some((w) => w.code === "ALTERNATYWA-KABLOWA-NIESPRAWDZONA")).toBe(true)
    expect(result.warnings.find((w) => w.code === "ALTERNATYWA-KABLOWA-NIESPRAWDZONA")?.level).toBe("warning")
  })

  it("KRYTYCZNE — zakres bezpiecznika niepoprawny (inMinA > inMaxA)", () => {
    // Isc_STC=20 -> I_SC_MAX=25 -> inMinA=27,5 > iModMaxOcprA=20.
    const result = calculateOchronaStringow({
      iscStcA: 20,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zakresPoprawny).toBe(false)
    expect(result.warnings[0].code).toBe("ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY")
    expect(result.warnings[0].level).toBe("critical")
  })

  it("KRYTYCZNE — wybrany bezpiecznik poniżej dolnej granicy", () => {
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 4,
      maZabezpieczeniaPerString: true,
      wybranyBezpiecznikA: 10,
    })
    expect(result.value.wybranyBezpiecznikOk).toBe(false)
    expect(result.warnings[0].code).toBe("WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM")
    expect(result.status).toBe("VALID_WITH_WARNINGS")
  })

  it("wybrany bezpiecznik w zakresie -> brak ostrzeżeń krytycznych", () => {
    const result = calculateOchronaStringow({
      iscStcA: 10,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 4,
      maZabezpieczeniaPerString: true,
      wybranyBezpiecznikA: 16,
    })
    expect(result.value.wybranyBezpiecznikOk).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — Isc jeszcze nie wpisany", () => {
    const result = calculateOchronaStringow({
      iscStcA: 0,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny Isc", () => {
    const result = calculateOchronaStringow({
      iscStcA: -5,
      iModMaxOcprA: 20,
      liczbaStringowRownoleglych: 2,
      maZabezpieczeniaPerString: false,
      wybranyBezpiecznikA: null,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })
})
