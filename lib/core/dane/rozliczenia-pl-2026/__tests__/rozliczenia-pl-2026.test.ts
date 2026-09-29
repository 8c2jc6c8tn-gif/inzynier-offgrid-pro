import { describe, expect, it } from "vitest"
import surowe from "../rozliczenia-pl-2026.json"
import {
  DANE_ROZLICZEN,
  RozliczeniaSchema,
  czyPoWaznosci,
  oplataMocowaRyczaltZlMies,
  stawkaRoczna,
  stawkiOsd,
  stawkiOsdWRoku,
  wartoscWDniu,
} from ".."

describe("rozliczenia-pl-2026 — schemat (DANE-1)", () => {
  it("plik przechodzi walidację Zod", () => {
    expect(() => RozliczeniaSchema.parse(surowe)).not.toThrow()
  })

  it("wartość 🔎 (pewnosc inna niż „potwierdzone”) jest odrzucana", () => {
    const zly = structuredClone(surowe) as { krajowe: { oplataOze: { pewnosc: string } } }
    zly.krajowe.oplataOze.pewnosc = "wtorne-A"
    expect(RozliczeniaSchema.safeParse(zly).success).toBe(false)
  })

  it("ujemna stawka jest odrzucana", () => {
    const zly = structuredClone(surowe) as { krajowe: { oplataOze: { okresy: { wartosc: number }[] } } }
    zly.krajowe.oplataOze.okresy[0].wartosc = -1
    expect(RozliczeniaSchema.safeParse(zly).success).toBe(false)
  })

  it("PGE, inny OSD — brak stawek (tylko tryb faktury)", () => {
    for (const id of ["pge", "inny"] as const) {
      expect(stawkiOsd(id, "G11", "2026-06-01")).toBeNull()
    }
  })

  it("Stoen C22a/C22b — jedna stawka „jednostrefowy” 0,1481 w obu strefach (tab. 7.3); abonament G 6/12 mies.", () => {
    expect(stawkiOsd("stoen", "C22a", "2026-06-01")?.strefy).toEqual({ szczyt: 0.1481, pozaszczyt: 0.1481 })
    expect(stawkiOsd("stoen", "C22b", "2026-06-01")?.stalaCZlKw).toBe(18.33)
    expect(stawkiOsd("stoen", "C21", "2026-06-01")?.strefy.calodobowa).toBe(0.1481)
    expect(stawkiOsd("stoen", "G11", "2026-06-01")?.abonament).toEqual({ "1": 2.88, "6": 0.48, "12": 0.24 })
  })

  it("Tauron abonament C: C11/C12 4,56/2,28/0,76/0,38; C21/C22 9,50 tylko 1 mies.", () => {
    expect(stawkiOsd("tauron", "C12b", "2026-06-01")?.abonament).toEqual({ "1": 4.56, "2": 2.28, "6": 0.76, "12": 0.38 })
    expect(stawkiOsd("tauron", "C22a", "2026-06-01")?.abonament).toEqual({ "1": 9.5 })
  })

  it("Enea (skan taryfy, decyzja URE 17.12.2025): G11 7,45 / 10,41 i 0,2456; C22a 24,84 i 0,1538 w obu strefach", () => {
    const g = stawkiOsd("enea", "G11", "2026-06-01")
    expect(g?.stalaG).toEqual({ jednofazowa: 7.45, trojfazowa: 10.41 })
    expect(g?.strefy.calodobowa).toBe(0.2456)
    expect(g?.abonament).toEqual({ "1": 3.84, "2": 1.92, "6": 0.64, "12": 0.32 })
    const c = stawkiOsd("enea", "C22a", "2026-06-01")
    expect(c?.stalaCZlKw).toBe(24.84)
    expect(c?.strefy).toEqual({ szczyt: 0.1538, pozaszczyt: 0.1538 })
    expect(c?.abonament).toEqual({ "1": 10 })
  })

  it("Enea G — netto × 1,23 = stawki brutto z informacji OSD (kontrola odczytu skanu)", () => {
    const brutto = (v: number, m: number) => Math.round(v * 1.23 * 10 ** m) / 10 ** m
    expect(brutto(stawkiOsd("enea", "G12", "2026-06-01")!.strefy.dzien!, 4)).toBe(0.3418)
    expect(brutto(stawkiOsd("enea", "G12w", "2026-06-01")!.stalaG!.trojfazowa, 2)).toBe(32.26)
  })

  it("odczyt pierwotny: Tauron G11 7,38 / 10,86 i 0,2464; Energa G12 stała 14,35", () => {
    const t = stawkiOsd("tauron", "G11", "2026-03-15")
    expect(t?.stalaG).toEqual({ jednofazowa: 7.38, trojfazowa: 10.86 })
    expect(t?.strefy.calodobowa).toBe(0.2464)
    expect(stawkiOsdWRoku("energa", "G12", 2026)?.stalaG?.jednofazowa).toBe(14.35)
  })
})

describe("rozliczenia-pl-2026 — okresy ważności", () => {
  const jakosciowa = DANE_ROZLICZEN.krajowe.stawkaJakosciowaNn

  it("stawka jakościowa: 0,0331 w styczniu, 0,0332 od 1.02.2026", () => {
    expect(wartoscWDniu(jakosciowa.okresy, "2026-01-31")).toBe(0.0331)
    expect(wartoscWDniu(jakosciowa.okresy, "2026-02-01")).toBe(0.0332)
    expect(wartoscWDniu(jakosciowa.okresy, "2027-01-01")).toBeNull()
  })

  it("bez danych miesięcznych — stawka obowiązująca najdłużej (0,0332)", () => {
    const r = stawkaRoczna(jakosciowa, 2026, null)
    expect(r).toEqual({ wartosc: 0.0332, metoda: "najdluzej", zmiennaWRoku: true })
  })

  it("z danymi miesięcznymi — średnia ważona zużyciem", () => {
    const miesiace = [200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    const r = stawkaRoczna(jakosciowa, 2026, miesiace)
    expect(r?.metoda).toBe("srednia-wazona")
    expect(r?.wartosc).toBeCloseTo((200 * 0.0331 + 1100 * 0.0332) / 1300, 12)
  })

  it("stawka stała w roku — zmiennaWRoku = false", () => {
    expect(stawkaRoczna(DANE_ROZLICZEN.krajowe.oplataOze, 2026, null)?.zmiennaWRoku).toBe(false)
  })

  it("po waznoscDo (31.12.2026) — ostrzeżenie", () => {
    expect(czyPoWaznosci("2026-12-31")).toBe(false)
    expect(czyPoWaznosci("2027-01-01")).toBe(true)
  })
})

describe("opłata mocowa — ryczałt G, progi 1:1 wg art. 89b ust. 3", () => {
  const progi = DANE_ROZLICZEN.krajowe.oplataMocowaRyczalt.okresy[0].wartosc
  it.each([
    [0, 4.29],
    [499.99, 4.29],
    [500, 10.31],
    [1200, 10.31],
    [1200.01, 17.18],
    [2800, 17.18],
    [2800.01, 24.05],
    [10000, 24.05],
  ])("%s kWh/rok → %s zł/mies.", (kwh, zl) => {
    expect(oplataMocowaRyczaltZlMies(kwh, progi)).toBe(zl)
  })
})
