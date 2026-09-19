import { describe, expect, it } from "vitest"
import { calculatePomiaryPowykonawcze } from "../calculator"

const WSZYSTKO_OK = {
  ciagloscPotwierdzona: true,
  rezystancjaIzolacjiMohm: 2,
  celUziemienia: "ochronna" as const,
  rezystancjaUziemieniaOhm: 15,
  czasZadzialaniaRcdS: 0.2,
  testZwarciowyPotwierdzony: true,
  termowizjaPotwierdzona: true,
}

describe("calculatePomiaryPowykonawcze", () => {
  it("wszystkie testy w normie -> VALID, 6/6", () => {
    const result = calculatePomiaryPowykonawcze(WSZYSTKO_OK)
    expect(result.status).toBe("VALID")
    expect(result.value).toEqual({ testowPrzeszlo: 6, testowLacznie: 6 })
    expect(result.warnings[0].code).toBe("WSZYSTKO-OK")
  })

  it("KRYTYCZNE — ciągłość niepotwierdzona blokuje odbiór mimo pozostałych OK", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, ciagloscPotwierdzona: false })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.testowPrzeszlo).toBe(5)
    expect(result.warnings.some((w) => w.code === "CIAGLOSC-NIEPOTWIERDZONA")).toBe(true)
  })

  it("KRYTYCZNE — rezystancja izolacji dokładnie 1 MΩ nie wystarcza (wymagane > 1 MΩ)", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, rezystancjaIzolacjiMohm: 1 })
    expect(result.warnings.some((w) => w.code === "REZYSTANCJA-IZOLACJI-ZA-NISKA")).toBe(true)
  })

  it("KRYTYCZNE — rezystancja uziemienia dokładnie na progu (10 Ω, odgromowa) nie wystarcza", () => {
    const result = calculatePomiaryPowykonawcze({
      ...WSZYSTKO_OK,
      celUziemienia: "odgromowa",
      rezystancjaUziemieniaOhm: 10,
    })
    expect(result.warnings.some((w) => w.code === "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA")).toBe(true)
  })

  it("rezystancja uziemienia 25 Ω wystarcza dla celu ochronnego (próg 30 Ω)", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, rezystancjaUziemieniaOhm: 25 })
    expect(result.status).toBe("VALID")
  })

  it("rezystancja uziemienia jeszcze niezmierzona (0) -> critical, nie fałszywy pass", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, rezystancjaUziemieniaOhm: 0 })
    expect(result.warnings.some((w) => w.code === "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA")).toBe(true)
  })

  it("KRYTYCZNE — czas zadziałania RCD dokładnie 0,4 s nie wystarcza (wymagane < 0,4 s)", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, czasZadzialaniaRcdS: 0.4 })
    expect(result.warnings.some((w) => w.code === "CZAS-RCD-ZA-DLUGI")).toBe(true)
  })

  it("czas RCD jeszcze niezmierzony (0) -> critical, nie fałszywy pass", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, czasZadzialaniaRcdS: 0 })
    expect(result.warnings.some((w) => w.code === "CZAS-RCD-NIEZMIERZONY")).toBe(true)
  })

  it("KRYTYCZNE — test zwarciowy niepotwierdzony", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, testZwarciowyPotwierdzony: false })
    expect(result.warnings.some((w) => w.code === "TEST-ZWARCIOWY-NIEPOTWIERDZONY")).toBe(true)
  })

  it("KRYTYCZNE — termowizja niepotwierdzona", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, termowizjaPotwierdzona: false })
    expect(result.warnings.some((w) => w.code === "TERMOWIZJA-NIEPOTWIERDZONA")).toBe(true)
  })

  it("INCOMPLETE — nic jeszcze nie wpisano", () => {
    const result = calculatePomiaryPowykonawcze({
      ciagloscPotwierdzona: false,
      rezystancjaIzolacjiMohm: 0,
      celUziemienia: "ochronna",
      rezystancjaUziemieniaOhm: 0,
      czasZadzialaniaRcdS: 0,
      testZwarciowyPotwierdzony: false,
      termowizjaPotwierdzona: false,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemna rezystancja izolacji", () => {
    const result = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, rezystancjaIzolacjiMohm: -1 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): WSZYSTKO-OK i REZYSTANCJA-IZOLACJI-ZA-NISKA mają i18nKey+params, nie message", () => {
    const ok = calculatePomiaryPowykonawcze(WSZYSTKO_OK)
    expect(ok.warnings[0].i18nKey).toBe("WSZYSTKO-OK")
    expect(ok.warnings[0].message).toBeUndefined()

    const izolacja = calculatePomiaryPowykonawcze({ ...WSZYSTKO_OK, rezystancjaIzolacjiMohm: 1 })
    const w = izolacja.warnings.find((x) => x.code === "REZYSTANCJA-IZOLACJI-ZA-NISKA")
    expect(w?.i18nKey).toBe("REZYSTANCJA-IZOLACJI-ZA-NISKA")
    expect(w?.params).toEqual({ wartosc: 1, min: 1 })
    expect(w?.message).toBeUndefined()
  })
})
