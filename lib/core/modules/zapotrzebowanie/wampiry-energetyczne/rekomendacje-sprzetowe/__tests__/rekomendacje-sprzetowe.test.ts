import { describe, expect, it } from "vitest"
import { calculatePorownanieMetod, wybierzMetodeDlaKategorii } from "../calculator"

describe("Wampiry energetyczne — Rekomendacje: porównanie metod (dawne 1.32+1.39+1.44)", () => {
  it("przykład źródła 1.39: listwa 40zł/120zł rocznie → zwrot 4 miesiące, Wi-Fi 150zł/200zł rocznie → 9 miesięcy", () => {
    const result = calculatePorownanieMetod({
      metody: [
        { id: "listwa-z-wylacznikiem", kosztZakupuZl: 40, rocznaOszczednoscZl: 120 },
        { id: "gniazdo-wifi", kosztZakupuZl: 150, rocznaOszczednoscZl: 200 },
      ],
    })

    expect(result.status).toBe("VALID")
    expect(result.value.metody[0].okresZwrotuMiesiecy).toBeCloseTo(4, 5)
    expect(result.value.metody[1].okresZwrotuMiesiecy).toBeCloseTo(9, 5)
  })

  it("oszczędność <= 0 → koszt nigdy się nie zwraca, ostrzeżenie info", () => {
    const result = calculatePorownanieMetod({
      metody: [{ id: "przekaznik-zigbee", kosztZakupuZl: 60, rocznaOszczednoscZl: 0 }],
    })

    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.metody[0].okresZwrotuMiesiecy).toBeNull()
    expect(result.warnings[0].code).toBe("WAMPIR-OSZCZEDNOSC-NIGDY-NIE-ZWROCI")
  })

  it("błędne dane: koszt ujemny → INVALID_INPUT", () => {
    const result = calculatePorownanieMetod({
      metody: [{ id: "wylacznik-reczny", kosztZakupuZl: -10, rocznaOszczednoscZl: 50 }],
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wypełnionych metod → INCOMPLETE", () => {
    const result = calculatePorownanieMetod({
      metody: [{ id: "wylacznik-reczny", kosztZakupuZl: 0, rocznaOszczednoscZl: 0 }],
    })
    expect(result.status).toBe("INCOMPLETE")
  })
})

describe("Wampiry energetyczne — Rekomendacje: dobór metody per kategoria (dawne 1.33)", () => {
  it("TV/konsola → listwa z wyłącznikiem", () => {
    expect(wybierzMetodeDlaKategorii({ kategoria: "tv-konsola" }).metoda).toBe("listwa-z-wylacznikiem")
  })
  it("router → gniazdo Wi-Fi", () => {
    expect(wybierzMetodeDlaKategorii({ kategoria: "router" }).metoda).toBe("gniazdo-wifi")
  })
  it("ładowarki → gniazdo z timerem", () => {
    expect(wybierzMetodeDlaKategorii({ kategoria: "ladowarki" }).metoda).toBe("gniazdo-z-timerem")
  })
  it("AGD/inne → obwód z wyłącznikiem w rozdzielni", () => {
    expect(wybierzMetodeDlaKategorii({ kategoria: "agd-inne" }).metoda).toBe("obwod-w-rozdzielni-ze-stycznikiem")
  })
})
