import { describe, expect, it } from "vitest"
import { calculateDeepWinterBudget } from "../calculator"
import type { DeepWinterBudgetInput } from "../input"

// January: plan 300 PV + 150 generator + 250 battery = 700 kWh, 31 days, day 20.
const BAZA: DeepWinterBudgetInput = {
  dniMiesiaca: 31,
  biezacyDzien: 20,
  planPvKwh: 300,
  planAgregatKwh: 150,
  planMagazynKwh: 250,
  zuzycieNarastajaceKwh: 500,
  cele: [],
  udzialOgrzewaniaPct: 0,
  roznicaTemperaturK: 0,
  oszczednoscKwhDobaNaK: 0,
}

describe("calculateDeepWinterBudget (M7/E25, dawne 6.39)", () => {
  it("bilans ręcznie: P=700, B_20=700·20/31, z=500 → +10,71%, zostało 200, tempo 25 vs 200/11", () => {
    const w = calculateDeepWinterBudget(BAZA)
    const v = w.value
    expect(v.planKwh).toBe(700)
    expect(v.budzetNarastajacyKwh).toBeCloseTo(14000 / 31, 9)
    expect(v.odchyleniePct).toBeCloseTo((500 / (14000 / 31) - 1) * 100, 9)
    expect(v.odchyleniePct).toBeCloseTo(10.7142857, 6)
    expect(v.zostaloKwh).toBe(200)
    expect(v.dniDoKonca).toBe(11)
    expect(v.tempoBiezaceKwhDzien).toBe(25)
    expect(v.tempoDopuszczalneKwhDzien).toBeCloseTo(200 / 11, 12)
    expect(v.prognozaKoniecMiesiacaKwh).toBe(775)
    expect(v.dzienWyczerpaniaPlanu).toBeCloseTo(28, 12)
    expect(v.wymaganeOgraniczeniePct).toBeCloseTo((1 - 200 / 11 / 25) * 100, 9)
    expect(v.wymaganeOgraniczeniePct).toBeCloseTo(27.2727273, 6)
  })

  it("🟡 ponad budżet, plan jeszcze nie wyczerpany: komunikat z % i ograniczeniem", () => {
    const w = calculateDeepWinterBudget(BAZA)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["DWB-PONAD-BUDZET", "warning"]])
    expect(w.warnings[0]!.params).toEqual({ odchylenie: 10.7, dzien: 28, ograniczenie: 27.3 })
  })

  it("🟢 w budżecie: z=400 → −11,43%, brak wymaganego ograniczenia, brak ostrzeżeń", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, zuzycieNarastajaceKwh: 400 })
    expect(w.status).toBe("VALID")
    expect(w.warnings).toEqual([])
    expect(w.value.odchyleniePct).toBeCloseTo((400 / (14000 / 31) - 1) * 100, 9)
    expect(w.value.wymaganeOgraniczeniePct).toBe(0)
    expect(w.value.dzienWyczerpaniaPlanu).toBeNull()
    expect(w.value.prognozaKoniecMiesiacaKwh).toBe(620)
  })

  it("dokładnie na budżecie (z = B_d) → nie przekroczono", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, dniMiesiaca: 30, biezacyDzien: 15, zuzycieNarastajaceKwh: 350 })
    expect(w.status).toBe("VALID")
  })

  it("🔴 zużycie = plan, a są jeszcze dni → plan wyczerpany; zużycie > plan → też", () => {
    const rowny = calculateDeepWinterBudget({ ...BAZA, zuzycieNarastajaceKwh: 700 })
    expect(rowny.warnings.map((x) => [x.code, x.level])).toEqual([["DWB-PLAN-WYCZERPANY", "critical"]])
    expect(rowny.value.tempoDopuszczalneKwhDzien).toBe(0)
    expect(rowny.value.wymaganeOgraniczeniePct).toBe(100)
    const wiecej = calculateDeepWinterBudget({ ...BAZA, zuzycieNarastajaceKwh: 750 })
    expect(wiecej.warnings[0]!.level).toBe("critical")
    expect(wiecej.value.zostaloKwh).toBe(-50)
    expect(wiecej.value.tempoDopuszczalneKwhDzien).toBe(0)
  })

  it("ostatni dzień miesiąca: bez dzielenia przez 0, bez tempa dopuszczalnego; z > P → 🔴 z kluczem „koniec”", () => {
    const ok = calculateDeepWinterBudget({ ...BAZA, biezacyDzien: 31, zuzycieNarastajaceKwh: 650 })
    expect(ok.status).toBe("VALID")
    expect(ok.value.tempoDopuszczalneKwhDzien).toBeNull()
    expect(ok.value.wymaganeOgraniczeniePct).toBeNull()
    expect(ok.value.zostaloKwh).toBe(50)
    const za = calculateDeepWinterBudget({ ...BAZA, biezacyDzien: 31, zuzycieNarastajaceKwh: 710 })
    expect(za.warnings[0]!.i18nKey).toBe("DWB-PLAN-PRZEKROCZONY-KONIEC")
    expect(za.warnings[0]!.level).toBe("critical")
  })

  it("ogrzewanie: r=27,27%, udział 60%, ΔT 20 K → potrzebne 27,27·20/60 = 9,09 K", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, udzialOgrzewaniaPct: 60, roznicaTemperaturK: 20 })
    expect(w.value.potrzebneObnizenieK).toBeCloseTo((((1 - 200 / 11 / 25) * 100) * 20) / 60, 9)
    expect(w.value.potrzebneObnizenieK).toBeCloseTo(9.0909091, 6)
    expect(w.warnings.map((x) => x.code)).toEqual(["DWB-PONAD-BUDZET", "DWB-OGRANICZ-OGRZEWANIE"])
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("DWB-ZALOZENIE-OGRZEWANIE-STACJONARNE")
  })

  it("🔴 nawet wyłączenie ogrzewania nie wystarczy: r=27,27% > udział 20%", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, udzialOgrzewaniaPct: 20, roznicaTemperaturK: 20 })
    expect(w.value.potrzebneObnizenieK).toBeNull()
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["DWB-OGRZEWANIE-NIE-WYSTARCZY", "critical"],
      ["DWB-PONAD-BUDZET", "warning"],
    ])
  })

  it("dane ogrzewania tylko w połowie → info, bez ΔT", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, udzialOgrzewaniaPct: 60 })
    expect(w.value.potrzebneObnizenieK).toBeNull()
    expect(w.warnings.map((x) => x.code)).toContain("DWB-OGRZEWANIE-NIEKOMPLETNE")
  })

  it("cele: ogrzewanie 50% planu → plan 350, budżet 350·20/31, zużycie 300 → +32,86%", () => {
    const w = calculateDeepWinterBudget({
      ...BAZA,
      cele: [
        { cel: "ogrzewanie", udzialPlanuPct: 50, zuzycieKwh: 300 },
        { cel: "cwu", udzialPlanuPct: 20, zuzycieKwh: 60 },
      ],
    })
    const [og, cwu] = w.value.cele
    expect(og!.planKwh).toBe(350)
    expect(og!.budzetNarastajacyKwh).toBeCloseTo(7000 / 31, 9)
    expect(og!.odchyleniePct).toBeCloseTo(32.857143, 5)
    expect(og!.ponadBudzet).toBe(true)
    expect(cwu!.budzetNarastajacyKwh).toBeCloseTo(140 * (20 / 31), 9)
    expect(cwu!.ponadBudzet).toBe(false)
    expect(w.warnings.map((x) => x.code)).toContain("DWB-PLAN-NIE-W-CALOSCI-PRZYDZIELONY")
  })

  it("cele: zużycie celów większe niż zużycie razem → ostrzeżenie", () => {
    const w = calculateDeepWinterBudget({
      ...BAZA,
      zuzycieNarastajaceKwh: 400,
      cele: [{ cel: "ogrzewanie", udzialPlanuPct: 100, zuzycieKwh: 450 }],
    })
    expect(w.warnings.map((x) => x.code)).toContain("DWB-CELE-WIECEJ-NIZ-RAZEM")
  })

  it("walidacja: udziały > 100%, powtórzony cel, dzień > N, N spoza 28..31, ujemne → INVALID_INPUT", () => {
    const kody = (i: Partial<DeepWinterBudgetInput>) => calculateDeepWinterBudget({ ...BAZA, ...i }).warnings.map((x) => x.code)
    expect(
      kody({ cele: [{ cel: "cwu", udzialPlanuPct: 60, zuzycieKwh: 0 }, { cel: "inne", udzialPlanuPct: 50, zuzycieKwh: 0 }] }),
    ).toEqual(["DWB-UDZIALY-POWYZEJ-100"])
    expect(
      kody({ cele: [{ cel: "cwu", udzialPlanuPct: 10, zuzycieKwh: 0 }, { cel: "cwu", udzialPlanuPct: 10, zuzycieKwh: 0 }] }),
    ).toEqual(["DWB-CEL-POWTORZONY"])
    expect(kody({ biezacyDzien: 32 })).toEqual(["DWB-DZIEN-POZA-ZAKRESEM"])
    expect(kody({ dniMiesiaca: 27 })).toEqual(["DWB-DNI-MIESIACA-POZA-ZAKRESEM"])
    expect(kody({ biezacyDzien: 20.5 })).toEqual(["DWB-DZIEN-POZA-ZAKRESEM"])
    expect(kody({ planPvKwh: -1 })).toEqual(["DWB-WARTOSC-UJEMNA"])
    expect(kody({ udzialOgrzewaniaPct: 101 })).toEqual(["DWB-PROCENT-POZA-ZAKRESEM"])
    expect(calculateDeepWinterBudget({ ...BAZA, planPvKwh: -1 }).status).toBe("INVALID_INPUT")
  })

  it("INCOMPLETE: brak liczby dni, dnia, planu albo zużycia", () => {
    for (const braki of [{ dniMiesiaca: 0 }, { biezacyDzien: 0 }, { zuzycieNarastajaceKwh: 0 }, { planPvKwh: 0, planAgregatKwh: 0, planMagazynKwh: 0 }]) {
      expect(calculateDeepWinterBudget({ ...BAZA, ...braki }).status).toBe("INCOMPLETE")
    }
  })

  it("założenia: budżet proporcjonalny i stałe tempo, bez message", () => {
    const w = calculateDeepWinterBudget(BAZA)
    expect(w.assumptions).toEqual([{ kod: "DWB-ZALOZENIE-BUDZET-PROPORCJONALNY" }, { kod: "DWB-ZALOZENIE-TEMPO-STALE" }])
    expect(w.warnings.every((x) => x.message === undefined)).toBe(true)
  })
  it("własna oszczędność na 1 K zastępuje przybliżenie 1/ΔT: K = (25 − 200/11)/s", () => {
    const w = calculateDeepWinterBudget({ ...BAZA, oszczednoscKwhDobaNaK: 3 })
    expect(w.value.potrzebneObnizenieK).toBeCloseTo((25 - 200 / 11) / 3, 9)
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("DWB-ZALOZENIE-OGRZEWANIE-WLASNE")
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).not.toContain("DWB-ZALOZENIE-OGRZEWANIE-STACJONARNE")
  })

  it("własna oszczędność ma pierwszeństwo przed ΔT, ale udział ogrzewania nadal wykrywa 🔴 „samo wyłączenie nie wystarcza”", () => {
    const ok = calculateDeepWinterBudget({ ...BAZA, udzialOgrzewaniaPct: 50, roznicaTemperaturK: 20, oszczednoscKwhDobaNaK: 3 })
    expect(ok.value.potrzebneObnizenieK).toBeCloseTo((25 - 200 / 11) / 3, 9)
    const za = calculateDeepWinterBudget({ ...BAZA, udzialOgrzewaniaPct: 10, oszczednoscKwhDobaNaK: 3 })
    expect(za.value.potrzebneObnizenieK).toBeNull()
    expect(za.warnings.some((x) => x.level === "critical")).toBe(true)
  })

  it("ujemna własna oszczędność → INVALID_INPUT", () => {
    expect(calculateDeepWinterBudget({ ...BAZA, oszczednoscKwhDobaNaK: -1 }).status).toBe("INVALID_INPUT")
  })
})
