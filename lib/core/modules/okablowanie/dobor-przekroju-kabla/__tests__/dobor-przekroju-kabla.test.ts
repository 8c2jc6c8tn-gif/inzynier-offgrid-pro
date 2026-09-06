import { describe, expect, it } from "vitest"
import { calculateDoborPrzekrojuKabla } from "../calculator"
import type { DoborPrzekrojuKablaInput } from "../input"

/**
 * Wartości referencyjne poniżej policzone niezależnie (ręcznie/w Pythonie) z tabel normy PN-HD
 * 60364-5-52 (Tablice B.52.2, B.52.14, B.52.17, B.52.18) przed napisaniem testów — nie
 * "sprawdzone przez uruchomienie kalkulatora". Przykłady ilustracyjne z Sekcji C źródła
 * (`Tresc_Modul_5_Okablowanie_Ekrany.md`, "20m/20A/48V/w peszlu/35°C → 6mm², spadek 2,1%") nie dają
 * się dokładnie odtworzyć z faktycznego wzoru `R=ρ×2L/S` (dają ok. 4,9%, nie 2,1%) — źródło jest
 * ilustracyjne/przybliżone, ten sam wzorzec rozbieżności co już udokumentowany w Ekranie 6 Modułu 3
 * (aerodynamika wiatru). Testy używają własnych, w pełni zweryfikowanych scenariuszy zamiast
 * wymuszania dopasowania do niereprodukowalnego przykładu.
 */

function baseInput(overrides: Partial<DoborPrzekrojuKablaInput> = {}): DoborPrzekrojuKablaInput {
  return {
    pradA: 15,
    napiecieV: 48,
    dlugoscTrasyM: 10,
    material: "Cu",
    sposobUlozenia: "w_peszlu",
    temperaturaOtoczeniaC: 30,
    liczbaKabliWWiazce: 0,
    dopuszczalnySpadekNapieciaPct: 3,
    sprawdzanyPrzekrojMm2: null,
    ...overrides,
  }
}

describe("calculateDoborPrzekrojuKabla", () => {
  it("nominalny: Cu, w peszlu, 15A/48V/10m/30°C → 4 mm² (2,5 mm² odpada na spadku napięcia)", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput())
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.value.przekrojMm2).toBe(4)
    expect(wynik.value.spadekNapieciaPct).toBeCloseTo(2.734, 2)
    expect(wynik.value.marginesObciazalnosciPct).toBeCloseTo(100, 1)
    expect(wynik.value.marginesSpadkuPct).toBeCloseTo(8.854, 2)
    expect(wynik.warnings[0].code).toBe("PRZEKROJ-NA-GRANICY")
  })

  it("graniczny: w ziemi, 30A/230V/15m/20°C → 4 mm², oba marginesy dodatnie ale spadek <15%", () => {
    const wynik = calculateDoborPrzekrojuKabla(
      baseInput({
        pradA: 30,
        napiecieV: 230,
        dlugoscTrasyM: 15,
        sposobUlozenia: "w_ziemi",
        temperaturaOtoczeniaC: 20,
        dopuszczalnySpadekNapieciaPct: 2,
      }),
    )
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.value.przekrojMm2).toBe(4)
    expect(wynik.value.marginesObciazalnosciPct).toBeCloseTo(23.33, 1)
    expect(wynik.value.spadekNapieciaPct).toBeCloseTo(1.712, 2)
  })

  it("zalecany z dużym marginesem: sprawdzany przekrój 10 mm² → 🟢 VALID", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ sprawdzanyPrzekrojMm2: 10 }))
    expect(wynik.status).toBe("VALID")
    expect(wynik.warnings[0].code).toBe("PRZEKROJ-ZALECANY")
    expect(wynik.value.przekrojMm2).toBe(10)
  })

  it("twardy stop: sprawdzany przekrój 2,5 mm² poniżej wymaganego → 🔴 krytyczne", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ sprawdzanyPrzekrojMm2: 2.5 }))
    expect(wynik.warnings[0].code).toBe("PRZEKROJ-PONIZEJ-WYLICZONEGO")
    expect(wynik.warnings[0].level).toBe("critical")
  })

  it("aluminium: 10A/48V/5m/30°C/w peszlu → 2,5 mm² (najmniejszy dostępny dla Al)", () => {
    const wynik = calculateDoborPrzekrojuKabla(
      baseInput({ material: "Al", pradA: 10, dlugoscTrasyM: 5 }),
    )
    expect(wynik.status).toBe("VALID")
    expect(wynik.value.przekrojMm2).toBe(2.5)
  })

  it("błędne dane: temperatura poza zakresem tabel PVC (65°C) → OUT_OF_SCOPE", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ temperaturaOtoczeniaC: 65 }))
    expect(wynik.status).toBe("OUT_OF_SCOPE")
    expect(wynik.warnings[0].code).toBe("TEMPERATURA-POZA-ZAKRESEM")
  })

  it("błędne dane: liczba kabli w wiązce poza zakresem tabeli (25) → OUT_OF_SCOPE", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ liczbaKabliWWiazce: 25 }))
    expect(wynik.status).toBe("OUT_OF_SCOPE")
    expect(wynik.warnings[0].code).toBe("LICZBA-KABLI-POZA-ZAKRESEM")
  })

  it("brak danych: prąd = 0 → INCOMPLETE", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ pradA: 0 }))
    expect(wynik.status).toBe("INCOMPLETE")
  })

  it("błędne dane: prąd ujemny → INVALID_INPUT", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ pradA: -5 }))
    expect(wynik.status).toBe("INVALID_INPUT")
  })

  it("brak pasującego przekroju: bardzo duży prąd na krótkim limicie tabeli → OUT_OF_SCOPE", () => {
    const wynik = calculateDoborPrzekrojuKabla(baseInput({ pradA: 500 }))
    expect(wynik.status).toBe("OUT_OF_SCOPE")
    expect(wynik.warnings[0].code).toBe("BRAK-PASUJACEGO-PRZEKROJU")
  })

  it("korekta wiązki: 4 kable w wiązce (swobodnie) obniża obciążalność efektywną", () => {
    const bezWiazki = calculateDoborPrzekrojuKabla(
      baseInput({ sposobUlozenia: "swobodnie", pradA: 20 }),
    )
    const zWiazka = calculateDoborPrzekrojuKabla(
      baseInput({ sposobUlozenia: "w_wiazce", pradA: 20, liczbaKabliWWiazce: 4 }),
    )
    expect(zWiazka.value.obciazalnoscEfektywnaA).toBeLessThan(bezWiazki.value.obciazalnoscEfektywnaA)
  })
})
