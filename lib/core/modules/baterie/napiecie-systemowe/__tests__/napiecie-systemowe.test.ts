import { describe, expect, it } from "vitest"
import { calculateNapiecieSystemowe } from "../calculator"
import type { NapiecieSystemoweInput, OdbiornikWybor } from "../input"
import { CENY_DOMYSLNE, CENA_OGNIWA_DOMYSLNA_ZL } from "../constants"

function pustyInput(overrides: Partial<NapiecieSystemoweInput> = {}): NapiecieSystemoweInput {
  return {
    mocSzczytowaW: 0,
    zastosowanie: null,
    priorytet: null,
    ogrzewanieNieDotyczy: false,
    ogrzewanieMocW: 0,
    odbiorniki: [],
    mocCiaglaFalownikaPlanowanaW: 0,
    dlugoscTrasyM: 0,
    material: "Cu",
    sposobUlozenia: "swobodnie",
    temperaturaOtoczeniaC: null,
    liczbaKabliWWiazce: 1,
    dopuszczalnySpadekNapieciaPct: 3,
    docelowaPojemnoscKwh: 0,
    cenaOgniwaZl: CENA_OGNIWA_DOMYSLNA_ZL,
    cenaBms4sZl: CENY_DOMYSLNE.bms4sZl,
    cenaBms8sZl: CENY_DOMYSLNE.bms8sZl,
    cenaBms16sZl: CENY_DOMYSLNE.bms16sZl,
    cenaFalownika12vZl: CENY_DOMYSLNE.falownik12vZl,
    cenaFalownika24vZl: CENY_DOMYSLNE.falownik24vZl,
    cenaFalownika48vZl: CENY_DOMYSLNE.falownik48vZl,
    cenaPrzewodow12vZl: CENY_DOMYSLNE.przewody12vZl,
    cenaPrzewodow24vZl: CENY_DOMYSLNE.przewody24vZl,
    cenaPrzewodow48vZl: CENY_DOMYSLNE.przewody48vZl,
    cenaBezpiecznika12vZl: CENY_DOMYSLNE.bezpiecznik12vZl,
    cenaBezpiecznika24vZl: CENY_DOMYSLNE.bezpiecznik24vZl,
    cenaBezpiecznika48vZl: CENY_DOMYSLNE.bezpiecznik48vZl,
    liczbaLiniiOswietlenia24vPrzySystemie48v: 0,
    cenaPrzetwornicyDcDcZl: CENY_DOMYSLNE.przetwornicaDcDcZl,
    planowanaKonwersja24Do48: false,
    ...overrides,
  }
}

function odbiornik(id: string, mocW: number, extra: Partial<OdbiornikWybor> = {}): OdbiornikWybor {
  return { id, mocW, czasPracyMin: 0, selected: true, ...extra }
}

describe("calculateNapiecieSystemowe — rdzeń I=P/V (v1.0.0, niezmieniony)", () => {
  it("przykład źródła: 4800W -> rekomendacja 48V, prąd 400A@12V i 100A@48V dokładnie", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 4800 }))
    expect(result.status).toBe("VALID_WITH_WARNINGS") // C.3: 400A@12V > 100A -> critical warning zawsze dołączone
    expect(result.value.napiecieRekomendowaneV).toBe(48)
    expect(result.value.pradPrzy12VA).toBeCloseTo(400, 9)
    expect(result.value.pradPrzy48VA).toBeCloseTo(100, 9)
    expect(result.value.pradPrzy24VA).toBeCloseTo(200, 9)
  })

  it("mała instalacja: 800W (<1000W) -> rekomendacja 12V, bez ostrzeżenia 100A (67A<100A)", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 800 }))
    expect(result.value.napiecieRekomendowaneV).toBe(12)
    expect(result.status).toBe("VALID")
  })

  it("pasmo środkowe: 2000W -> rekomendacja 24V", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 2000 }))
    expect(result.value.napiecieRekomendowaneV).toBe(24)
  })

  it("przypadek graniczny: dokładnie 3000W -> jeszcze 24V", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 3000 }))
    expect(result.value.napiecieRekomendowaneV).toBe(24)
  })

  it("przypadek graniczny: 3000,01W -> już 48V", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 3000.01 }))
    expect(result.value.napiecieRekomendowaneV).toBe(48)
  })

  it("INCOMPLETE — brak mocy i pustych odbiorników", () => {
    const result = calculateNapiecieSystemowe(pustyInput())
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna moc", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: -100 }))
    expect(result.status).toBe("INVALID_INPUT")
  })
})

describe("calculateNapiecieSystemowe — Etap B (kreator odbiorników + jednoczesność)", () => {
  it("moc szczytowa = suma zaznaczonych odbiorników, gdy pole ręczne puste", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ odbiorniki: [odbiornik("router", 15), odbiornik("czajnik", 2000), odbiornik("laptop", 68)] }),
    )
    expect(result.value.mocSzczytowaCalkowitaW).toBeCloseTo(15 + 2000 + 68, 9)
  })

  it("pole ręczne nadpisuje sumę z kreatora, gdy oba podane", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ mocSzczytowaW: 5000, odbiorniki: [odbiornik("router", 15)] }),
    )
    expect(result.value.mocSzczytowaCalkowitaW).toBe(5000)
  })

  it("konflikt B.2: czajnik(1850)+piekarnik(2750)+router(15, bazowy) > limit 3000W -> ostrzeżenie", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({
        odbiorniki: [odbiornik("router", 15), odbiornik("czajnik", 1850), odbiornik("piekarnik", 2750, { czasPracyMin: 60 })],
        mocCiaglaFalownikaPlanowanaW: 3000,
      }),
    )
    expect(result.value.jednoczesnosc).not.toBeNull()
    expect(result.value.jednoczesnosc?.sumaWorstCaseW).toBeCloseTo(15 + 1850 + 2750, 9)
    expect(result.value.jednoczesnosc?.konflikt).toBe(true)
    // piekarnik jest jedynym długotrwałym (czajnik ma czasPracyMin=0 -> chwilowy) -> waga "warning"
    expect(result.value.jednoczesnosc?.wagaOstrzezenia).toBe("warning")
    expect(result.warnings.some((w) => w.code === "KONFLIKT-JEDNOCZESNOSCI")).toBe(true)
  })

  it("konflikt B.3: piekarnik(60min)+bojler(120min) oba długotrwałe -> waga critical", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({
        odbiorniki: [odbiornik("piekarnik", 2750, { czasPracyMin: 60 }), odbiornik("bojler", 2250, { czasPracyMin: 120 })],
        mocCiaglaFalownikaPlanowanaW: 3000,
      }),
    )
    expect(result.value.jednoczesnosc?.wagaOstrzezenia).toBe("critical")
  })

  it("bez limitu podanego — jednoczesność liczona, ale konflikt nie sprawdzany", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ odbiorniki: [odbiornik("czajnik", 2000)] }),
    )
    expect(result.value.jednoczesnosc?.limitPodano).toBe(false)
    expect(result.value.jednoczesnosc?.konflikt).toBe(false)
  })

  it("sugerowane wyłączenie — zachłannie od największej mocy", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({
        odbiorniki: [odbiornik("czajnik", 2000, { czasPracyMin: 5 }), odbiornik("piekarnik", 3000, { czasPracyMin: 60 })],
        mocCiaglaFalownikaPlanowanaW: 4000,
      }),
    )
    // suma=5000 > limit 4000, nadwyżka 1000 -> wystarczy wyłączyć piekarnik (3000W, największy)
    expect(result.value.jednoczesnosc?.sugerowaneWylaczenie).toEqual([{ id: "piekarnik", label: "Piekarnik elektryczny", mocW: 3000 }])
  })
})

describe("calculateNapiecieSystemowe — Etap C (echo dobor-przekroju-kabla ×3)", () => {
  it("2000W, 3m, Cu, swobodnie, 25°C, 3% spadku -> trzy przekroje, 48V ma najmniejsze straty", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({
        mocSzczytowaW: 2000,
        dlugoscTrasyM: 3,
        material: "Cu",
        sposobUlozenia: "swobodnie",
        temperaturaOtoczeniaC: 25,
        liczbaKabliWWiazce: 1,
        dopuszczalnySpadekNapieciaPct: 3,
      }),
    )
    expect(result.value.kable).not.toBeNull()
    const kable = result.value.kable!
    // 2000W@12V = 166,7A — przekracza obciążalność największego dostępnego przekroju (35mm²,
    // nawet skorygowaną k1/k2 ~146A) -> silnik normatywny poprawnie zwraca "brak pasującego
    // przekroju" zamiast zmyślonej wartości. To realny, pouczający wynik (nie błąd testu) —
    // dokładnie ten problem, przed którym ma ostrzegać cały ten ekran.
    expect(kable.v12.status).toBe("OUT_OF_SCOPE")
    expect(kable.v12.przekrojMm2).toBe(0)
    expect(kable.v24.przekrojMm2).toBeGreaterThan(0)
    expect(kable.v48.przekrojMm2).toBeGreaterThan(0)
    expect(kable.v48.strataRocznaKwh).toBeLessThan(kable.v24.strataRocznaKwh)
  })

  it("bez danych trasy (dlugoscTrasyM=0) -> kable=null, bez błędu", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 2000 }))
    expect(result.value.kable).toBeNull()
  })
})

describe("calculateNapiecieSystemowe — Etap E (kosztorysy ×3, ta sama pojemność)", () => {
  it("16 kWh -> odtwarza dokładnie tabelę E.3 źródła (6332/6582/7162 zł, bez przetwornic)", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ mocSzczytowaW: 2000, docelowaPojemnoscKwh: 16 }),
    )
    const k = result.value.kosztorysy!
    expect(k.v12.liczbaOgniwLacznie).toBe(16)
    expect(k.v24.liczbaOgniwLacznie).toBe(16)
    expect(k.v48.liczbaOgniwLacznie).toBe(16)
    expect(k.v12.razemZl).toBeCloseTo(6332, 6)
    expect(k.v24.razemZl).toBeCloseTo(6582, 6)
    expect(k.v48.razemZl).toBeCloseTo(7162, 6)
  })

  it("48V + 3 linie oświetlenia 24V -> dolicza 3× przetwornicę DC-DC", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ mocSzczytowaW: 2000, docelowaPojemnoscKwh: 16, liczbaLiniiOswietlenia24vPrzySystemie48v: 3 }),
    )
    expect(result.value.kosztorysy!.v48.kosztPrzetwornicZl).toBe(3 * 400)
    expect(result.value.kosztorysy!.v12.kosztPrzetwornicZl).toBe(0) // tylko 48V
  })

  it("bez docelowej pojemności -> kosztorysy=null", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 2000 }))
    expect(result.value.kosztorysy).toBeNull()
  })
})

describe("calculateNapiecieSystemowe — Etap H (pułapka konwersji 24V->48V)", () => {
  it("koszt przejścia = BMS16S + falownik48V + przewody48V (600+1500+150=2250 zł, zgodnie ze źródłem H.4)", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ mocSzczytowaW: 2000, planowanaKonwersja24Do48: true }),
    )
    expect(result.value.kosztKonwersji24Do48Zl).toBe(2250)
    expect(result.warnings.some((w) => w.code === "PULAPKA-KONWERSJI-24-DO-48")).toBe(true)
  })

  it("bez zaznaczenia -> null, brak ostrzeżenia", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 2000 }))
    expect(result.value.kosztKonwersji24Do48Zl).toBeNull()
    expect(result.warnings.some((w) => w.code === "PULAPKA-KONWERSJI-24-DO-48")).toBe(false)
  })
})

describe("calculateNapiecieSystemowe — Etap A/C.1 (ogrzewanie wymaga 48V)", () => {
  it("ogrzewanie 2000W + moc mała (24V) -> ostrzeżenie OGRZEWANIE-WYMAGA-48V", () => {
    const result = calculateNapiecieSystemowe(pustyInput({ mocSzczytowaW: 2000, ogrzewanieMocW: 2000 }))
    expect(result.value.napiecieRekomendowaneV).toBe(24)
    expect(result.warnings.some((w) => w.code === "OGRZEWANIE-WYMAGA-48V")).toBe(true)
  })

  it("ogrzewanie nie dotyczy -> ogrzewanieMocW ignorowane nawet jeśli wpisane", () => {
    const result = calculateNapiecieSystemowe(
      pustyInput({ mocSzczytowaW: 2000, ogrzewanieMocW: 2000, ogrzewanieNieDotyczy: true }),
    )
    expect(result.warnings.some((w) => w.code === "OGRZEWANIE-WYMAGA-48V")).toBe(false)
  })
})
