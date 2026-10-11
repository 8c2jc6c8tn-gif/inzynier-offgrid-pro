import { describe, expect, it } from "vitest"
import { calculateLadowanieZRegulatora } from "../calculator"
import type { LadowanieZRegulatoraInput } from "../input"

const PUSTE: LadowanieZRegulatoraInput = {
  mocPaneliW: null,
  napiecieAkumulatoraV: null,
  pojemnoscAh: null,
  maksPradLadowaniaAkumulatoraA: null,
  regulatorPradMaxA: null,
  regulatorMocPvMaxW: null,
  sprawnoscRegulatoraPct: null,
  socOdPct: null,
  socDoPct: null,
}
const wejscie = (p: Partial<LadowanieZRegulatoraInput>): LadowanieZRegulatoraInput => ({ ...PUSTE, ...p })
const zalozenia = (r: ReturnType<typeof calculateLadowanieZRegulatora>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))
const kody = (r: ReturnType<typeof calculateLadowanieZRegulatora>) => r.warnings.map((w) => w.i18nKey)

describe("calculateLadowanieZRegulatora", () => {
  it("is INCOMPLETE without panel power or battery voltage", () => {
    expect(calculateLadowanieZRegulatora(PUSTE).status).toBe("INCOMPLETE")
    expect(calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200 })).status).toBe("INCOMPLETE")
    expect(calculateLadowanieZRegulatora(wejscie({ napiecieAkumulatoraV: 12 })).status).toBe("INCOMPLETE")
  })

  it("gives the panel upper bound 200 W / 12 V = 16.67 A when no limit is known, and says the limits are missing", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12 }))
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value!.pradLadowaniaA).toBeCloseTo(16.6667, 3)
    expect(r.value!.ograniczenie).toBe("panele")
    expect(r.value!.mocLadowaniaW).toBeCloseTo(200, 6)
    expect(kody(r)).toEqual(["LADREG-BRAK-LIMITU-REGULATORA", "LADREG-BRAK-LIMITU-AKUMULATORA"])
    expect(r.value!.cRate).toBeNull()
    expect(r.value!.czasLadowaniaH).toBeNull()
  })

  it("applies the regulator current limit: 200 W / 12 V capped at 10 A", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12, regulatorPradMaxA: 10 }))
    expect(r.value!.pradLadowaniaA).toBe(10)
    expect(r.value!.ograniczenie).toBe("regulator")
    expect(r.value!.pradZPaneliA).toBeCloseTo(16.6667, 3)
  })

  it("does not name the regulator when the panels are the smaller one", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 100, napiecieAkumulatoraV: 12, regulatorPradMaxA: 30, maksPradLadowaniaAkumulatoraA: 20 }))
    expect(r.value!.pradLadowaniaA).toBeCloseTo(8.3333, 3)
    expect(r.value!.ograniczenie).toBe("panele")
    expect(r.status).toBe("VALID")
  })

  it("clips to the battery limit and demands the limit be set in the regulator", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12, regulatorPradMaxA: 30, maksPradLadowaniaAkumulatoraA: 8 }))
    expect(r.value!.pradMozliwyA).toBeCloseTo(16.6667, 3)
    expect(r.value!.pradLadowaniaA).toBe(8)
    expect(r.value!.ograniczenie).toBe("akumulator")
    expect(r.value!.wymagaLimituWRegulatorze).toBe(true)
    const w = r.warnings.find((x) => x.i18nKey === "LADREG-PRAD-PONAD-LIMIT-AKUMULATORA")!
    expect(w.params).toEqual({ prad: 16.7, limit: 8 })
  })

  it("cuts panel power above the regulator PV input limit: 200 W on a 150 W input at 12 V = 12.5 A", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12, regulatorMocPvMaxW: 150, regulatorPradMaxA: 30, maksPradLadowaniaAkumulatoraA: 30 }))
    expect(r.value!.mocPrzyjetaW).toBe(150)
    expect(r.value!.nadmiarMocyW).toBe(50)
    expect(r.value!.pradLadowaniaA).toBeCloseTo(12.5, 6)
    expect(kody(r)).toEqual(["LADREG-MOC-PANELI-PONAD-LIMIT"])
  })

  it("takes the regulator efficiency into account only when entered: 200 W · 0.95 / 12 V = 15.83 A", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12, sprawnoscRegulatoraPct: 95 }))
    expect(r.value!.pradLadowaniaA).toBeCloseTo(15.8333, 3)
    expect(zalozenia(r)).toContain("LADREG-ZAL-SPRAWNOSC")
    const bez = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 200, napiecieAkumulatoraV: 12 }))
    expect(zalozenia(bez)).toContain("LADREG-ZAL-BEZ-STRAT")
  })

  it("computes C-rate, energy and time: 100 Ah, 20→80 % at 10 A = 60 Ah = 720 Wh = 6 h, C/10", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 400, napiecieAkumulatoraV: 12, regulatorPradMaxA: 10, maksPradLadowaniaAkumulatoraA: 20, pojemnoscAh: 100, socOdPct: 20, socDoPct: 80 }))
    expect(r.value!.pradLadowaniaA).toBe(10)
    expect(r.value!.cRate).toBeCloseTo(0.1, 9)
    expect(r.value!.energiaDoAkumulatoraWh).toBeCloseTo(720, 6)
    expect(r.value!.czasLadowaniaH).toBeCloseTo(6, 9)
    expect(r.status).toBe("VALID")
    expect(zalozenia(r)).toContain("LADREG-ZAL-STALY-PRAD")
  })

  it("gives C-rate but no time without a SOC range", () => {
    const r = calculateLadowanieZRegulatora(wejscie({ mocPaneliW: 120, napiecieAkumulatoraV: 12, pojemnoscAh: 100 }))
    expect(r.value!.cRate).toBeCloseTo(0.1, 9)
    expect(r.value!.czasLadowaniaH).toBeNull()
    expect(r.value!.energiaDoAkumulatoraWh).toBeNull()
  })

  it.each([
    ["negative panel power", { mocPaneliW: -1, napiecieAkumulatoraV: 12 }, "LADREG-WARTOSC-UJEMNA"],
    ["zero battery voltage", { mocPaneliW: 200, napiecieAkumulatoraV: 0 }, "LADREG-WARTOSC-NIEDODATNIA"],
    ["zero regulator current", { mocPaneliW: 200, napiecieAkumulatoraV: 12, regulatorPradMaxA: 0 }, "LADREG-WARTOSC-NIEDODATNIA"],
    ["efficiency above 100", { mocPaneliW: 200, napiecieAkumulatoraV: 12, sprawnoscRegulatoraPct: 101 }, "LADREG-WARTOSC-POZA-ZAKRESEM"],
    ["SOC above 100", { mocPaneliW: 200, napiecieAkumulatoraV: 12, socOdPct: 10, socDoPct: 120 }, "LADREG-WARTOSC-POZA-ZAKRESEM"],
    ["SOC from not below SOC to", { mocPaneliW: 200, napiecieAkumulatoraV: 12, socOdPct: 80, socDoPct: 80 }, "LADREG-WARTOSC-POZA-ZAKRESEM"],
    ["non-finite power", { mocPaneliW: Number.NaN, napiecieAkumulatoraV: 12 }, "LADREG-WARTOSC-UJEMNA"],
  ] as const)("rejects %s", (_nazwa, pola, kod) => {
    const r = calculateLadowanieZRegulatora(wejscie(pola))
    expect(r.status).toBe("INVALID_INPUT")
    expect(kody(r)).toContain(kod)
  })
})
