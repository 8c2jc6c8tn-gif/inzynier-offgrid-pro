import { describe, expect, it } from "vitest"
import { calculateSciezkaCen, mnoznikCenyEnergii, mnoznikKosztowBiezacych } from "../calculator"

// Control example — `03_M14_Dom_i_Firma_Siec.md` §4 („Przykład kontrolny”), from 2026, N = 15,
// 5 000 zł/year in 2026 prices. Recomputed independently in Python before implementation.
const baza = { rokBazowy: 2026, horyzontLat: 15, kosztRocznyZl: 5000 }

describe("calculateSciezkaCen — przykład kontrolny M14 §4", () => {
  it("g = 0 → 75 000 zł, mnożnik 1,0000", () => {
    const r = calculateSciezkaCen({ ...baza, tryb: { rodzaj: "suwak", gProcent: 0 } })
    expect(r.status).toBe("VALID")
    expect(r.value.mnoznikKoncowy).toBeCloseTo(1, 10)
    expect(r.value.sumaNominalnaZl).toBeCloseTo(75000, 6)
  })

  it("Ścieżka UE → mnożnik 1,1470 w 2041, ≈ 81 444 zł, średnio 0,92 %/rok, rok 1 = 1,0172", () => {
    const r = calculateSciezkaCen({ ...baza, tryb: { rodzaj: "ue" } })
    expect(r.status).toBe("VALID")
    expect(r.value.mnoznikKoncowy).toBeCloseTo(1.147, 4)
    expect(r.value.mnozniki[0]).toBeCloseTo(1.0172, 4)
    expect(r.value.sredniaProcentRok).toBeCloseTo(0.92, 2)
    expect(Math.round(r.value.sumaNominalnaZl)).toBe(81444)
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-UE-ZALOZENIA-2019")
  })

  it("UE + inflacja NBP 2,5% → 1,6612, ≈ 100 143 zł nominalnie, rok 1 = 1,0426", () => {
    const r = calculateSciezkaCen({
      ...baza,
      tryb: { rodzaj: "ue-inflacja", zrodloInflacji: "nbp", wlasnaInflacjaProcent: null },
    })
    expect(r.value.mnoznikKoncowy).toBeCloseTo(1.6612, 4)
    expect(r.value.mnozniki[0]).toBeCloseTo(1.0426, 4)
    expect(r.value.sredniaProcentRok).toBeCloseTo(3.44, 2)
    expect(Math.round(r.value.sumaNominalnaZl)).toBe(100143)
    // Ranking uses today's money = the plain EU path (D41).
    expect(Math.round(r.value.sumaDzisiejszeZl)).toBe(81444)
  })

  it("UE + inflacja GUS 3,58% (domyślna, D43) → 1,9440, ≈ 109 699 zł, rok 1 = 1,0536", () => {
    const r = calculateSciezkaCen({
      ...baza,
      tryb: { rodzaj: "ue-inflacja", zrodloInflacji: "gus", wlasnaInflacjaProcent: null },
    })
    expect(r.value.mnoznikKoncowy).toBeCloseTo(1.944, 4)
    expect(r.value.mnozniki[0]).toBeCloseTo(1.0536, 4)
    expect(r.value.sredniaProcentRok).toBeCloseTo(4.53, 2)
    expect(Math.floor(r.value.sumaNominalnaZl)).toBe(109699)
    expect(r.value.inflacjaProcent).toBeCloseTo(3.58, 10)
  })

  it("własna inflacja 0% daje wynik ścieżki UE", () => {
    const r = calculateSciezkaCen({
      ...baza,
      tryb: { rodzaj: "ue-inflacja", zrodloInflacji: "wlasna", wlasnaInflacjaProcent: 0 },
    })
    expect(Math.round(r.value.sumaNominalnaZl)).toBe(81444)
  })
})

describe("calculateSciezkaCen — walidacja i zakres", () => {
  it("N poza 10–25 → INVALID_INPUT", () => {
    const r = calculateSciezkaCen({ ...baza, horyzontLat: 9, tryb: { rodzaj: "suwak", gProcent: 0 } })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0].code).toBe("SIEC-HORYZONT-POZA-ZAKRESEM")
  })

  it("suwak tylko −3 / 0 / +5 / +10", () => {
    const r = calculateSciezkaCen({ ...baza, tryb: { rodzaj: "suwak", gProcent: 4 } })
    expect(r.status).toBe("INVALID_INPUT")
    const ok = calculateSciezkaCen({ ...baza, tryb: { rodzaj: "suwak", gProcent: 5 } })
    expect(ok.value.mnoznikKoncowy).toBeCloseTo(Math.pow(1.05, 15), 10)
  })

  it("brak własnej inflacji → INVALID_INPUT", () => {
    const r = calculateSciezkaCen({
      ...baza,
      tryb: { rodzaj: "ue-inflacja", zrodloInflacji: "wlasna", wlasnaInflacjaProcent: null },
    })
    expect(r.status).toBe("INVALID_INPUT")
  })

  it("ścieżka UE poza ostatnim punktem (2026 + 25 = 2051) → OUT_OF_SCOPE, bez ekstrapolacji", () => {
    const r = calculateSciezkaCen({ ...baza, horyzontLat: 25, tryb: { rodzaj: "ue" } })
    expect(r.status).toBe("OUT_OF_SCOPE")
    expect(r.warnings[0].code).toBe("SIEC-POZA-PROJEKCJA-UE")
    // The slider has no such limit.
    expect(calculateSciezkaCen({ ...baza, horyzontLat: 25, tryb: { rodzaj: "suwak", gProcent: 0 } }).status).toBe("VALID")
  })

  it("koszt 0 → INCOMPLETE", () => {
    expect(calculateSciezkaCen({ ...baza, kosztRocznyZl: 0, tryb: { rodzaj: "ue" } }).status).toBe("INCOMPLETE")
  })
})

describe("echo dla TCO", () => {
  it("koszty bieżące rosną o π tylko przy ścieżce z inflacją", () => {
    expect(mnoznikKosztowBiezacych({ rodzaj: "ue" }, 2026, 10)).toBe(1)
    expect(
      mnoznikKosztowBiezacych({ rodzaj: "ue-inflacja", zrodloInflacji: "nbp", wlasnaInflacjaProcent: null }, 2026, 2),
    ).toBeCloseTo(1.025 * 1.025, 12)
  })

  it("mnożnik UE na punkcie siatki = iloraz punktów (2030 / 2025)", () => {
    expect(mnoznikCenyEnergii({ rodzaj: "ue" }, 2025, 5)).toBeCloseTo(145.49 / 133.59, 12)
  })
})
