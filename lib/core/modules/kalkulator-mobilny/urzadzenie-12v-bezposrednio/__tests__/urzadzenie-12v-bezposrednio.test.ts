import { describe, expect, it } from "vitest"
import { calculateUrzadzenie12vBezposrednio } from "../calculator"
import type { Urzadzenie12vBezposrednioInput } from "../input"

const BAZA: Urzadzenie12vBezposrednioInput = {
  napiecieSystemuV: 12,
  napiecieUrzadzeniaV: 12,
  tolerancjaPct: 5,
  przezStabilizator: false,
}

describe("calculateUrzadzenie12vBezposrednio (M12/E27, dawne 8.54)", () => {
  it("przykład źródła: 12,0 V ±5% → max 12,6 V < 14,5 V przy ładowaniu → 🔴", () => {
    const w = calculateUrzadzenie12vBezposrednio(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.value.urzadzenieMaxV).toBeCloseTo(12.6, 12)
    expect(w.value.urzadzenieMinV).toBeCloseTo(11.4, 12)
    expect(w.value.zakresPokryty).toBe(false)
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["U12-PRZEPIECIE-PRZY-LADOWANIU", "critical"],
      ["U12-ZA-NISKIE-PRZY-ROZLADOWANIU", "info"],
    ])
  })

  it("szeroki zakres 12 V ±25% (9–15 V) → cały zakres akumulatora pokryty, VALID bez ostrzeżeń", () => {
    const w = calculateUrzadzenie12vBezposrednio({ ...BAZA, tolerancjaPct: 25 })
    expect(w.status).toBe("VALID")
    expect(w.value.zakresPokryty).toBe(true)
    expect(w.warnings).toEqual([])
  })

  it("granica: max urządzenia dokładnie 14,5 V → bez 🔴 (nie przekracza)", () => {
    const w = calculateUrzadzenie12vBezposrednio({ ...BAZA, napiecieUrzadzeniaV: 12.5, tolerancjaPct: 16 })
    expect(w.value.urzadzenieMaxV).toBeCloseTo(14.5, 12)
    expect(w.warnings.some((x) => x.level === "critical")).toBe(false)
  })

  it("tylko dolna granica za wysoka → info nie podnosi statusu (Dyrektywa #6)", () => {
    const w = calculateUrzadzenie12vBezposrednio({ ...BAZA, napiecieUrzadzeniaV: 13, tolerancjaPct: 12 })
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["U12-ZA-NISKIE-PRZY-ROZLADOWANIU"])
  })

  it("24 V: zakres akumulatora 22–29 V", () => {
    const w = calculateUrzadzenie12vBezposrednio({ ...BAZA, napiecieSystemuV: 24, napiecieUrzadzeniaV: 24, tolerancjaPct: 25 })
    expect(w.value.akuMinV).toBe(22)
    expect(w.value.akuMaxV).toBe(29)
    expect(w.status).toBe("VALID")
  })

  it("przez stabilizator → bez 🔴, tylko info o zakresie wejścia stabilizatora", () => {
    const w = calculateUrzadzenie12vBezposrednio({ ...BAZA, przezStabilizator: true })
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["U12-PRZEZ-STABILIZATOR"])
  })

  it("brak tolerancji lub napięcia → INCOMPLETE; tolerancja 0% jest legalna", () => {
    expect(calculateUrzadzenie12vBezposrednio({ ...BAZA, tolerancjaPct: null }).status).toBe("INCOMPLETE")
    expect(calculateUrzadzenie12vBezposrednio({ ...BAZA, napiecieSystemuV: 0 }).status).toBe("INCOMPLETE")
    expect(calculateUrzadzenie12vBezposrednio({ ...BAZA, tolerancjaPct: 0 }).status).toBe("VALID_WITH_WARNINGS")
  })

  it("tolerancja ≥ 100% lub ujemne napięcie → INVALID_INPUT", () => {
    expect(calculateUrzadzenie12vBezposrednio({ ...BAZA, tolerancjaPct: 100 }).status).toBe("INVALID_INPUT")
    expect(calculateUrzadzenie12vBezposrednio({ ...BAZA, napiecieUrzadzeniaV: -1 }).status).toBe("INVALID_INPUT")
  })
})
