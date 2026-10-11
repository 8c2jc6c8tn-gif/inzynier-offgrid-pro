import { describe, expect, it } from "vitest"
import { calculateMiejsceNaRozbudowe } from "../calculator"
import type { MiejsceNaRozbudoweInput } from "../input"

const PUSTE: MiejsceNaRozbudoweInput = {
  miejsceDlugoscMm: null,
  miejsceSzerokoscMm: null,
  miejsceWysokoscMm: null,
  elementDlugoscMm: null,
  elementSzerokoscMm: null,
  elementWysokoscMm: null,
  odstepMiedzyMm: null,
  marginesPrzyScianieMm: null,
  moznaPietrowac: false,
  planowanaLiczba: null,
}
const wejscie = (p: Partial<MiejsceNaRozbudoweInput>): MiejsceNaRozbudoweInput => ({ ...PUSTE, ...p })
const kody = (r: ReturnType<typeof calculateMiejsceNaRozbudowe>) => r.warnings.map((w) => w.i18nKey)
const zalozenia = (r: ReturnType<typeof calculateMiejsceNaRozbudowe>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))
/** Space 2000 × 1000 mm, element 500 × 400 mm, clearances entered as zeros. */
const BAZA = wejscie({ miejsceDlugoscMm: 2000, miejsceSzerokoscMm: 1000, elementDlugoscMm: 500, elementSzerokoscMm: 400, odstepMiedzyMm: 0, marginesPrzyScianieMm: 0 })

describe("calculateMiejsceNaRozbudowe", () => {
  it("is INCOMPLETE without the horizontal dimensions of the space and the element", () => {
    expect(calculateMiejsceNaRozbudowe(PUSTE).status).toBe("INCOMPLETE")
    expect(calculateMiejsceNaRozbudowe(wejscie({ miejsceDlugoscMm: 2000, miejsceSzerokoscMm: 1000 })).status).toBe("INCOMPLETE")
    expect(calculateMiejsceNaRozbudowe(wejscie({ elementDlugoscMm: 500, elementSzerokoscMm: 400 })).status).toBe("INCOMPLETE")
  })

  it("picks the better orientation: 2000×1000 with 500×400 gives 4·2 = 8 along but 5·2 = 10 across", () => {
    const r = calculateMiejsceNaRozbudowe(BAZA)
    expect(r.status).toBe("VALID")
    expect(r.value!.maksSztuk).toBe(10)
    expect(r.value!.uklad).toBe("wszerz")
    expect(r.value!.kolumny).toBe(5)
    expect(r.value!.rzedy).toBe(2)
    expect(r.value!.warstwy).toBe(1)
    expect(r.value!.wykorzystanieMiejscaPct).toBeCloseTo(100, 6)
  })

  it("keeps the along orientation when it is at least as good (tie)", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, elementDlugoscMm: 500, elementSzerokoscMm: 500 }))
    expect(r.value!.maksSztuk).toBe(8)
    expect(r.value!.uklad).toBe("wzdluz")
  })

  it("subtracts the wall margin on both sides and adds the gap between elements: 1800/800 usable, gap 50 → 4", () => {
    // across: floor((1800+50)/(400+50)) = 4 along the length, floor((800+50)/(500+50)) = 1 → 4; along: 3·1 = 3
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, odstepMiedzyMm: 50, marginesPrzyScianieMm: 100 }))
    expect(r.value!.maksSztuk).toBe(4)
    expect(r.value!.uklad).toBe("wszerz")
  })

  it("treats an exact fit as fitting despite floating-point arithmetic (1000 / 250 = 4)", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceDlugoscMm: 1000, miejsceSzerokoscMm: 250, elementDlugoscMm: 250, elementSzerokoscMm: 250 }))
    expect(r.value!.maksSztuk).toBe(4)
  })

  it("stacks layers only when stacking is allowed and both heights are known: 600 / 200 = 3 layers → 30", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceWysokoscMm: 600, elementWysokoscMm: 200, moznaPietrowac: true }))
    expect(r.value!.warstwy).toBe(3)
    expect(r.value!.maksSztuk).toBe(30)
    const bez = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceWysokoscMm: 600, elementWysokoscMm: 200, moznaPietrowac: false }))
    expect(bez.value!.warstwy).toBe(1)
    expect(bez.value!.maksSztuk).toBe(10)
  })

  it("counts one layer and says so when stacking is on but a height is missing", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, moznaPietrowac: true, elementWysokoscMm: 200 }))
    expect(r.value!.warstwy).toBe(1)
    expect(r.value!.maksSztuk).toBe(10)
    expect(kody(r)).toEqual(["MIEJROZ-PIETROWANIE-BEZ-WYSOKOSCI"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("gives 0 and a warning when the element is taller than the space", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceWysokoscMm: 300, elementWysokoscMm: 400, moznaPietrowac: true }))
    expect(r.value!.maksSztuk).toBe(0)
    expect(kody(r)).toContain("MIEJROZ-ELEMENT-ZA-WYSOKI")
  })

  it("gives 0 and a warning when the element does not fit horizontally in either orientation", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceDlugoscMm: 300, miejsceSzerokoscMm: 300 }))
    expect(r.value!.maksSztuk).toBe(0)
    expect(kody(r)).toEqual(["MIEJROZ-ELEMENT-WIEKSZY-NIZ-MIEJSCE"])
  })

  it("a wall margin that eats the whole space leaves nothing", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, marginesPrzyScianieMm: 500 }))
    expect(r.value!.maksSztuk).toBe(0)
  })

  it("compares a planned number with what fits: 12 planned, 10 fit → 2 missing", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, planowanaLiczba: 12 }))
    expect(r.value!.zmiesciSiePlan).toBe(false)
    expect(r.value!.brakujeSztuk).toBe(2)
    expect(kody(r)).toEqual(["MIEJROZ-PLAN-PONAD-MIEJSCE"])
    const ok = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, planowanaLiczba: 8 }))
    expect(ok.value!.zmiesciSiePlan).toBe(true)
    expect(ok.value!.brakujeSztuk).toBe(0)
    expect(ok.status).toBe("VALID")
  })

  it("leaves the plan fields null without a planned number", () => {
    const r = calculateMiejsceNaRozbudowe(BAZA)
    expect(r.value!.zmiesciSiePlan).toBeNull()
    expect(r.value!.brakujeSztuk).toBeNull()
  })

  it("treats empty clearances as 0, says so and records the assumption", () => {
    const r = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, odstepMiedzyMm: null, marginesPrzyScianieMm: null }))
    expect(r.value!.maksSztuk).toBe(10)
    expect(kody(r)).toEqual(["MIEJROZ-BRAK-ODSTEPOW"])
    expect(zalozenia(r)).toContain("MIEJROZ-ZAL-ODSTEPY-ZERO")
    expect(zalozenia(calculateMiejsceNaRozbudowe(BAZA))).not.toContain("MIEJROZ-ZAL-ODSTEPY-ZERO")
  })

  it("rejects negative and zero dimensions and negative clearances as INVALID_INPUT", () => {
    expect(calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, miejsceDlugoscMm: -1 })).warnings[0].i18nKey).toBe("MIEJROZ-WARTOSC-UJEMNA")
    const zero = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, elementSzerokoscMm: 0 }))
    expect(zero.status).toBe("INVALID_INPUT")
    expect(zero.warnings[0].i18nKey).toBe("MIEJROZ-WARTOSC-NIEDODATNIA")
    expect(calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, odstepMiedzyMm: -5 })).status).toBe("INVALID_INPUT")
    expect(calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, marginesPrzyScianieMm: Number.NaN })).status).toBe("INVALID_INPUT")
  })

  it("rejects a non-integer or zero planned number", () => {
    const u = calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, planowanaLiczba: 2.5 }))
    expect(u.status).toBe("INVALID_INPUT")
    expect(u.warnings[0].i18nKey).toBe("MIEJROZ-LICZBA-NIECALKOWITA")
    expect(calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, planowanaLiczba: 0 })).status).toBe("INVALID_INPUT")
    expect(calculateMiejsceNaRozbudowe(wejscie({ ...BAZA, planowanaLiczba: -1 })).warnings[0].i18nKey).toBe("MIEJROZ-WARTOSC-UJEMNA")
  })

  it("does not mutate the input", () => {
    const wej = wejscie({ ...BAZA, planowanaLiczba: 3 })
    const kopia = JSON.stringify(wej)
    calculateMiejsceNaRozbudowe(wej)
    expect(JSON.stringify(wej)).toBe(kopia)
  })
})
