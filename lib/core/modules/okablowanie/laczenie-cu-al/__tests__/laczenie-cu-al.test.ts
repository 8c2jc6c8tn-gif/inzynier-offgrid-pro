import { describe, expect, it } from "vitest"
import { calculateLaczenieCuAl } from "../calculator"

describe("calculateLaczenieCuAl", () => {
  it("Cu+Al bez złączki bimetalicznej -> KRYTYCZNE, korozja galwaniczna", () => {
    const result = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Al",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.bezpieczna).toBe(false)
    expect(result.warnings[0].code).toBe("KOROZJA-GALWANICZNA-CU-AL")
  })

  it("Cu+Al ze złączką bimetaliczną i pastą -> VALID, zalecane", () => {
    const result = calculateLaczenieCuAl({
      material1: "Al",
      material2: "Cu",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: true,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.bezpieczna).toBe(true)
    expect(result.warnings[0].code).toBe("PARA-METALI-OK")
  })

  it("Stal ocynkowana + Cu bez podkładki -> ostrzeżenie (warning), nie krytyczne", () => {
    const result = calculateLaczenieCuAl({
      material1: "stal-ocynkowana",
      material2: "Cu",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.warnings[0].code).toBe("WYMAGA-PODKLADKI-I-SMARU")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("Stal nierdzewna + Al, środowisko suche -> VALID, OK", () => {
    const result = calculateLaczenieCuAl({
      material1: "stal-nierdzewna",
      material2: "Al",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.bezpieczna).toBe(true)
  })

  it("Stal nierdzewna + Al, środowisko słone -> kontroluj okresowo (warning)", () => {
    const result = calculateLaczenieCuAl({
      material1: "stal-nierdzewna",
      material2: "Al",
      srodowisko: "slone",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.warnings[0].code).toBe("KONTROLUJ-OKRESOWO")
    expect(result.warnings[0].level).toBe("warning")
  })

  it("OUT_OF_SCOPE — stal nierdzewna + Al w środowisku wilgotnym (nie ocenione przez źródło)", () => {
    const result = calculateLaczenieCuAl({
      material1: "stal-nierdzewna",
      material2: "Al",
      srodowisko: "wilgotne",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("OUT_OF_SCOPE — para nieobecna w źródle (Cu+Cu)", () => {
    const result = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Cu",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("OUT_OF_SCOPE")
  })

  it("przelicza przekrój Al = Cu × 1,6 (10mm² -> 16mm²)", () => {
    const result = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Al",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: true,
      maPodkladkeISmar: false,
      przekrojCuMm2: 10,
    })
    expect(result.value.wymaganyPrzekrojAlMm2).toBeCloseTo(16, 9)
  })

  it("INCOMPLETE — materiały niewybrane", () => {
    const result = calculateLaczenieCuAl({
      material1: null,
      material2: null,
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny przekrój Cu", () => {
    const result = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Al",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: true,
      maPodkladkeISmar: false,
      przekrojCuMm2: -5,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): PARA-METALI-OK ma i18nKey+params z etykietą, nie message", () => {
    const result = calculateLaczenieCuAl({
      material1: "Al",
      material2: "Cu",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: true,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(result.warnings[0].i18nKey).toBe("PARA-METALI-OK")
    expect(result.warnings[0].params).toEqual({ etykieta: "Aluminium (Al) + Miedź (Cu)" })
    expect(result.warnings[0].message).toBeUndefined()
  })

  it("i18n (17.2): KOROZJA-GALWANICZNA-CU-AL, PARA-POZA-ZAKRESEM mają i18nKey, nie message", () => {
    const korozja = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Al",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(korozja.warnings[0].i18nKey).toBe("KOROZJA-GALWANICZNA-CU-AL")
    expect(korozja.warnings[0].message).toBeUndefined()

    const pozaZakresem = calculateLaczenieCuAl({
      material1: "Cu",
      material2: "Cu",
      srodowisko: "suche",
      maZlaczkeBimetaliczna: false,
      maPodkladkeISmar: false,
      przekrojCuMm2: 0,
    })
    expect(pozaZakresem.warnings[0].i18nKey).toBe("PARA-POZA-ZAKRESEM")
    expect(pozaZakresem.warnings[0].params).toEqual({ etykieta: "Miedź (Cu) + Miedź (Cu)" })
    expect(pozaZakresem.warnings[0].message).toBeUndefined()
  })
})
