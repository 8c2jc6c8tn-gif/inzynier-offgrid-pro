import { describe, expect, it } from "vitest"
import { calculatePrognozaMiesieczna } from "../calculator"
import type { PrognozaMiesiecznaInput } from "../input"

const BEZ_HISTORII = Array.from({ length: 12 }, () => null) as (number | null)[]
const PUSTE: PrognozaMiesiecznaInput = { produkcjaHistoriaKwh: BEZ_HISTORII, degradacjaRocznaPct: null, miesiacStartu: null, miesiecyNaprzod: null, odchylenieMeteoPct: null }
const wejscie = (p: Partial<PrognozaMiesiecznaInput>): PrognozaMiesiecznaInput => ({ ...PUSTE, ...p })
/** January 180, February 220, March 350, April 500 kWh; the rest not entered. */
const HISTORIA: (number | null)[] = [180, 220, 350, 500, null, null, null, null, null, null, null, null]
const kody = (r: ReturnType<typeof calculatePrognozaMiesieczna>) => r.warnings.map((w) => w.i18nKey)
const zalozenia = (r: ReturnType<typeof calculatePrognozaMiesieczna>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))

describe("calculatePrognozaMiesieczna", () => {
  it("is INCOMPLETE without history, a start month or a horizon", () => {
    expect(calculatePrognozaMiesieczna(PUSTE).status).toBe("INCOMPLETE")
    expect(calculatePrognozaMiesieczna(wejscie({ miesiacStartu: 1, miesiecyNaprzod: 3 })).status).toBe("INCOMPLETE")
    expect(calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, miesiecyNaprzod: 3 })).status).toBe("INCOMPLETE")
    expect(calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, miesiacStartu: 1 })).status).toBe("INCOMPLETE")
  })

  it("reduces the same months a year earlier by the degradation: 2 % → 176.4, 215.6, 343 kWh, total −2 %", () => {
    const r = calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, degradacjaRocznaPct: 2, miesiacStartu: 1, miesiecyNaprzod: 3 }))
    expect(r.status).toBe("VALID")
    expect(r.value!.wiersze.map((w) => w.miesiac)).toEqual([1, 2, 3])
    expect(r.value!.wiersze[0].prognozaKwh).toBeCloseTo(176.4, 9)
    expect(r.value!.wiersze[1].prognozaKwh).toBeCloseTo(215.6, 9)
    expect(r.value!.wiersze[2].prognozaKwh).toBeCloseTo(343, 9)
    expect(r.value!.sumaPrognozyKwh).toBeCloseTo(735, 9)
    expect(r.value!.sumaHistoriiKwh).toBe(750)
    expect(r.value!.zmianaPct).toBeCloseTo(-2, 9)
    expect(r.value!.wiersze[0].dolnaKwh).toBeNull()
  })

  it("spans a low/high scenario by the user's weather swing: ±10 % of 176.4 = 158.76 … 194.04", () => {
    const r = calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, degradacjaRocznaPct: 2, miesiacStartu: 1, miesiecyNaprzod: 1, odchylenieMeteoPct: 10 }))
    expect(r.value!.wiersze[0].dolnaKwh).toBeCloseTo(158.76, 9)
    expect(r.value!.wiersze[0].gornaKwh).toBeCloseTo(194.04, 9)
    expect(zalozenia(r)).toContain("PROGMIES-ZAL-SCENARIUSZE")
  })

  it("wraps over the year end: from November, 4 months → 11, 12, 1, 2", () => {
    const hist = [100, 110, null, null, null, null, null, null, null, null, 90, 80]
    const r = calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: hist, miesiacStartu: 11, miesiecyNaprzod: 4 }))
    expect(r.value!.wiersze.map((w) => w.miesiac)).toEqual([11, 12, 1, 2])
    expect(r.value!.wiersze.map((w) => w.prognozaKwh)).toEqual([90, 80, 100, 110])
  })

  it("counts no forecast for a month without history and says so; the totals cover only months with data", () => {
    const r = calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, degradacjaRocznaPct: 2, miesiacStartu: 4, miesiecyNaprzod: 2 }))
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value!.wiersze[1].prognozaKwh).toBeNull()
    expect(r.value!.sumaPrognozyKwh).toBeCloseTo(490, 9)
    expect(r.value!.liczbaMiesiecyZDanymi).toBe(1)
    expect(kody(r)).toEqual(["PROGMIES-BRAK-MIESIECY"])
  })

  it("treats an empty degradation as 0 %, says so and keeps the forecast equal to last year", () => {
    const r = calculatePrognozaMiesieczna(wejscie({ produkcjaHistoriaKwh: HISTORIA, miesiacStartu: 1, miesiecyNaprzod: 2 }))
    expect(r.value!.wiersze[0].prognozaKwh).toBe(180)
    expect(r.value!.zmianaPct).toBeCloseTo(0, 9)
    expect(kody(r)).toEqual(["PROGMIES-BRAK-DEGRADACJI"])
  })

  it("rejects negative production, degradation / swing outside 0…100 and months outside 1…12", () => {
    const baza = { produkcjaHistoriaKwh: HISTORIA, miesiacStartu: 1, miesiecyNaprzod: 3 }
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, produkcjaHistoriaKwh: [-1, ...HISTORIA.slice(1)] })).warnings[0].i18nKey).toBe("PROGMIES-WARTOSC-UJEMNA")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, degradacjaRocznaPct: 101 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, degradacjaRocznaPct: -1 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, odchylenieMeteoPct: 120 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, miesiacStartu: 13 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, miesiecyNaprzod: 0 })).status).toBe("INVALID_INPUT")
    expect(calculatePrognozaMiesieczna(wejscie({ ...baza, miesiecyNaprzod: 2.5 })).status).toBe("INVALID_INPUT")
  })

  it("does not mutate the input", () => {
    const wej = wejscie({ produkcjaHistoriaKwh: HISTORIA, degradacjaRocznaPct: 2, miesiacStartu: 1, miesiecyNaprzod: 3 })
    const kopia = JSON.stringify(wej)
    calculatePrognozaMiesieczna(wej)
    expect(JSON.stringify(wej)).toBe(kopia)
  })
})
