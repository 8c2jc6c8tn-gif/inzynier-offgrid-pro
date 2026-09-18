import { describe, expect, it } from "vitest"
import { calculateColdCrankingAmps } from "../calculator"

describe("calculateColdCrankingAmps", () => {
  it("duży prąd rozruchowy (800A) na zimnym pakiecie (13mΩ) -> Vsag=40,8V, falownik się wyłączy (zweryfikowane niezależnie w Pythonie)", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 51.2,
      pradRozruchowyA: 800,
      rezystancjaWewnetrznaMOhm: 13,
      minimalneNapiecieFalownikaV: 44,
    })
    expect(result.value.vSagV).toBeCloseTo(40.8, 9)
    expect(result.value.falownikWytrzyma).toBe(false)
    expect(result.warnings[0].code).toBe("FALOWNIK-SIE-WYLACZY")
  })

  it("mały prąd rozruchowy (50A) na tym samym pakiecie -> Vsag=50,55V, falownik wytrzyma", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 51.2,
      pradRozruchowyA: 50,
      rezystancjaWewnetrznaMOhm: 13,
      minimalneNapiecieFalownikaV: 44,
    })
    expect(result.value.vSagV).toBeCloseTo(50.55, 9)
    expect(result.value.falownikWytrzyma).toBe(true)
    expect(result.warnings[0].code).toBe("FALOWNIK-UTRZYMA-NAPIECIE")
  })

  it("przypadek graniczny: Vsag dokładnie równe Vmin -> falownikWytrzyma=true (próg włącznie)", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 51.2,
      pradRozruchowyA: 553.8461538461538,
      rezystancjaWewnetrznaMOhm: 13,
      minimalneNapiecieFalownikaV: 44,
    })
    expect(result.value.vSagV).toBeCloseTo(44, 6)
    expect(result.value.falownikWytrzyma).toBe(true)
  })

  it("prąd rozruchowy ujemny -> status INVALID_INPUT", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 51.2,
      pradRozruchowyA: -10,
      rezystancjaWewnetrznaMOhm: 13,
      minimalneNapiecieFalownikaV: 44,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (0) -> status INCOMPLETE", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 0,
      pradRozruchowyA: 0,
      rezystancjaWewnetrznaMOhm: 0,
      minimalneNapiecieFalownikaV: 0,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateColdCrankingAmps({
      napiecieOtwartegoObwoduV: 51.2,
      pradRozruchowyA: 800,
      rezystancjaWewnetrznaMOhm: 13,
      minimalneNapiecieFalownikaV: 44,
    })
    expect(result.warnings[0].i18nKey).toBe("FALOWNIK-SIE-WYLACZY")
    expect(result.warnings[0].params).toEqual({ vSag: "40.8", minNap: "44.0" })
    expect(result.warnings[0].message).toBeUndefined()
    expect(result.assumptions).toEqual([{ kod: "REZYSTANCJA-ZMIERZONA-W-TEMPERATURZE" }])
  })
})
