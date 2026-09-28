import { describe, expect, it } from "vitest"
import { calculateStrategiaZamarzanie } from "../calculator"
import type { StrategiaZamarzanieInput } from "../input"

const BAZA: StrategiaZamarzanieInput = {
  pojemnoscKwh: 20,
  socPct: 50,
  socMinPct: 10,
  sprawnoscFalownikaPct: 100,
  odbiorniki: [
    { nazwa: "Pompa ciepła", mocW: 800, priorytet: 1 },
    { nazwa: "Router", mocW: 200, priorytet: 2 },
    { nazwa: "Zmywarka", mocW: 1500, priorytet: 3 },
  ],
}

describe("calculateStrategiaZamarzanie (M7/E6, dawne 6.6)", () => {
  it("SoC 50%: etap A 50→20% z 1000 W = 6 h, etap B 20→10% z 800 W = 2,5 h → 8,5 h ogrzewania", () => {
    const w = calculateStrategiaZamarzanie(BAZA)
    expect(w.value.czasEtapuAH).toBeCloseTo(6, 12)
    expect(w.value.czasEtapuBH).toBeCloseTo(2.5, 12)
    expect(w.value.czasKrytycznychH).toBeCloseTo(8.5, 12)
    expect(w.value.mocKomfortuW).toBe(1500)
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["ZAMARZANIE-KOMFORT-ODLACZONY", "ZAMARZANIE-WAZNE-PRZY-PROGU"])
    expect(w.warnings[1]!.params).toEqual({ nazwy: "Router", prog: 20 })
  })

  it("SoC poniżej progu 20% (przykład źródła: 15%) → tylko krytyczne: 15→10% z 800 W = 1,25 h", () => {
    const w = calculateStrategiaZamarzanie({ ...BAZA, socPct: 15 })
    expect(w.value.czasEtapuAH).toBeNull()
    expect(w.value.czasKrytycznychH).toBeCloseTo(1.25, 12)
  })

  it("SoC min powyżej progu → tylko etap A do minimum; sprawność falownika skraca czas", () => {
    const w = calculateStrategiaZamarzanie({ ...BAZA, socMinPct: 30, sprawnoscFalownikaPct: 90 })
    expect(w.value.czasEtapuAH).toBeCloseTo((20 * 0.9 * 0.2 * 1000) / 1000, 12)
    expect(w.value.czasEtapuBH).toBeNull()
  })

  it("SoC na minimum → 🔴; brak krytycznych → 🟡 i czas null", () => {
    expect(calculateStrategiaZamarzanie({ ...BAZA, socPct: 10 }).warnings[0]!.code).toBe("ZAMARZANIE-SOC-PONIZEJ-MINIMUM")
    const w = calculateStrategiaZamarzanie({ ...BAZA, odbiorniki: [{ nazwa: "", mocW: 100, priorytet: 2 }] })
    expect(w.value.czasKrytycznychH).toBeNull()
    expect(w.warnings.map((x) => x.code)).toContain("ZAMARZANIE-BRAK-KRYTYCZNYCH")
    expect(w.warnings.find((x) => x.code === "ZAMARZANIE-WAZNE-PRZY-PROGU")!.params!.nazwy).toBe("#1")
  })

  it("brak odbiorników → INCOMPLETE; ujemna moc, SoC 120 → INVALID_INPUT", () => {
    expect(calculateStrategiaZamarzanie({ ...BAZA, odbiorniki: [] }).status).toBe("INCOMPLETE")
    expect(calculateStrategiaZamarzanie({ ...BAZA, socPct: 120 }).status).toBe("INVALID_INPUT")
    const w = calculateStrategiaZamarzanie({ ...BAZA, odbiorniki: [{ nazwa: "X", mocW: -5, priorytet: 1 }] })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("odbiorniki.0")
  })
})
