import { describe, expect, it } from "vitest"
import { calculateBilansZapotrzebowania } from "../calculator"
import type { PozycjaBilansu } from "../input"

const staly = (zrodlo: PozycjaBilansu["zrodlo"], kwh: number, wlaczona = true): PozycjaBilansu => ({
  zrodlo,
  wlaczona,
  kwhDobaTypowa: kwh,
  kwhDobaMiesiace: Array(12).fill(kwh),
})

describe("Bilans zapotrzebowania (M2, D-3)", () => {
  it("sums the ticked sources; reference worked by hand: 4,2 + 1,5 + 0,72 = 6,42 kWh/day, +20% = 7,704", () => {
    const r = calculateBilansZapotrzebowania({ pozycje: [staly("odbiorniki", 4.2), staly("bojler", 1.5), staly("wampiry", 0.72)], buforPct: 20 })
    expect(r.status).toBe("VALID")
    expect(r.value.typowaKwh).toBeCloseTo(6.42, 10)
    expect(r.value.typowaZBuforemKwh).toBeCloseTo(7.704, 10)
    expect(r.value.najgorszyKwh).toBeCloseTo(6.42, 10)
  })

  it("an unticked source is not summed; an empty source is listed as missing (info), never guessed", () => {
    const r = calculateBilansZapotrzebowania({
      pozycje: [staly("odbiorniki", 3), staly("wampiry", 1, false), { zrodlo: "bojler", wlaczona: true, kwhDobaTypowa: null, kwhDobaMiesiace: null }],
      buforPct: null,
    })
    expect(r.value.typowaKwh).toBe(3)
    expect(r.value.bezDanych).toEqual(["bojler"])
    expect(r.warnings.map((w) => w.level)).toEqual(["info"])
    expect(r.assumptions).toContainEqual({ kod: "BILANS-ZAL-BEZ-BUFORA" })
  })

  it("a seasonal device raises only its months; the worst month is the one with the highest daily demand", () => {
    const klimatyzacja = Array(12).fill(0)
    for (const m of [5, 6, 7]) klimatyzacja[m] = 3 // June–August
    const r = calculateBilansZapotrzebowania({
      pozycje: [staly("odbiorniki", 5), { zrodlo: "sezonowe", wlaczona: true, kwhDobaTypowa: 0, kwhDobaMiesiace: klimatyzacja }],
      buforPct: 0,
    })
    expect(r.value.typowaKwh).toBe(5)
    expect(r.value.najgorszyKwh).toBe(8)
    expect(r.value.najgorszyMiesiac).toBe(5)
    expect(r.assumptions).toContainEqual({ kod: "BILANS-ZAL-SEZONOWE" })
  })

  it("nothing to sum → INCOMPLETE; a negative value or a wrong month count → INVALID_INPUT", () => {
    expect(calculateBilansZapotrzebowania({ pozycje: [], buforPct: null }).status).toBe("INCOMPLETE")
    expect(calculateBilansZapotrzebowania({ pozycje: [staly("bojler", -1)], buforPct: null }).status).toBe("INVALID_INPUT")
    expect(
      calculateBilansZapotrzebowania({ pozycje: [{ zrodlo: "bojler", wlaczona: true, kwhDobaTypowa: 1, kwhDobaMiesiace: [1, 2] }], buforPct: null }).status,
    ).toBe("INVALID_INPUT")
    expect(calculateBilansZapotrzebowania({ pozycje: [staly("bojler", 1)], buforPct: -5 }).status).toBe("INVALID_INPUT")
  })
})
