import { describe, expect, it } from "vitest"
import { calculateNapiecieOdciecia } from "../calculator"

describe("calculateNapiecieOdciecia", () => {
  it("punkt kalibracji 1 ze źródła: 42,0V/16S -> 100% DoD, 2000 cykli", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 42.0, liczbaOgniwSzeregowo: 16 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieOgniwaV).toBeCloseTo(2.625, 9)
    expect(result.value.dodPct).toBeCloseTo(100, 6)
    expect(result.value.cykleZycia).toBe(2000)
    expect(result.value.wewnatrzKalibracji).toBe(true)
  })

  it("punkt kalibracji 2 ze źródła: 44,0V/16S -> 80% DoD, 5000 cykli (+150% życia)", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 44.0, liczbaOgniwSzeregowo: 16 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieOgniwaV).toBeCloseTo(2.75, 9)
    expect(result.value.dodPct).toBeCloseTo(80, 6)
    expect(result.value.cykleZycia).toBe(5000)
    const wzrostProcent = (result.value.cykleZycia / 2000 - 1) * 100
    expect(wzrostProcent).toBeCloseTo(150, 6)
  })

  it("napięcie ogniwa poza kalibracją (bardzo niskie, głębokie rozładowanie) -> ostrzeżenie ekstrapolacji", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 38.4, liczbaOgniwSzeregowo: 16 })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.wewnatrzKalibracji).toBe(false)
    expect(result.value.dodPct).toBe(100)
    expect(result.warnings.map((w) => w.code)).toContain("EKSTRAPOLACJA-POZA-KALIBRACJA")
  })

  it("inna liczba ogniw (8S/24V) generalizuje po napięciu na ogniwo", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 21.0, liczbaOgniwSzeregowo: 8 })
    expect(result.status).toBe("VALID")
    expect(result.value.napiecieOgniwaV).toBeCloseTo(2.625, 9)
    expect(result.value.dodPct).toBeCloseTo(100, 6)
  })

  it("napięcie odcięcia ujemne -> status INVALID_INPUT", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: -1, liczbaOgniwSzeregowo: 16 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("liczba ogniw niecałkowita -> status INVALID_INPUT", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 42, liczbaOgniwSzeregowo: 15.5 })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("brak wpisanych danych (napiecieOdcieciaV=0) -> status INCOMPLETE", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 0, liczbaOgniwSzeregowo: 0 })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("i18n (17.2): ostrzeżenie i assumption zwracają i18nKey/kod, nie gotowy tekst", () => {
    const result = calculateNapiecieOdciecia({ napiecieOdcieciaV: 38.4, liczbaOgniwSzeregowo: 16 })
    expect(result.warnings[0]?.message).toBeUndefined()
    expect(result.warnings[0]?.i18nKey).toBe("EKSTRAPOLACJA-POZA-KALIBRACJA")
    expect(result.assumptions[0]).toEqual({ kod: "MODEL-LIFEPO4-DWA-PUNKTY-KALIBRACJI" })
  })
})
