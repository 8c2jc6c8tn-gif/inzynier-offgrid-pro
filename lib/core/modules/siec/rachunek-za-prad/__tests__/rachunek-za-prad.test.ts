import { describe, expect, it } from "vitest"
import { calculateRachunek } from "../calculator"
import type { RachunekInput } from "../input"

const dom: RachunekInput = {
  segment: "dom",
  osd: "tauron",
  grupa: "G11",
  dataRozliczenia: "2026-06-30",
  fazy: "jednofazowa",
  mocUmownaKw: 0,
  okresRozliczeniowy: "1",
  zuzycieStrefKwh: { calodobowa: 2000 },
  zuzycieMiesieczneKwh: null,
  cenaEnergiiZlKwh: { calodobowa: 0.5 },
  oplataHandlowaZlMies: 0,
  energiaMocowaKwh: null,
  stawkiWlasne: {},
}

const firma: RachunekInput = {
  ...dom,
  segment: "firma",
  osd: "energa",
  grupa: "C21",
  mocUmownaKw: 50,
  zuzycieStrefKwh: { calodobowa: 100000 },
  cenaEnergiiZlKwh: { calodobowa: 0.6 },
  oplataHandlowaZlMies: 20,
  energiaMocowaKwh: 60000,
}

const braki = (r: ReturnType<typeof calculateRachunek>) =>
  r.warnings.map((w) => w.code).filter((c) => c.startsWith("SIEC-BRAK-"))

const kwota = (r: ReturnType<typeof calculateRachunek>, kod: string) =>
  r.value.skladniki.find((s) => s.kod === kod)?.kwotaNettoZl

describe("calculateRachunek — Dom (D1), Tauron G11, stawki ✅ z pliku danych", () => {
  // Hand arithmetic: 2 000 kWh; sieć zm. 0,2464; stała 1f 7,38; abonament 1 mies. 4,56;
  // mocowa ryczałt (1 200–2 800 kWh) 17,18; jakościowa 0,0332 (najdłużej); OZE 0,0073; kog. 0,003.
  const r = calculateRachunek(dom)

  it("składniki roczne netto", () => {
    expect(r.status).toBe("VALID")
    expect(kwota(r, "energia")).toBeCloseTo(1000, 9)
    expect(kwota(r, "sieciowaZmienna")).toBeCloseTo(492.8, 9)
    expect(kwota(r, "sieciowaStala")).toBeCloseTo(88.56, 9)
    expect(kwota(r, "abonament")).toBeCloseTo(54.72, 9)
    expect(kwota(r, "mocowa")).toBeCloseTo(206.16, 9)
    expect(kwota(r, "jakosciowa")).toBeCloseTo(66.4, 9)
    expect(kwota(r, "oze")).toBeCloseTo(14.6, 9)
    expect(kwota(r, "kogeneracyjna")).toBeCloseTo(6, 9)
  })

  it("netto 1 929,24 zł, brutto × 1,23, „cena trzymania sieci” = stałe × 1,23", () => {
    expect(r.value.nettoZl).toBeCloseTo(1929.24, 9)
    expect(r.value.bruttoZl).toBeCloseTo(1929.24 * 1.23, 9)
    expect(r.value.staleNettoZl).toBeCloseTo(88.56 + 54.72 + 206.16, 9)
    expect(r.value.cenaTrzymaniaSieciBruttoZl).toBeCloseTo((88.56 + 54.72 + 206.16) * 1.23, 9)
    expect(r.value.sredniaCenaKwhBruttoZl).toBeCloseTo((1929.24 * 1.23) / 2000, 12)
  })

  it("stawka jakościowa zmienna w roku bez danych miesięcznych → informacja", () => {
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-STAWKA-NAJDLUZEJ")
    expect(r.warnings.every((w) => w.level === "info")).toBe(true)
  })

  it("z danymi miesięcznymi — jakościowa ważona zużyciem", () => {
    const miesiace = [300, 200, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
    const w = calculateRachunek({ ...dom, zuzycieMiesieczneKwh: miesiace })
    expect(kwota(w, "jakosciowa")).toBeCloseTo(300 * 0.0331 + 1700 * 0.0332, 9)
    expect(w.warnings.map((x) => x.code)).not.toContain("SIEC-STAWKA-NAJDLUZEJ")
  })

  it("trójfaz. i okres 2-mies. biorą właściwe stawki", () => {
    const w = calculateRachunek({ ...dom, fazy: "trojfazowa", okresRozliczeniowy: "2" })
    expect(kwota(w, "sieciowaStala")).toBeCloseTo(12 * 10.86, 9)
    expect(kwota(w, "abonament")).toBeCloseTo(12 * 2.28, 9)
  })

  it("próg opłaty mocowej przy 2 801 kWh → 24,05 zł/mies.", () => {
    const w = calculateRachunek({ ...dom, zuzycieStrefKwh: { calodobowa: 2801 } })
    expect(kwota(w, "mocowa")).toBeCloseTo(12 * 24.05, 9)
  })
})

describe("calculateRachunek — Firma (F1), Energa C21", () => {
  const r = calculateRachunek(firma)
  it("stała = 12 × 34,84 × 50 kW, mocowa = 60 000 × 0,2194 (zmienna)", () => {
    expect(r.status).toBe("VALID")
    expect(kwota(r, "sieciowaStala")).toBeCloseTo(12 * 34.84 * 50, 9)
    expect(kwota(r, "abonament")).toBeCloseTo(12 * 7.4, 9)
    expect(kwota(r, "mocowa")).toBeCloseTo(60000 * 0.2194, 9)
    expect(r.value.skladniki.find((s) => s.kod === "mocowa")?.charakter).toBe("zmienny")
    expect(r.value.nettoZl).toBeCloseTo(127866.8, 6)
  })

  it("brak energii w godzinach 7–22 → INCOMPLETE", () => {
    const w = calculateRachunek({ ...firma, energiaMocowaKwh: null })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.warnings.map((x) => x.code)).toContain("SIEC-BRAK-ENERGIAMOCOWA")
  })

  it("Tauron C21 — abonament 9,50 z taryfy (odczyt 29.09.2026)", () => {
    const r = calculateRachunek({ ...firma, osd: "tauron" })
    expect(r.status).toBe("VALID")
    expect(r.value.skladniki.find((s) => s.kod === "abonament")?.zrodlo).toBe("taryfa")
    expect(kwota(r, "abonament")).toBeCloseTo(9.5 * 12, 6)
  })

  it("Tauron C21 przy okresie 2-mies. — taryfa nie podaje abonamentu → wymaga wpisu z faktury", () => {
    const w = calculateRachunek({ ...firma, osd: "tauron", okresRozliczeniowy: "2" })
    expect(w.status).toBe("INCOMPLETE")
    expect(braki(w)).toEqual(["SIEC-BRAK-ABONAMENT"])
    const zFaktury = calculateRachunek({ ...firma, osd: "tauron", okresRozliczeniowy: "2", stawkiWlasne: { abonamentZlMies: 10 } })
    expect(zFaktury.status).toBe("VALID")
    expect(zFaktury.value.skladniki.find((s) => s.kod === "abonament")?.zrodlo).toBe("faktura")
  })
})

describe("calculateRachunek — walidacja i tryb „moje dane z faktury” (D36)", () => {
  it("C11 przy 50 kW → INVALID_INPUT (C1x ≤ 40 kW)", () => {
    const r = calculateRachunek({ ...firma, grupa: "C11" })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0].code).toBe("SIEC-GRUPA-NIEZGODNA-Z-MOCA")
  })

  it("C21 przy 40 kW → INVALID_INPUT (C2x > 40 kW)", () => {
    expect(calculateRachunek({ ...firma, mocUmownaKw: 40 }).status).toBe("INVALID_INPUT")
  })

  it("grupa G w segmencie firma → INVALID_INPUT", () => {
    expect(calculateRachunek({ ...firma, grupa: "G11" }).warnings[0].code).toBe("SIEC-GRUPA-NIEZGODNA-Z-SEGMENTEM")
  })

  it("strefa spoza grupy → INVALID_INPUT", () => {
    expect(calculateRachunek({ ...dom, zuzycieStrefKwh: { dzien: 100 } }).status).toBe("INVALID_INPUT")
  })

  it("PGE bez danych → INCOMPLETE z listą braków, bez zgadywania", () => {
    const r = calculateRachunek({ ...dom, osd: "pge" })
    expect(r.status).toBe("INCOMPLETE")
    expect(braki(r).sort()).toEqual(
      ["SIEC-BRAK-ABONAMENT", "SIEC-BRAK-SIECIOWAZMIENNA", "SIEC-BRAK-SIECIOWASTALA"].sort(),
    )
  })

  it("PGE z danymi z faktury → liczy, źródło „faktura”", () => {
    const r = calculateRachunek({
      ...dom,
      osd: "pge",
      stawkiWlasne: { sieciowaZmienna: { calodobowa: 0.3 }, sieciowaStala: 8, abonamentZlMies: 4 },
    })
    expect(r.status).toBe("VALID")
    expect(kwota(r, "sieciowaZmienna")).toBeCloseTo(600, 9)
    expect(r.value.skladniki.find((s) => s.kod === "sieciowaStala")?.zrodlo).toBe("faktura")
  })

  it("brak ceny energii i opłaty handlowej → INCOMPLETE", () => {
    const r = calculateRachunek({ ...dom, cenaEnergiiZlKwh: {}, oplataHandlowaZlMies: null })
    expect(r.warnings.map((w) => w.code)).toEqual(
      expect.arrayContaining(["SIEC-BRAK-CENAENERGII", "SIEC-BRAK-OPLATAHANDLOWA"]),
    )
  })

  it("rozliczenie w 2027 — stawki po terminie: ostrzeżenie i tryb faktury", () => {
    const r = calculateRachunek({ ...dom, dataRozliczenia: "2027-03-01" })
    expect(r.status).toBe("INCOMPLETE")
    expect(r.warnings.map((w) => w.code)).toContain("SIEC-STAWKI-PO-WAZNOSCI")
  })
})
