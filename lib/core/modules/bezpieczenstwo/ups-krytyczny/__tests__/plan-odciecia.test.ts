import { describe, expect, it } from "vitest"
import { calculateUpsKrytyczny } from "../calculator"
import type { UrzadzenieKrytyczne } from "../input"

// 5 + 10 + 15 + 10 + 10 = 50 W; 20 Ah × 12 V × 0,92 = 220,8 Wh.
function urzadzenia(oswietlenie: 1 | 2 | 3 | null | undefined): UrzadzenieKrytyczne[] {
  return [
    { id: "esp32", label: "ESP32", powerW: 5, selected: true },
    { id: "router", label: "Router", powerW: 10, selected: true },
    { id: "silowniki", label: "Siłowniki", powerW: 15, selected: true },
    { id: "centrala-pozarowa", label: "Centrala", powerW: 10, selected: true },
    { id: "oswietlenie-awaryjne", label: "Oświetlenie", powerW: 10, selected: true, priorytet: oswietlenie },
  ]
}

describe("UPS krytyczny — plan odcinania wg priorytetu (dawne 12.54, v1.1.0)", () => {
  it("oświetlenie bez priorytetu (źródło go nie szereguje) → brak planu, ℹ️ z nazwą", () => {
    const r = calculateUpsKrytyczny({ urzadzenia: urzadzenia(undefined), pojemnoscAh: 20, napiecieV: 12 })
    expect(r.status).toBe("VALID")
    expect(r.value.planOdciecia).toBeNull()
    expect(r.warnings.find((w) => w.code === "UPS-BRAK-PRIORYTETU")?.params).toEqual({ nazwy: "Oświetlenie" })
  })

  it("kolejność ze źródła: najpierw siłowniki, potem router; centrala i ESP32 do końca — czasy od pełnego UPS", () => {
    const r = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 20, napiecieV: 12 })
    const plan = r.value.planOdciecia!
    expect(plan.map((e) => e.odcietyPriorytet)).toEqual([null, 3, 2])
    expect(plan.map((e) => e.mocW)).toEqual([50, 35, 25])
    expect(plan[1]!.aktywne).not.toContain("silowniki")
    expect(plan[2]!.aktywne.sort()).toEqual(["centrala-pozarowa", "esp32", "oswietlenie-awaryjne"])
    expect(plan[2]!.czasOdPelnegoH).toBeCloseTo(220.8 / 25, 9)
    expect(plan.every((e) => e.czasEtapuH === null)).toBe(true)
    expect(r.value.czasPriorytetu1H).toBeNull()
  })

  it("próg 10 min (przykład źródła): etap = E/P − próg, reszta X·P przechodzi dalej; priorytet 1 dłużej niż bez odcinania", () => {
    const r = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 20, napiecieV: 12, progOdcieciaMin: 10 })
    const x = 10 / 60
    const t0 = 220.8 / 50 - x
    const t1 = (x * 50) / 35 - x
    const t2 = (x * 35) / 25
    const plan = r.value.planOdciecia!
    expect(plan[0]!.czasEtapuH).toBeCloseTo(t0, 9)
    expect(plan[1]!.czasEtapuH).toBeCloseTo(t1, 9)
    expect(plan[2]!.czasEtapuH).toBeCloseTo(t2, 9)
    expect(r.value.czasPriorytetu1H).toBeCloseTo(t0 + t1 + t2, 9)
    expect(r.value.czasPriorytetu1H!).toBeGreaterThan(r.value.czasPodtrzymaniaH)
    expect(r.assumptions).toContainEqual({ kod: "UPS-ZAL-PROG", params: { prog: 10 } })
    expect(r.assumptions).toContainEqual({ kod: "UPS-ZAL-FAIL-SAFE" })
  })

  it("próg dłuższy niż czas przy pełnym obciążeniu → odcinanie od razu, ℹ️", () => {
    const r = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 1, napiecieV: 12, progOdcieciaMin: 60 })
    expect(r.value.planOdciecia![0]!.czasEtapuH).toBe(0)
    expect(r.warnings.map((w) => w.code)).toContain("UPS-PROG-OD-RAZU")
  })

  it("🔴 akumulator UPS słaby (Sekcja C) — także przed wpisaniem liczb", () => {
    const pelny = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 20, napiecieV: 12, akumulatorSlaby: true })
    expect(pelny.status).toBe("VALID_WITH_WARNINGS")
    expect(pelny.warnings[0]!.code).toBe("UPS-AKUMULATOR-SLABY")
    expect(pelny.warnings[0]!.level).toBe("critical")
    const pusty = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 0, napiecieV: 0, akumulatorSlaby: true })
    expect(pusty.warnings.map((w) => w.code)).toContain("UPS-AKUMULATOR-SLABY")
  })

  it("ujemny próg → INVALID_INPUT", () => {
    const r = calculateUpsKrytyczny({ urzadzenia: urzadzenia(1), pojemnoscAh: 20, napiecieV: 12, progOdcieciaMin: -5 })
    expect(r.status).toBe("INVALID_INPUT")
  })
})
