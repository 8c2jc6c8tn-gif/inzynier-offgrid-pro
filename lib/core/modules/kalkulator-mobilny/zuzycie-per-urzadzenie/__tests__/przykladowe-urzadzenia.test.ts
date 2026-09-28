import { describe, expect, it } from "vitest"
import { PRZYKLADOWE_URZADZENIA, znajdzPrzyklad } from "../przykladowe-urzadzenia"

describe("PRZYKLADOWE_URZADZENIA (M12/E11, D33 — podpowiedź, nie dane katalogowe)", () => {
  it("moce dodatnie, nazwy unikalne", () => {
    expect(PRZYKLADOWE_URZADZENIA.every((p) => p.mocW > 0)).toBe(true)
    const nazwy = PRZYKLADOWE_URZADZENIA.map((p) => p.nazwa.toLocaleLowerCase("pl-PL"))
    expect(new Set(nazwy).size).toBe(nazwy.length)
  })

  it("przykład ze źródła: lodówka turystyczna 45 W, cykliczna", () => {
    expect(znajdzPrzyklad("  lodówka turystyczna sprężarkowa 12 v ")).toEqual({
      nazwa: "Lodówka turystyczna sprężarkowa 12 V",
      mocW: 45,
      cykliczne: true,
    })
  })

  it("nieznana albo pusta nazwa → null (bez zgadywania)", () => {
    expect(znajdzPrzyklad("moja lodówka")).toBeNull()
    expect(znajdzPrzyklad("")).toBeNull()
  })
})
