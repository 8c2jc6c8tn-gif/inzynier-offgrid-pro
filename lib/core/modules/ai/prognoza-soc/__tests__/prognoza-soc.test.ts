import { describe, expect, it } from "vitest"
import { calculatePrognozaSoc } from "../calculator"
import type { PrognozaSocInput } from "../input"

const PUSTY_PROFIL = Array.from({ length: 8 }, () => null) as (number | null)[]
const PUSTE: PrognozaSocInput = {
  pojemnoscUzytecznaKwh: null,
  socStartPct: null,
  socMinPct: null,
  socMaksPct: null,
  sprawnoscLadowaniaPct: null,
  sprawnoscRozladowaniaPct: null,
  maksMocLadowaniaKw: null,
  maksMocRozladowaniaKw: null,
  godzinaStartu: null,
  horyzontH: null,
  produkcjaKw: PUSTY_PROFIL,
  zuzycieKw: PUSTY_PROFIL,
  wspolczynnikDniPct: [null, null, null],
}
const wejscie = (p: Partial<PrognozaSocInput>): PrognozaSocInput => ({ ...PUSTE, ...p })
const kody = (r: ReturnType<typeof calculatePrognozaSoc>) => r.warnings.map((w) => w.i18nKey)
/** Production kW in windows 00–03 … 21–24 and the consumption — chosen so that the energy bookkeeping is easy to follow by hand. */
const PROD = [0, 0, 1, 2, 4, 2, 0, 0]
const ZUZ = [0.5, 0.5, 0.5, 1, 1, 1, 2, 1]
/** 10 kWh battery, starts at 50 %, floor 10 % (= 1 kWh), midnight start, 24 h. */
const BAZA = wejscie({
  pojemnoscUzytecznaKwh: 10,
  socStartPct: 50,
  socMinPct: 10,
  godzinaStartu: 0,
  horyzontH: 24,
  produkcjaKw: PROD,
  zuzycieKw: ZUZ,
})

describe("calculatePrognozaSoc", () => {
  it("is INCOMPLETE until the battery, the time range and all 16 profile values are entered", () => {
    expect(calculatePrognozaSoc(PUSTE).status).toBe("INCOMPLETE")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, produkcjaKw: [0, 0, 1, 2, 4, 2, 0, null] })).status).toBe("INCOMPLETE")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: null })).status).toBe("INCOMPLETE")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, socMinPct: null })).status).toBe("INCOMPLETE")
  })

  it("follows the hand-calculated day: 5 → 2 → 3.5 → 6.5 → 10 (full) → 1 kWh, 8.5 kWh of surplus, reaches the floor at hour 24", () => {
    const r = calculatePrognozaSoc(BAZA)
    const e = r.value!.socSeriaPct.map((p) => p / 10) // kWh = % of 10 kWh / 10
    expect(r.value!.socSeriaPct).toHaveLength(25)
    expect(e[0]).toBeCloseTo(5, 9)
    expect(e[6]).toBeCloseTo(2, 9)
    expect(e[9]).toBeCloseTo(3.5, 9)
    expect(e[12]).toBeCloseTo(6.5, 9)
    expect(e[13]).toBeCloseTo(9.5, 9)
    expect(e[14]).toBeCloseTo(10, 9)
    expect(e[18]).toBeCloseTo(10, 9)
    expect(e[24]).toBeCloseTo(1, 9)
    expect(r.value!.socKoncowePct).toBeCloseTo(10, 9)
    expect(r.value!.nadmiarKwh).toBeCloseTo(8.5, 9)
    expect(r.value!.niedoborKwh).toBe(0)
    expect(r.value!.pierwszeMinimumT).toBe(24)
    expect(r.value!.pierwszeMaksimumT).toBe(14)
    expect(r.value!.maksSocPct).toBeCloseTo(100, 9)
    expect(r.value!.minSocPct).toBeCloseTo(10, 9)
    expect(r.value!.produkcjaLacznaKwh).toBeCloseTo(27, 9)
    expect(r.value!.zuzycieLaczneKwh).toBeCloseTo(22.5, 9)
    expect(kody(r)).toEqual(["PROGSOC-OSIAGNIE-MINIMUM", "PROGSOC-NADWYZKA", "PROGSOC-BRAK-SPRAWNOSCI"])
  })

  it("builds the timeline: discharge 0–6 h, charge 6–13 h, surplus 13–18 h, discharge 18–24 h; peaks at 12 h (PV) and 18 h (load)", () => {
    const r = calculatePrognozaSoc(BAZA)
    expect(r.value!.segmenty).toEqual([
      { typ: "rozladowanie", odT: 0, doT: 6 },
      { typ: "ladowanie", odT: 6, doT: 13 },
      { typ: "nadwyzka", odT: 13, doT: 18 },
      { typ: "rozladowanie", odT: 18, doT: 24 },
    ])
    expect(r.value!.szczytProdukcjiT).toBe(12)
    expect(r.value!.szczytZuzyciaT).toBe(18)
  })

  it("a second day without sun (PV share 0 %) empties the battery to the floor and leaves 22.5 kWh of load uncovered for 24 h", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 48, wspolczynnikDniPct: [100, 0, null] }))
    expect(r.value!.niedoborKwh).toBeCloseTo(22.5, 9)
    expect(r.value!.godzinyBezZasilania).toBe(24)
    expect(r.value!.pierwszeMinimumT).toBe(24)
    expect(r.value!.segmenty[r.value!.segmenty.length - 1]).toEqual({ typ: "brak", odT: 24, doT: 48 })
    expect(kody(r)).toContain("PROGSOC-NIEDOBOR")
  })

  it("scales only the PV production by the day share: 50 % on day 2 → 13.5 kWh instead of 27", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 48, wspolczynnikDniPct: [100, 50, null] }))
    expect(r.value!.produkcjaLacznaKwh).toBeCloseTo(27 + 13.5, 9)
    expect(r.value!.zuzycieLaczneKwh).toBeCloseTo(45, 9)
  })

  it("says the profile repeats when no day share is entered for a longer forecast", () => {
    expect(kody(calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 48 })))).toContain("PROGSOC-BRAK-WSPOLCZYNNIKOW")
    expect(kody(calculatePrognozaSoc(BAZA))).not.toContain("PROGSOC-BRAK-WSPOLCZYNNIKOW")
  })

  it("applies charge efficiency 90 %: 2 kW for 1 h stores 1.8 kWh → 68 %", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 1, socMinPct: 0, produkcjaKw: [2, 0, 0, 0, 0, 0, 0, 0], zuzycieKw: [0, 0, 0, 0, 0, 0, 0, 0], sprawnoscLadowaniaPct: 90, sprawnoscRozladowaniaPct: 100 }))
    expect(r.value!.socKoncowePct).toBeCloseTo(68, 9)
  })

  it("applies discharge efficiency 80 %: 1.6 kW for 1 h takes 2 kWh from the battery → 30 %", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 1, socMinPct: 0, produkcjaKw: [0, 0, 0, 0, 0, 0, 0, 0], zuzycieKw: [1.6, 0, 0, 0, 0, 0, 0, 0], sprawnoscLadowaniaPct: 100, sprawnoscRozladowaniaPct: 80 }))
    expect(r.value!.socKoncowePct).toBeCloseTo(30, 9)
  })

  it("limits the charge power: surplus 3 kW with a 1 kW limit stores 1 kWh and wastes 2 kWh", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 1, socMinPct: 0, produkcjaKw: [3, 0, 0, 0, 0, 0, 0, 0], zuzycieKw: [0, 0, 0, 0, 0, 0, 0, 0], maksMocLadowaniaKw: 1 }))
    expect(r.value!.socKoncowePct).toBeCloseTo(60, 9)
    expect(r.value!.nadmiarKwh).toBeCloseTo(2, 9)
  })

  it("limits the discharge power: 2 kW load with a 1 kW limit serves 1 kWh and leaves 1 kWh uncovered", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 1, socMinPct: 0, produkcjaKw: [0, 0, 0, 0, 0, 0, 0, 0], zuzycieKw: [2, 0, 0, 0, 0, 0, 0, 0], maksMocRozladowaniaKw: 1 }))
    expect(r.value!.socKoncowePct).toBeCloseTo(40, 9)
    expect(r.value!.niedoborKwh).toBeCloseTo(1, 9)
    expect(r.value!.godzinyBezZasilania).toBe(1)
  })

  it("wraps the clock past midnight: start 22:00, 4 h → windows 21–24, 21–24, 00–03, 00–03", () => {
    const zuz = [2, 0, 0, 0, 0, 0, 0, 1]
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, socStartPct: 100, socMinPct: 0, godzinaStartu: 22, horyzontH: 4, produkcjaKw: [0, 0, 0, 0, 0, 0, 0, 0], zuzycieKw: zuz }))
    expect(r.value!.socSeriaPct.map((p) => Math.round(p))).toEqual([100, 90, 80, 60, 40])
  })

  it("warns when the start is below the floor", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, socStartPct: 5 }))
    expect(kody(r)).toContain("PROGSOC-START-PONIZEJ-MINIMUM")
    expect(r.value!.pierwszeMinimumT).toBe(0)
  })

  it("uses the top limit when the user sets one: max 80 % wastes what does not fit", () => {
    const r = calculatePrognozaSoc(wejscie({ ...BAZA, socMaksPct: 80 }))
    expect(r.value!.maksSocPct).toBeCloseTo(80, 9)
    expect(r.value!.nadmiarKwh).toBeGreaterThan(8.5)
  })

  it("rejects invalid input: negative power, SoC outside 0–100, floor not below the ceiling, bad hour and horizon", () => {
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, produkcjaKw: [-1, 0, 1, 2, 4, 2, 0, 0] })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, socStartPct: 120 })).status).toBe("INVALID_INPUT")
    const mm = calculatePrognozaSoc(wejscie({ ...BAZA, socMinPct: 90, socMaksPct: 80 }))
    expect(mm.warnings[0].i18nKey).toBe("PROGSOC-MIN-NIE-MNIEJSZE-OD-MAX")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, godzinaStartu: 24 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, horyzontH: 73 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, pojemnoscUzytecznaKwh: 0 })).warnings[0].i18nKey).toBe("PROGSOC-WARTOSC-NIEDODATNIA")
    expect(calculatePrognozaSoc(wejscie({ ...BAZA, sprawnoscLadowaniaPct: 0 })).status).toBe("INVALID_INPUT")
  })

  it("does not mutate the input", () => {
    const wej = wejscie({ ...BAZA, wspolczynnikDniPct: [100, 50, null] })
    const kopia = JSON.stringify(wej)
    calculatePrognozaSoc(wej)
    expect(JSON.stringify(wej)).toBe(kopia)
  })
})
