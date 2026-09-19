import { describe, expect, it } from "vitest"
import { calculateWylaczniki } from "../calculator"

describe("calculateWylaczniki", () => {
  it("przykład źródła: obwód gniazd, silniki, typ A, 30mA -> VALID", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: true,
      zainstalowanyTyp: "A",
      celOchrony: "osob",
      progMa: 30,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.progWymaganyMa).toBe(30)
  })

  it("przykład źródła: obwód główny, falownik hybrydowy, typ B, 300mA -> VALID", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: true,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "B",
      celOchrony: "pozarowa",
      progMa: 300,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.progWymaganyMa).toBe(300)
  })

  it("KRYTYCZNE — falownik hybrydowy wymaga typu B, zainstalowany typ A", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: true,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "A",
      celOchrony: "pozarowa",
      progMa: 300,
    })
    expect(result.warnings.some((w) => w.code === "WYMAGANY-TYP-B")).toBe(true)
  })

  it("KRYTYCZNE — silniki wymagają minimum typu A, zainstalowany AC", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: true,
      zainstalowanyTyp: "AC",
      celOchrony: "osob",
      progMa: 30,
    })
    expect(result.warnings.some((w) => w.code === "WYMAGANY-TYP-A-MINIMUM")).toBe(true)
  })

  it("KRYTYCZNE — próg 100mA za wysoki dla ochrony osób (wymagane 30mA)", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "A",
      celOchrony: "osob",
      progMa: 100,
    })
    expect(result.warnings.some((w) => w.code === "PROG-POWYZEJ-OCHRONY-OSOB")).toBe(true)
  })

  it("KRYTYCZNE — próg 500mA za wysoki dla ochrony przeciwpożarowej (wymagane 300mA)", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "A",
      celOchrony: "pozarowa",
      progMa: 500,
    })
    expect(result.warnings.some((w) => w.code === "PROG-POWYZEJ-OCHRONY-POZAROWEJ")).toBe(true)
  })

  it("INCOMPLETE — typ RCD niewybrany", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: null,
      celOchrony: "osob",
      progMa: 30,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny próg", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: false,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "A",
      celOchrony: "osob",
      progMa: -5,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): WYMAGANY-TYP-B ma i18nKey+params, założenie to {kod}, nie string", () => {
    const result = calculateWylaczniki({
      falownikHybrydowy: true,
      odbiornikiZSilnikami: false,
      zainstalowanyTyp: "A",
      celOchrony: "pozarowa",
      progMa: 300,
    })
    const w = result.warnings.find((x) => x.code === "WYMAGANY-TYP-B")
    expect(w?.i18nKey).toBe("WYMAGANY-TYP-B")
    expect(w?.params).toEqual({ typ: "A" })
    expect(w?.message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "TYP-RCD-MINIMALNY-NIE-PODANY" }])
  })
})
