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

  it("PGE, Enea, inny OSD — brak stawek (tylko tryb faktury)", () => {
    for (const id of ["pge", "enea", "inny"] as const) {
      expect(stawkiOsd(id, "G11", "2026-06-01")).toBeNull()
    }
  })

  it("Stoen C22a/C22b — brak w danych (🔎, do odczytu wizualnego)", () => {
    expect(stawkiOsd("stoen", "C22a", "2026-06-01")).toBeNull()
    expect(stawkiOsd("stoen", "C21", "2026-06-01")?.strefy.calodobowa).toBe(0.1481)
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
