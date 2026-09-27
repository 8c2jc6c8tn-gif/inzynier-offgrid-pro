import { describe, expect, it } from "vitest"
import { calculateMostkiTermiczne } from "../calculator"
import type { Mostek, MostkiTermiczneInput } from "../input"

const mostek = (nazwa: string, dlugoscM: number | null, psiWmK: number | null, z: Partial<Mostek> = {}): Mostek => ({
  nazwa,
  dlugoscM,
  psiWmK,
  psiPoPoprawieWmK: null,
  nadprozeBezIzolacji: false,
  ...z,
})

const BAZA: MostkiTermiczneInput = {
  mostki: [mostek("Narożniki", 40, 0.15), mostek("Płyta balkonowa", 20, 0.6, { psiPoPoprawieWmK: 0.1 }), mostek("Ościeża", 30, 0.1)],
  temperaturaWewnetrznaC: 20,
  temperaturaZewnetrznaC: -20,
  obciazenieBezMostkowW: 5000,
}

describe("calculateMostkiTermiczne (M6/E7, dawne 5.7)", () => {
  it("H = Σ Ψ·l, Φ = H·ΔT, udział w całości strat (wartości z Pythona)", () => {
    const w = calculateMostkiTermiczne(BAZA)
    // Only info-level notes → VALID (Dyrektywa AI #6; before 27.09.2026 the module returned VALID_WITH_WARNINGS here).
    expect(w.status).toBe("VALID")
    const v = w.value!
    expect(v.mostki.map((m) => m.hWK)).toEqual([6, 12, 3])
    expect(v.hMostkowWK).toBe(21)
    expect(v.strataMostkowW).toBe(840)
    expect(v.obciazenieZMostkamiW).toBe(5840)
    expect(v.udzialMostkowPct).toBeCloseTo(14.383561643835616, 12)
  })

  it("Ψ po poprawie: mostki bez nowej Ψ liczą się bez zmian", () => {
    const v = calculateMostkiTermiczne(BAZA).value!
    expect(v.mostki[1]!.strataPoPoprawieW).toBe(80)
    expect(v.mostki[0]!.strataPoPoprawieW).toBeNull()
    expect(v.strataMostkowPoPoprawieW).toBe(440)
    expect(v.udzialMostkowPoPoprawiePct).toBeCloseTo(8.088235294117647, 12)
  })

  it("przykład źródła „12% całkowitych strat” — np. H = 22,5 W/K przy ΔT = 40 K i 6,6 kW z Ekranu 1", () => {
    const v = calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("Razem", 100, 0.225)], obciazenieBezMostkowW: 6600 }).value!
    expect(v.strataMostkowW).toBeCloseTo(900, 9)
    expect(v.udzialMostkowPct).toBeCloseTo(12, 9)
  })

  it("ujemna Ψ (wymiary zewnętrzne, naroże) jest dozwolona i zmniejsza stratę", () => {
    const v = calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("Naroże", 10, -0.05)] }).value!
    expect(v.strataMostkowW).toBeCloseTo(-20, 12)
  })

  it("bez Ekranu 1 → straty mostków bez udziału", () => {
    const v = calculateMostkiTermiczne({ ...BAZA, obciazenieBezMostkowW: null }).value!
    expect(v.strataMostkowW).toBe(840)
    expect(v.udzialMostkowPct).toBeNull()
    expect(v.obciazenieZMostkamiW).toBeNull()
  })

  it("nieocieplone nadproże → 🟡 warning ze źródła; zawsze informacja, że Ψ jest od użytkownika", () => {
    const w = calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("Nadproże kuchnia", 2, 0.5, { nadprozeBezIzolacji: true })] })
    expect(w.warnings.find((x) => x.code === "MT-NADPROZE-BEZ-IZOLACJI")).toMatchObject({ level: "warning", params: { nazwa: "Nadproże kuchnia" } })
    expect(w.warnings.map((x) => x.code)).toContain("MT-PSI-OD-UZYTKOWNIKA")
  })

  it("niekompletny mostek albo brak temperatur z Ekranu 1 → INCOMPLETE", () => {
    expect(calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("X", 10, null)] }).status).toBe("INCOMPLETE")
    expect(calculateMostkiTermiczne({ ...BAZA, temperaturaZewnetrznaC: null }).status).toBe("INCOMPLETE")
    expect(calculateMostkiTermiczne({ ...BAZA, mostki: [] }).status).toBe("INCOMPLETE")
  })

  it("walidacja: ujemna długość, |Ψ| ponad granicę sensu, θi ≤ θe", () => {
    const pola = (m: Mostek) => calculateMostkiTermiczne({ ...BAZA, mostki: [m] }).warnings.map((w) => w.field)
    expect(pola(mostek("A", -1, 0.1))).toContain("mostki.0.dlugoscM")
    expect(pola(mostek("A", 1, 5))).toContain("mostki.0.psiWmK")
    expect(pola(mostek("A", 1, 0.1, { psiPoPoprawieWmK: -3 }))).toContain("mostki.0.psiPoPoprawieWmK")
    const w = calculateMostkiTermiczne({ ...BAZA, temperaturaWewnetrznaC: -20 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]).toMatchObject({ code: "MT-TEMP-WEWN-NIE-WYZSZA", level: "critical" })
  })

  // PN-EN ISO 14683 Załącznik B — the norm's own worked example (Tablice B.2, 4 and 5).
  const przykladB = (dl: number[], z: Partial<Mostek>[] = []): Mostek[] =>
    ["R2", "C2", "GF6", "IW2", "IW6", "W8"].map((kod, i) => mostek(kod, dl[i]!, null, { kodKatalogu: kod, ...z[i] }))
  const DL_OI = [30, 10, 30, 5, 5, 23.6]

  it("Tablica A.2, wymiary całkowite wewnętrzne: Σ Ψoi·l = 69,85 W/K (Tablica B.2)", () => {
    const w = calculateMostkiTermiczne({ ...BAZA, mostki: przykladB(DL_OI), systemWymiarow: "oi" })
    expect(w.value!.hMostkowWK).toBeCloseTo(69.85, 9)
    expect(w.value!.mostki.map((m) => m.psiWmK)).toEqual([0.75, 0.1, 0.6, 0.95, 0, 1])
    expect(w.warnings.map((x) => x.code)).toEqual(["MT-PSI-Z-TABLICY-A2"])
    expect(w.assumptions).toContainEqual({ kod: "MT-ZALOZENIE-SYSTEM-OI" })
  })

  it("Tablica A.2, wymiary zewnętrzne: Σ Ψe·l = 58,88 W/K (Tablica 4), ujemne Ψe naroża", () => {
    const v = calculateMostkiTermiczne({ ...BAZA, mostki: przykladB([32.4, 12, 32.4, 6, 5.6, 23.6]), systemWymiarow: "e" }).value!
    expect(v.hMostkowWK).toBeCloseTo(58.88, 9)
    expect(v.mostki[1]!.hWK).toBeCloseTo(-1.2, 12)
  })

  it("poprawa detali IW2→IW5, W8→W11: 69,85 → 41,50 W/K (Tablica 5)", () => {
    const po: Partial<Mostek>[] = [{}, {}, {}, { kodKataloguPoPoprawie: "IW5" }, {}, { kodKataloguPoPoprawie: "W11" }]
    const v = calculateMostkiTermiczne({ ...BAZA, mostki: przykladB(DL_OI, po), systemWymiarow: "oi" }).value!
    expect(v.strataMostkowPoPoprawieW! / 40).toBeCloseTo(41.5, 9)
  })

  it("kod z tablicy bez systemu wymiarów → INCOMPLETE; kod ma pierwszeństwo przed wpisanym Ψ", () => {
    expect(calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("W", 1, null, { kodKatalogu: "W1" })] }).status).toBe("INCOMPLETE")
    const v = calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("W", 10, 0.5, { kodKatalogu: "P1" })], systemWymiarow: "i" }).value!
    expect(v.mostki[0]!.psiWmK).toBe(1.3)
    expect(v.mostki[0]!.kodKatalogu).toBe("P1")
  })

  it("nieznany kod → INVALID_INPUT; pusty kod = Ψ od użytkownika", () => {
    const w = calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("X", 1, null, { kodKatalogu: "W99" })], systemWymiarow: "e" })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]).toMatchObject({ code: "MT-NIEZNANY-KOD", field: "mostki.0.kodKatalogu", params: { kod: "W99" } })
    expect(calculateMostkiTermiczne({ ...BAZA, mostki: [mostek("X", 1, 0.2, { kodKatalogu: "" })] }).value!.hMostkowWK).toBeCloseTo(0.2, 12)
  })
})
