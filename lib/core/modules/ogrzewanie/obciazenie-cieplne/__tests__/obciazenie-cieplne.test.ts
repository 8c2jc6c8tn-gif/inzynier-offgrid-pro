import { describe, expect, it } from "vitest"
import { calculateObciazenieCieplne } from "../calculator"
import type { ObciazenieCieplneInput } from "../input"

const MIESIACE_PUSTE: (number | null)[] = Array(12).fill(null)

// Reference values computed independently in Python before implementation (Directive #3).
const DOM: ObciazenieCieplneInput = {
  przegrody: [
    { nazwa: "Ściany", powierzchniaM2: 120, uWM2K: 0.25, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Okna", powierzchniaM2: 20, uWM2K: 1.1, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Dach", powierzchniaM2: 100, uWM2K: 0.18, zewnetrzna: true, temperaturaPoDrugiejStronieC: null },
    { nazwa: "Podłoga na gruncie", powierzchniaM2: 100, uWM2K: 0.3, zewnetrzna: false, temperaturaPoDrugiejStronieC: 8 },
  ],
  temperaturaWewnetrznaC: 20,
  strefaKlimatyczna: 3,
  kubaturaM3: 300,
  wymianyPowietrzaNaH: 0.5,
  cop: null,
  srednieTemperaturyMiesieczneC: MIESIACE_PUSTE,
}

describe("calculateObciazenieCieplne (M6/E1, dawne 5.1)", () => {
  it("strefa III → θe = −20 °C; przenikanie 3160 W + wentylacja 2010 W = 5170 W, 124,08 kWh/dobę", () => {
    const r = calculateObciazenieCieplne(DOM)
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const v = r.value!
    expect(v.temperaturaZewnetrznaC).toBe(-20)
    expect(v.przegrody.map((p) => p.strataW)).toEqual([1200, 880, 720, 360])
    expect(v.strataPrzenikanieW).toBeCloseTo(3160, 9)
    expect(v.hvWK).toBeCloseTo(50.25, 9)
    expect(v.strataWentylacjaW).toBeCloseTo(2010, 9)
    expect(v.obciazenieW).toBeCloseTo(5170, 9)
    expect(v.cieploDobaObliczeniowaKwh).toBeCloseTo(124.08, 9)
    expect(v.przegrody[1]!.udzialPct).toBeCloseTo(17.02127659574468, 9)
    expect(v.energiaElektrycznaDobaKwh).toBeNull()
    expect(v.miesiace).toBeNull()
  })

  it("przykład źródła: 8 kW przy −20 °C → 192 kWh/dobę; COP 3 → 64 kWh (źródło podaje 60 — rozbieżność udokumentowana)", () => {
    const r = calculateObciazenieCieplne({
      ...DOM,
      przegrody: [{ nazwa: "Przegrody razem", powierzchniaM2: 200, uWM2K: 1, zewnetrzna: true, temperaturaPoDrugiejStronieC: null }],
      wymianyPowietrzaNaH: 0,
      cop: 3,
    })
    expect(r.value!.obciazenieW).toBe(8000)
    expect(r.value!.cieploDobaObliczeniowaKwh).toBe(192)
    expect(r.value!.energiaElektrycznaDobaKwh).toBe(64)
    expect(r.assumptions).toContainEqual({ kod: "OC-ZALOZENIE-COP", params: { cop: 3 } })
  })

  it("miesiące ze średnich: styczeń −2 °C → 2236,092 kWh, lipiec 18 °C → 446,772 kWh, sierpień 21 °C (≥ θi) → 0", () => {
    const temp = [...MIESIACE_PUSTE]
    temp[0] = -2
    temp[6] = 18
    temp[7] = 21
    const r = calculateObciazenieCieplne({ ...DOM, srednieTemperaturyMiesieczneC: temp })
    const m = r.value!.miesiace!
    expect(m.map((x) => x.miesiac)).toEqual([1, 7, 8])
    expect(m[0]!.cieploKwh).toBeCloseTo(2236.092, 9)
    expect(m[1]!.cieploKwh).toBeCloseTo(446.772, 9)
    expect(m[2]!.cieploKwh).toBe(0)
    expect(r.value!.cieploSumaMiesiecyKwh).toBeCloseTo(2682.864, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["OC-BEZ-PN-EN-12831", "OC-MIESIACE-ZE-SREDNICH"])
  })

  it("zawsze ostrzeżenie o braku PN-EN 12831-1 (mostki, grunt, zyski) — poziom warning, nie info", () => {
    const w = calculateObciazenieCieplne(DOM).warnings.find((x) => x.code === "OC-BEZ-PN-EN-12831")
    expect(w?.level).toBe("warning")
  })

  it("INCOMPLETE bez zgadywania: brak strefy, pusta lista albo przegroda bez U", () => {
    expect(calculateObciazenieCieplne({ ...DOM, strefaKlimatyczna: null }).status).toBe("INCOMPLETE")
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: [] }).status).toBe("INCOMPLETE")
    const bezU = DOM.przegrody.map((p, i) => (i === 1 ? { ...p, uWM2K: null } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: bezU }).status).toBe("INCOMPLETE")
    // Ground partition without the other-side temperature must not fall back to outdoor air.
    const gruntBezTemp = DOM.przegrody.map((p, i) => (i === 3 ? { ...p, temperaturaPoDrugiejStronieC: null } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: gruntBezTemp }).status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT: θi ≤ θe (twardy błąd danych), U poza zakresem, ujemna kubatura", () => {
    const zimno = calculateObciazenieCieplne({ ...DOM, temperaturaWewnetrznaC: -25 })
    expect(zimno.status).toBe("INVALID_INPUT")
    expect(zimno.warnings[0]!.code).toBe("OC-TEMP-WEWN-NIE-WYZSZA")
    const zleU = DOM.przegrody.map((p, i) => (i === 0 ? { ...p, uWM2K: 12 } : p))
    expect(calculateObciazenieCieplne({ ...DOM, przegrody: zleU }).status).toBe("INVALID_INPUT")
    expect(calculateObciazenieCieplne({ ...DOM, kubaturaM3: -1 }).status).toBe("INVALID_INPUT")
  })

  it("strefy I–V: −16/−18/−20/−22/−24 °C (PN-82/B-02403 Tablica 1 = zał. krajowy PN-EN 12831 wg Purmo)", () => {
    const te = ([1, 2, 3, 4, 5] as const).map((s) => calculateObciazenieCieplne({ ...DOM, strefaKlimatyczna: s }).value!.temperaturaZewnetrznaC)
    expect(te).toEqual([-16, -18, -20, -22, -24])
  })
})
