import { describe, expect, it } from "vitest"
import { calculatePrzetwornica } from "../calculator"
import type { PrzetwornicaInput } from "../input"

const BAZA: PrzetwornicaInput = {
  tryb: "dcdc",
  napiecieAkumulatoraV: 12,
  sprawnoscPct: 90,
  napiecieUrzadzeniaV: 0,
  mocUrzadzeniaW: 0,
  pradPrzetwornicyA: 0,
  urzadzenia: [],
  zapasMocy: 0,
  mocFalownikaW: 0,
  mocSzczytowaFalownikaW: 0,
}

// Tresc E8: "3 urządzenia 230V o łącznej mocy 800W + prąd rozruchowy lodówki (3×) — min. 1500W".
// Lodówka 350 W × 3 → +700 W ponad sumę 800 W = 1500 W szczytu — test values reproducing the source.
const URZADZENIA = [
  { nazwa: "Lodówka", mocW: 350, krotnoscRozruchu: 3 },
  { nazwa: "TV", mocW: 150, krotnoscRozruchu: 0 },
  { nazwa: "Laptop", mocW: 300, krotnoscRozruchu: 1 },
]

describe("calculatePrzetwornica (M12/E8, dawne 8.9 + 8.41 + 8.42)", () => {
  it("USB: telefon 15 W z 12 V → 3 A po stronie USB (Biblia §12.9 'ładowarka USB 3A')", () => {
    const w = calculatePrzetwornica({ ...BAZA, tryb: "usb", mocUrzadzeniaW: 15 })
    expect(w.value.napiecieWyjscioweV).toBe(5)
    expect(w.value.pradWyjsciowyA).toBe(3)
    expect(w.value.pradZAkumulatoraA).toBeCloseTo(15 / (12 * 0.9), 12)
    expect(w.assumptions).toEqual([{ kod: "PRZ-ZALOZENIE-USB-5V" }])
  })

  it("DC/DC 24 V → 12 V, 10 A: 120 W, z akumulatora 120 / (24 × 0,9) A", () => {
    const w = calculatePrzetwornica({ ...BAZA, napiecieAkumulatoraV: 24, napiecieUrzadzeniaV: 12, mocUrzadzeniaW: 120 })
    expect(w.value.pradWyjsciowyA).toBe(10)
    expect(w.value.pradZAkumulatoraA).toBeCloseTo(120 / 21.6, 12)
  })

  it("router 12 V z akumulatora 12 V → bez przetwornicy (ℹ️)", () => {
    const w = calculatePrzetwornica({ ...BAZA, napiecieUrzadzeniaV: 12, mocUrzadzeniaW: 12 })
    expect(w.warnings.map((x) => x.code)).toEqual(["PRZ-BEZ-PRZETWORNICY"])
    expect(w.value.pradZAkumulatoraA).toBe(1)
    expect(w.status).toBe("VALID")
  })

  it("12 V → 24 V: ℹ️ rozważ system 24 V; przetwornica 5 A przy 10 A → 🟡", () => {
    const w = calculatePrzetwornica({ ...BAZA, napiecieUrzadzeniaV: 24, mocUrzadzeniaW: 240, pradPrzetwornicyA: 5 })
    expect(w.warnings.map((x) => x.code)).toEqual(["PRZ-PRZETWORNICA-ZA-SLABA", "PRZ-ROZWAZ-SYSTEM-24V"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("falownik: przykład Treści 800 W + lodówka 3× → szczyt 1500 W; zapas 1,5 → 1200 W ciągłej", () => {
    const w = calculatePrzetwornica({ ...BAZA, tryb: "falownik", urzadzenia: URZADZENIA, zapasMocy: 1.5, sprawnoscPct: 100 })
    expect(w.value.sumaMocyW).toBe(800)
    expect(w.value.szczytRozruchuW).toBe(1500)
    expect(w.value.minimalnaMocFalownikaW).toBe(1200)
    expect(w.warnings.map((x) => x.code)).toEqual(["PRZ-SPRAWDZ-SZCZYT", "PRZ-SPRAWDZ-KABLE"])
    expect(w.assumptions).toEqual([{ kod: "PRZ-ZALOZENIE-ROZRUCH-POJEDYNCZO" }, { kod: "PRZ-ZALOZENIE-BRAK-KROTNOSCI" }])
  })

  it("Biblia §12.29: falownik 2000 W przy 12 V i η 100% → 166,7 A", () => {
    const w = calculatePrzetwornica({ ...BAZA, tryb: "falownik", urzadzenia: URZADZENIA, zapasMocy: 1.5, sprawnoscPct: 100, mocFalownikaW: 2000, mocSzczytowaFalownikaW: 4000 })
    expect(w.value.pradPrzyPelnejMocyA).toBeCloseTo(2000 / 12, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["PRZ-SPRAWDZ-KABLE"])
    expect(w.warnings[0].params).toEqual({ prad: 167 })
  })

  it("falownik za słaby i szczyt za mały → dwa 🟡", () => {
    const w = calculatePrzetwornica({ ...BAZA, tryb: "falownik", urzadzenia: URZADZENIA, zapasMocy: 1.5, mocFalownikaW: 1000, mocSzczytowaFalownikaW: 1400 })
    expect(w.warnings.map((x) => x.code)).toEqual(["PRZ-FALOWNIK-ZA-SLABY", "PRZ-SZCZYT-ZA-MALY", "PRZ-SPRAWDZ-KABLE"])
  })

  it("brak danych → INCOMPLETE; sprawność > 100% → INVALID_INPUT; ujemna moc urządzenia → INVALID_INPUT", () => {
    expect(calculatePrzetwornica({ ...BAZA, tryb: "falownik", urzadzenia: URZADZENIA }).status).toBe("INCOMPLETE")
    expect(calculatePrzetwornica({ ...BAZA, sprawnoscPct: 120 }).status).toBe("INVALID_INPUT")
    expect(calculatePrzetwornica({ ...BAZA, urzadzenia: [{ nazwa: "", mocW: -1, krotnoscRozruchu: 0 }] }).status).toBe("INVALID_INPUT")
  })
})
