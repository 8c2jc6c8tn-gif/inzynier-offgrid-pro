import { describe, expect, it } from "vitest"
import { calculateHierarchiaLadowania } from "../calculator"

const BAZA = {
  produkcjaPvDostepnaTeraz: false,
  socAktualnyPct: 50,
  socProguKrytycznegoPct: 30,
  prognozaSloncaJutro: false,
  agregatDostepny: true,
  siecDostepna: true,
  taniaTaryfaNocna: false,
}

describe("calculateHierarchiaLadowania", () => {
  it("PV zawsze pierwsze, niezależnie od reszty warunków", () => {
    const result = calculateHierarchiaLadowania({ ...BAZA, produkcjaPvDostepnaTeraz: true, socAktualnyPct: 10 })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodlo).toBe("PV")
  })

  it("przykład ze źródła (Sekcja C): SoC 25% poniżej progu, ale jutro słońce -> BRAK (system czeka), nie AGREGAT", () => {
    const result = calculateHierarchiaLadowania({
      ...BAZA,
      socAktualnyPct: 25,
      socProguKrytycznegoPct: 30,
      prognozaSloncaJutro: true,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zrodlo).toBe("BRAK")
    expect(result.warnings.map((w) => w.code)).toContain("OCZEKIWANIE-NA-SLONCE")
  })

  it("SoC poniżej progu, brak prognozy słońca, agregat dostępny -> AGREGAT", () => {
    const result = calculateHierarchiaLadowania({
      ...BAZA,
      socAktualnyPct: 25,
      socProguKrytycznegoPct: 30,
      prognozaSloncaJutro: false,
      agregatDostepny: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodlo).toBe("AGREGAT")
  })

  it("SoC poniżej progu, brak prognozy słońca, agregat NIEdostępny, tania taryfa -> SIEC", () => {
    const result = calculateHierarchiaLadowania({
      ...BAZA,
      socAktualnyPct: 25,
      socProguKrytycznegoPct: 30,
      prognozaSloncaJutro: false,
      agregatDostepny: false,
      taniaTaryfaNocna: true,
      siecDostepna: true,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodlo).toBe("SIEC")
  })

  it("SoC poniżej progu, brak PV/agregatu/prognozy/taniej taryfy -> BRAK, ostrzeżenie krytyczne", () => {
    const result = calculateHierarchiaLadowania({
      ...BAZA,
      socAktualnyPct: 25,
      socProguKrytycznegoPct: 30,
      prognozaSloncaJutro: false,
      agregatDostepny: false,
      taniaTaryfaNocna: false,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.zrodlo).toBe("BRAK")
    const warning = result.warnings.find((w) => w.code === "BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA")
    expect(warning?.level).toBe("critical")
  })

  it("SoC powyżej progu, brak PV, brak taniej taryfy -> BRAK, bez ostrzeżenia (stan normalny)", () => {
    const result = calculateHierarchiaLadowania({ ...BAZA, socAktualnyPct: 60, socProguKrytycznegoPct: 30 })
    expect(result.status).toBe("VALID")
    expect(result.value.zrodlo).toBe("BRAK")
    expect(result.warnings).toHaveLength(0)
  })

  it("SoC poza zakresem -> status INVALID_INPUT", () => {
    const result = calculateHierarchiaLadowania({ ...BAZA, socAktualnyPct: 150 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (oba SoC = 0) -> status INCOMPLETE", () => {
    const result = calculateHierarchiaLadowania({ ...BAZA, socAktualnyPct: 0, socProguKrytycznegoPct: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenie zwraca i18nKey, nie gotowy tekst", () => {
    const result = calculateHierarchiaLadowania({
      ...BAZA,
      socAktualnyPct: 25,
      socProguKrytycznegoPct: 30,
      prognozaSloncaJutro: false,
      agregatDostepny: false,
      taniaTaryfaNocna: false,
    })
    expect(result.warnings[0]?.message).toBeUndefined()
    expect(result.warnings[0]?.i18nKey).toBe("BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA")
  })
})
