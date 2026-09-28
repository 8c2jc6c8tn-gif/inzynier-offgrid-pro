import { describe, expect, it } from "vitest"
import { calculatePorownanieTaryf } from "../calculator"
import type { PorownanieTaryfInput } from "../input"
import { calculateRachunek } from "../../rachunek-za-prad/calculator"

const wspolne = {
  osd: "tauron" as const,
  dataRozliczenia: "2026-06-30",
  fazy: "jednofazowa" as const,
  mocUmownaKw: 0,
  okresRozliczeniowy: "1" as const,
  zuzycieMiesieczneKwh: null,
  oplataHandlowaZlMies: 0,
  energiaMocowaKwh: null,
}

const dom: PorownanieTaryfInput = {
  ...wspolne,
  segment: "dom",
  warianty: [
    { grupa: "G11", zuzycieStrefKwh: { calodobowa: 3000 }, cenaEnergiiZlKwh: { calodobowa: 0.5 } },
    { grupa: "G12", zuzycieStrefKwh: { dzien: 1500, noc: 1500 }, cenaEnergiiZlKwh: { dzien: 0.55, noc: 0.4 } },
  ],
}

describe("calculatePorownanieTaryf — D2 (G)", () => {
  it("ranking rosnąco po brutto, każda pozycja = rachunek tej grupy (echo)", () => {
    const r = calculatePorownanieTaryf(dom)
    expect(r.status).toBe("VALID")
    const g11 = calculateRachunek({ ...wspolne, segment: "dom", ...dom.warianty[0], stawkiWlasne: {} })
    const g12 = calculateRachunek({ ...wspolne, segment: "dom", ...dom.warianty[1], stawkiWlasne: {} })
    const tanszy = g11.value.bruttoZl < g12.value.bruttoZl ? "G11" : "G12"
    expect(r.value.najtanszaGrupa).toBe(tanszy)
    expect(r.value.pozycje.map((p) => p.rachunek!.bruttoZl)).toEqual(
      [g11.value.bruttoZl, g12.value.bruttoZl].sort((a, b) => a - b),
    )
  })

  it("różne zużycie roczne wariantów → ostrzeżenie", () => {
    const r = calculatePorownanieTaryf({
      ...dom,
      warianty: [dom.warianty[0], { ...dom.warianty[1], zuzycieStrefKwh: { dzien: 1000, noc: 1000 } }],
    })
    expect(r.warnings[0].code).toBe("SIEC-ROZNE-ZUZYCIE-WARIANTOW")
  })

  it("PGE — grupy bez stawek wyłączone, nic nie zgadujemy", () => {
    const r = calculatePorownanieTaryf({ ...dom, osd: "pge" })
    expect(r.status).toBe("INCOMPLETE")
    expect(r.value.pozycje.every((p) => p.wylaczona === "brak-stawek")).toBe(true)
  })

  it("grupa podana dwa razy → INVALID_INPUT", () => {
    expect(calculatePorownanieTaryf({ ...dom, warianty: [dom.warianty[0], dom.warianty[0]] }).status).toBe("INVALID_INPUT")
  })
})

describe("calculatePorownanieTaryf — F2 (C), ✏️ K8", () => {
  const firma: PorownanieTaryfInput = {
    ...wspolne,
    segment: "firma",
    osd: "energa",
    mocUmownaKw: 30,
    oplataHandlowaZlMies: 20,
    energiaMocowaKwh: 20000,
    warianty: [
      { grupa: "C11", zuzycieStrefKwh: { calodobowa: 40000 }, cenaEnergiiZlKwh: { calodobowa: 0.6 } },
      { grupa: "C21", zuzycieStrefKwh: { calodobowa: 40000 }, cenaEnergiiZlKwh: { calodobowa: 0.6 } },
      { grupa: "G11", zuzycieStrefKwh: { calodobowa: 40000 }, cenaEnergiiZlKwh: { calodobowa: 0.6 } },
    ],
  }

  it("przy 30 kW C21 wyłączona („moc”), nie „gorsza”; G11 wyłączona („segment”)", () => {
    const r = calculatePorownanieTaryf(firma)
    expect(r.value.najtanszaGrupa).toBe("C11")
    expect(r.value.pozycje.find((p) => p.grupa === "C21")?.wylaczona).toBe("moc")
    expect(r.value.pozycje.find((p) => p.grupa === "G11")?.wylaczona).toBe("segment")
  })
})
