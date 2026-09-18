import { describe, expect, it } from "vitest"
import { calculateDoborMocyFalownika } from "../calculator"

describe("calculateDoborMocyFalownika", () => {
  it("przykład źródła: 4200W szczytowo, w=0,7 -> zalecane 6000W", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 6100,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.mocFalownikaZalecanaW).toBeCloseTo(6000, 5)
    expect(result.warnings[0].code).toBe("REKOMENDACJA-BEZ-SPRAWDZENIA")
  })

  it("falownik wybrany wystarczający (6000W >= 6000W zalecane)", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 6000,
    })
    expect(result.status).toBe("VALID")
    expect(result.warnings[0].code).toBe("FALOWNIK-WYSTARCZAJACY")
  })

  it("KRYTYCZNE — falownik wybrany za słaby (4000W < 6000W zalecane)", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 4000,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings[0].code).toBe("FALOWNIK-ZA-SLABY")
  })

  it("moc pozorna nie podana -> mocFalownikaZalecanaVa=0, brak błędu", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: 1000,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 0,
    })
    expect(result.value.mocFalownikaZalecanaVa).toBe(0)
  })

  it("INCOMPLETE — współczynnik jednoczesności = 0", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 6100,
      wspolczynnikJednoczesnosci: 0,
      mocFalownikaWybranaW: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc szczytowa", () => {
    const result = calculateDoborMocyFalownika({
      mocSzczytowaW: -100,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 0,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia i assumptions zwracają i18nKey/kod, nie gotowy tekst", () => {
    const rekomendacja = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 6100,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 0,
    })
    expect(rekomendacja.warnings[0].i18nKey).toBe("REKOMENDACJA-MOCY-FALOWNIKA")
    expect(rekomendacja.warnings[0].params).toEqual({ zalecana: 6000 })
    expect(rekomendacja.warnings[0].message).toBeUndefined()
    expect(rekomendacja.assumptions).toEqual([
      { kod: "WSPOLCZYNNIK-JEDNOCZESNOSCI-MARGINES" },
      { kod: "PRADY-ROZRUCHOWE-NIE-LICZONE-LICZBOWO" },
    ])

    const wystarczajacy = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 6000,
    })
    expect(wystarczajacy.warnings[0].i18nKey).toBe("FALOWNIK-MOCY-WYSTARCZAJACY")
    expect(wystarczajacy.warnings[0].params).toEqual({ wybrana: 6000, zalecana: 6000 })

    const zaSlaby = calculateDoborMocyFalownika({
      mocSzczytowaW: 4200,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 4000,
    })
    expect(zaSlaby.warnings[0].i18nKey).toBe("FALOWNIK-MOCY-ZA-SLABY")

    const ujemna = calculateDoborMocyFalownika({
      mocSzczytowaW: -100,
      mocPozornaVa: 0,
      wspolczynnikJednoczesnosci: 0.7,
      mocFalownikaWybranaW: 0,
    })
    expect(ujemna.warnings[0].i18nKey).toBe("WARTOSC-NIE-MOZE-BYC-UJEMNA")
  })
})
