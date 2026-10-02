import { describe, expect, it } from "vitest"
import { calculateWykrywanieAnomalii } from "../calculator"
import type { WykrywanieAnomaliiInput } from "../input"

const pv: WykrywanieAnomaliiInput = { podsystem: "pv", oczekiwanaKwh: 20, zmierzonaKwh: 16, progAlarmuPct: 15, kaskada: {} }

describe("wykrywanie anomalii (M10/E7, dawne 12.13, 12.14, 12.17)", () => {
  it("przykład źródła 12.13: produkcja o 20% niższa niż oczekiwana → ⚠️ przy progu 15%, kaskada czeka na „pogoda”", () => {
    const r = calculateWykrywanieAnomalii(pv)
    expect(r.value.odchyleniePct).toBeCloseTo(-20, 9)
    expect(r.value.odchylenieKwh).toBeCloseTo(-4, 9)
    expect(r.value.przekroczonyProg).toBe(true)
    expect(r.value.nastepnyKrok).toBe("pogoda")
    expect(r.warnings.map((w) => w.code)).toEqual(["ANOM-PV-SPADEK"])
  })

  it("12.17 kaskada w kolejności źródła: pogoda nie, brud nie, śnieg nie, cień nie → uszkodzenie (⚠️)", () => {
    const r = calculateWykrywanieAnomalii({ ...pv, kaskada: { pogoda: false, brud: false, snieg: false, cien: false } })
    expect(r.value.przyczyna).toBe("uszkodzenie")
    expect(r.warnings.map((w) => w.code)).toEqual(["ANOM-PV-SPADEK", "ANOM-PRZYCZYNA-USZKODZENIE"])
  })

  it("kaskada zatrzymuje się na pierwszym „tak” — brud, dalszych kroków nie ocenia", () => {
    const r = calculateWykrywanieAnomalii({ ...pv, kaskada: { pogoda: false, brud: true, snieg: null } })
    expect(r.value.przyczyna).toBe("brud")
    expect(r.value.nastepnyKrok).toBeNull()
  })

  it("spadek poniżej progu → bez kaskady", () => {
    const r = calculateWykrywanieAnomalii({ ...pv, zmierzonaKwh: 19 })
    expect(r.value.przekroczonyProg).toBe(false)
    expect(r.value.nastepnyKrok).toBeNull()
    expect(r.status).toBe("VALID")
  })

  it("przykład źródła 12.14: zużycie +40% przy progu 30% → ⚠️ wzrost; −40% → ⚠️ spadek", () => {
    const wzrost = calculateWykrywanieAnomalii({ podsystem: "zuzycie", oczekiwanaKwh: 5, zmierzonaKwh: 7, progAlarmuPct: 30, kaskada: {} })
    expect(wzrost.value.odchyleniePct).toBeCloseTo(40, 9)
    expect(wzrost.warnings.map((w) => w.code)).toEqual(["ANOM-ZUZYCIE-WZROST"])
    const spadek = calculateWykrywanieAnomalii({ podsystem: "zuzycie", oczekiwanaKwh: 5, zmierzonaKwh: 3, progAlarmuPct: 30, kaskada: {} })
    expect(spadek.warnings.map((w) => w.code)).toEqual(["ANOM-ZUZYCIE-SPADEK"])
  })

  it("bez progu → tylko ℹ️ odchylenie; dla spadku PV kaskada i tak dostępna", () => {
    const r = calculateWykrywanieAnomalii({ ...pv, progAlarmuPct: null })
    expect(r.value.przekroczonyProg).toBeNull()
    expect(r.warnings.map((w) => w.code)).toEqual(["ANOM-ODCHYLENIE"])
    expect(r.value.nastepnyKrok).toBe("pogoda")
  })

  it("brak oczekiwanej → INCOMPLETE; ujemna wartość → INVALID_INPUT", () => {
    expect(calculateWykrywanieAnomalii({ ...pv, oczekiwanaKwh: 0 }).status).toBe("INCOMPLETE")
    expect(calculateWykrywanieAnomalii({ ...pv, zmierzonaKwh: -1 }).status).toBe("INVALID_INPUT")
  })
})
