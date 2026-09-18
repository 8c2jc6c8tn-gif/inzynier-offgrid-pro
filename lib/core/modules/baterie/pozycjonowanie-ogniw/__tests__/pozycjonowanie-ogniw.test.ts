import { describe, expect, it } from "vitest"
import { calculatePozycjonowanieOgniw } from "../calculator"

describe("calculatePozycjonowanieOgniw", () => {
  it("VALID — docisk w zakresie, luz zostawiony", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: 350, luzNaPeczenie: true })
    expect(result.status).toBe("VALID")
    expect(result.value.wZakresie).toBe(true)
    expect(result.warnings.some((w) => w.code === "DOCISK-OK")).toBe(true)
  })

  it("granica: 300kgf i 400kgf mieszczą się w zakresie (włącznie)", () => {
    const dolna = calculatePozycjonowanieOgniw({ dociskKgf: 300, luzNaPeczenie: true })
    const gorna = calculatePozycjonowanieOgniw({ dociskKgf: 400, luzNaPeczenie: true })
    expect(dolna.value.wZakresie).toBe(true)
    expect(gorna.value.wZakresie).toBe(true)
  })

  it("VALID_WITH_WARNINGS — docisk za mały (krytyczne)", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: 200, luzNaPeczenie: true })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const w = result.warnings.find((w) => w.code === "DOCISK-ZA-MALY")
    expect(w?.level).toBe("critical")
  })

  it("VALID_WITH_WARNINGS — docisk za duży (krytyczne)", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: 500, luzNaPeczenie: true })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    const w = result.warnings.find((w) => w.code === "DOCISK-ZA-DUZY")
    expect(w?.level).toBe("critical")
  })

  it("VALID_WITH_WARNINGS — docisk w zakresie, ale brak luzu na pęcznienie", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: 350, luzNaPeczenie: false })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.warnings.some((w) => w.code === "BRAK-LUZU-NA-PECZNIENIE")).toBe(true)
  })

  it("INCOMPLETE — docisk jeszcze nie wpisany (0)", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: 0, luzNaPeczenie: false })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — ujemny docisk", () => {
    const result = calculatePozycjonowanieOgniw({ dociskKgf: -50, luzNaPeczenie: true })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia zwracają i18nKey/params, nie message", () => {
    const ok = calculatePozycjonowanieOgniw({ dociskKgf: 350, luzNaPeczenie: true })
    const okWarning = ok.warnings.find((w) => w.code === "DOCISK-OK")
    expect(okWarning?.i18nKey).toBe("DOCISK-OK")
    expect(okWarning?.params).toEqual({ docisk: 350, min: 300, max: 400 })
    expect(okWarning?.message).toBeUndefined()

    const zaMaly = calculatePozycjonowanieOgniw({ dociskKgf: 200, luzNaPeczenie: true })
    expect(zaMaly.warnings.find((w) => w.code === "DOCISK-ZA-MALY")?.i18nKey).toBe("DOCISK-ZA-MALY")

    const zaDuzy = calculatePozycjonowanieOgniw({ dociskKgf: 500, luzNaPeczenie: true })
    expect(zaDuzy.warnings.find((w) => w.code === "DOCISK-ZA-DUZY")?.i18nKey).toBe("DOCISK-ZA-DUZY")

    const brakLuzu = calculatePozycjonowanieOgniw({ dociskKgf: 350, luzNaPeczenie: false })
    expect(brakLuzu.warnings.find((w) => w.code === "BRAK-LUZU-NA-PECZNIENIE")?.i18nKey).toBe("BRAK-LUZU-NA-PECZNIENIE")

    const ujemny = calculatePozycjonowanieOgniw({ dociskKgf: -50, luzNaPeczenie: true })
    expect(ujemny.warnings[0].i18nKey).toBe("DOCISK-UJEMNY")
  })
})
