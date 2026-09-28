import { describe, expect, it } from "vitest"
import { calculateAwaryjneZrodloCiepla } from "../calculator"
import type { AwaryjneZrodloCieplaInput } from "../input"

const KOMINEK: AwaryjneZrodloCieplaInput = {
  typZrodla: "kominek",
  mocKw: 10,
  plaszczWodny: true,
  mocDoWodyKw: 8,
  godzinyPaleniaNaDobe: 6,
  zapotrzebowanieCieplaKwhDoba: 80,
  sprawnoscProc: 75,
  wartoscOpalowaKwhKg: 4,
}

describe("calculateAwaryjneZrodloCiepla (M8/E1, dawne 6.19)", () => {
  it("płaszcz 8 kW × 6 h = 48 kWh przy 80 kWh/dobę → 60% (skala przykładu źródła); drewno 60 kWh / (0,75 × 4) = 20 kg", () => {
    const w = calculateAwaryjneZrodloCiepla(KOMINEK)
    expect(w.value.cieploDobaKwh).toBeCloseTo(60, 12)
    expect(w.value.cieploDoInstalacjiKwh).toBeCloseTo(48, 12)
    expect(w.value.pokrycieProc).toBeCloseTo(60, 12)
    expect(w.value.paliwoKgDoba).toBeCloseTo(20, 12)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["ZRODLO-NIE-POKRYWA", "ZRODLO-CZUJNIK-CO"])
  })

  it("pełne pokrycie → bez komunikatu o reszcie", () => {
    const w = calculateAwaryjneZrodloCiepla({ ...KOMINEK, zapotrzebowanieCieplaKwhDoba: 48 })
    expect(w.value.pokrycieProc).toBeCloseTo(100, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["ZRODLO-CZUJNIK-CO"])
  })

  it("bez płaszcza wodnego → pokrycie domu nieliczone, info „jedno pomieszczenie”", () => {
    const w = calculateAwaryjneZrodloCiepla({ ...KOMINEK, typZrodla: "koza", plaszczWodny: false })
    expect(w.value.pokrycieProc).toBeNull()
    expect(w.value.cieploDoInstalacjiKwh).toBeNull()
    expect(w.warnings[0]!.code).toBe("ZRODLO-BEZ-PLASZCZA")
  })

  it("bez sprawności lub wartości opałowej → paliwo null (bez zgadywania)", () => {
    expect(calculateAwaryjneZrodloCiepla({ ...KOMINEK, wartoscOpalowaKwhKg: null }).value.paliwoKgDoba).toBeNull()
    expect(calculateAwaryjneZrodloCiepla({ ...KOMINEK, sprawnoscProc: null }).value.paliwoKgDoba).toBeNull()
  })

  it("brak mocy lub czasu palenia → INCOMPLETE", () => {
    expect(calculateAwaryjneZrodloCiepla({ ...KOMINEK, mocKw: null }).status).toBe("INCOMPLETE")
    expect(calculateAwaryjneZrodloCiepla({ ...KOMINEK, godzinyPaleniaNaDobe: 0 }).status).toBe("INCOMPLETE")
  })

  it("moc do wody > moc, 25 h, sprawność 0 → INVALID_INPUT", () => {
    const w = calculateAwaryjneZrodloCiepla({ ...KOMINEK, mocDoWodyKw: 12, godzinyPaleniaNaDobe: 25, sprawnoscProc: 0 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((x) => x.code).sort()).toEqual(
      ["ZRODLO-GODZINY-POZA-DOBA", "ZRODLO-MOC-WODY-WIEKSZA", "ZRODLO-SPRAWNOSC-POZA-ZAKRESEM"].sort(),
    )
  })
})
