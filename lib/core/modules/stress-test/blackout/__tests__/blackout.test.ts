import { describe, expect, it } from "vitest"
import { calculateBlackout } from "../calculator"
import type { BlackoutInput } from "../input"

const BAZA: BlackoutInput = {
  pojemnoscKwh: 50,
  socStartPct: 100,
  socMinPct: 10,
  sprawnoscFalownikaPct: 90,
  zuzycieDoboweKwh: 5,
  dniScenariusza: 14,
  agregatKwhDoba: null,
}

describe("calculateBlackout (M7/E4, dawne 6.4)", () => {
  it("50 kWh, 100→10%, η 90%, 5 kWh/dobę, 14 dni → 40,5 kWh, 8,1 dnia → awaria 9. dnia; brak 29,5 kWh → +36,4 kWh baterii albo −42% zużycia", () => {
    const w = calculateBlackout(BAZA)
    expect(w.value.energiaDostepnaKwh).toBeCloseTo(40.5, 12)
    expect(w.value.dniPrzetrwania).toBeCloseTo(8.1, 12)
    expect(w.value.dzienAwarii).toBe(9)
    expect(w.value.dodatkowaPojemnoscKwh).toBeCloseTo(29.5 / (0.9 * 0.9), 12)
    expect(w.value.redukcjaZuzyciaPct).toBeCloseTo((1 - 40.5 / 14 / 5) * 100, 12)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings[0]!.params).toEqual({ dzien: 9, dni: 14, pojemnosc: 37, redukcja: 43 })
  })

  it("po dodaniu brakującej pojemności system przetrwa dokładnie N dni", () => {
    const dodatkowa = calculateBlackout(BAZA).value.dodatkowaPojemnoscKwh!
    const w = calculateBlackout({ ...BAZA, pojemnoscKwh: 50 + dodatkowa })
    expect(w.value.dniPrzetrwania).toBeCloseTo(14, 9)
  })

  it("po ograniczeniu zużycia o wyliczony procent system przetrwa dokładnie N dni", () => {
    const r = calculateBlackout(BAZA).value.redukcjaZuzyciaPct!
    const w = calculateBlackout({ ...BAZA, zuzycieDoboweKwh: 5 * (1 - r / 100) })
    expect(w.value.dniPrzetrwania).toBeCloseTo(14, 9)
  })

  it("agregat 2 kWh/dobę → deficyt 3 kWh/dobę → 13,5 dnia; agregat ≥ zużycie → przetrwa bez końca", () => {
    expect(calculateBlackout({ ...BAZA, agregatKwhDoba: 2 }).value.dniPrzetrwania).toBeCloseTo(13.5, 12)
    const w = calculateBlackout({ ...BAZA, agregatKwhDoba: 5 })
    expect(w.status).toBe("VALID")
    expect(w.value.dniPrzetrwania).toBeNull()
    expect(w.warnings.map((x) => x.code)).toEqual(["BLACKOUT-SYSTEM-PRZETRWA"])
  })

  it("wystarczająca bateria → VALID, info, zero dodatkowej pojemności", () => {
    const w = calculateBlackout({ ...BAZA, dniScenariusza: 8 })
    expect(w.status).toBe("VALID")
    expect(w.value.dodatkowaPojemnoscKwh).toBe(0)
    expect(w.value.redukcjaZuzyciaPct).toBe(0)
  })

  it("SoC min ≥ start, sprawność 0 → INVALID_INPUT; brak zużycia → INCOMPLETE", () => {
    expect(calculateBlackout({ ...BAZA, socMinPct: 100 }).status).toBe("INVALID_INPUT")
    expect(calculateBlackout({ ...BAZA, sprawnoscFalownikaPct: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateBlackout({ ...BAZA, zuzycieDoboweKwh: null }).status).toBe("INCOMPLETE")
  })
})
