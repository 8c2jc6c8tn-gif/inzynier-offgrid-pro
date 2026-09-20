import { describe, expect, it } from "vitest"
import { calculateProjektUziemienia } from "../calculator"

describe("calculateProjektUziemienia", () => {
  it("przykład źródła: ρ=100Ω·m (glina), pręt 3m×16mm, cel odgromowa (<10Ω) -> 3 pręty", () => {
    // Zweryfikowane niezależnie w Pythonie przed implementacją: R_pojedynczego ≈ 29,82 Ω,
    // 3 pręty (uproszczone 1/n) ≈ 9,94 Ω < 10 Ω — zgodne z przykładem źródła "3 pręty 3m".
    const result = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 100,
      dlugoscPretaM: 3,
      srednicaPretaMm: 16,
      celUziemienia: "odgromowa",
    })
    expect(result.status).toBe("VALID")
    expect(result.value.rezystancjaJednegoPretaOm).toBeCloseTo(29.82, 1)
    expect(result.value.liczbaPretowSzacowana).toBe(3)
    expect(result.value.docelowaRezystancjaOm).toBe(10)
  })

  it("cel czuła elektronika (<5Ω) wymaga więcej prętów niż odgromowa dla tych samych warunków", () => {
    const odgromowa = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 100,
      dlugoscPretaM: 3,
      srednicaPretaMm: 16,
      celUziemienia: "odgromowa",
    })
    const elektronika = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 100,
      dlugoscPretaM: 3,
      srednicaPretaMm: 16,
      celUziemienia: "czula-elektronika",
    })
    expect(elektronika.value.liczbaPretowSzacowana).toBeGreaterThan(odgromowa.value.liczbaPretowSzacowana)
  })

  it("OUT_OF_SCOPE — geometria pręta niefizyczna dla wzoru Dwighta (bardzo krótki/gruby pręt)", () => {
    const result = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 100,
      dlugoscPretaM: 0.01,
      srednicaPretaMm: 100,
      celUziemienia: "odgromowa",
    })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("INCOMPLETE — brak wybranego celu uziemienia", () => {
    const result = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 100,
      dlugoscPretaM: 3,
      srednicaPretaMm: 16,
      celUziemienia: null,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystywność gruntu", () => {
    const result = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: -10,
      dlugoscPretaM: 3,
      srednicaPretaMm: 16,
      celUziemienia: "odgromowa",
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("bardzo trudny grunt (wysoka rezystywność) daje ostrzeżenie 'za dużo prętów'", () => {
    const result = calculateProjektUziemienia({
      rezystywnoscGruntuOmM: 2000,
      dlugoscPretaM: 1,
      srednicaPretaMm: 16,
      celUziemienia: "czula-elektronika",
    })
    expect(result.warnings.some((w) => w.code === "ZA-DUZO-PRETOW-DO-PROSTEGO-LICZENIA")).toBe(true)
  })
})
