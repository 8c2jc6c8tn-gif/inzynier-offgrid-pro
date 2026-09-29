import { describe, expect, it } from "vitest"
import { calculatePrzelacznik } from "../calculator"
import type { PrzelacznikInput } from "../input"

const wejscie = (z: Partial<PrzelacznikInput> = {}): PrzelacznikInput => ({
  trybPracy: "przelaczany",
  przelacznik: "reczny-z-zerem-blokada",
  przelaczaN: true,
  zgloszenieOsd: null,
  maAgregat: false,
  miejsceAgregatu: null,
  podlaczenieAgregatu: null,
  ...z,
})
const kody = (z: Partial<PrzelacznikInput>) => calculatePrzelacznik(wejscie(z)).warnings.map((w) => w.code)

describe("przelacznik-siec-wyspa — twarde stopy §6", () => {
  it("brak trybu pracy → INCOMPLETE", () => {
    expect(calculatePrzelacznik(wejscie({ trybPracy: null })).status).toBe("INCOMPLETE")
  })
  it("przełączany bez wybranego przełącznika → INCOMPLETE", () => {
    expect(calculatePrzelacznik(wejscie({ przelacznik: null })).status).toBe("INCOMPLETE")
  })
  it("przełącznik z 0 i blokadą, N przełączane → VALID, bez stopów", () => {
    const r = calculatePrzelacznik(wejscie())
    expect(r.status).toBe("VALID")
    expect(r.value.twardeStopy).toBe(0)
    expect(kody({})).toEqual(["SIEC-PRZELACZNIK-OK", "SIEC-PRZELACZNIK-NORMA-BRAK"])
  })
  it("🔴 stop 1: brak przełącznika / bez blokady → SIEC-BACKFEED", () => {
    const r = calculatePrzelacznik(wejscie({ przelacznik: "brak-lub-bez-blokady" }))
    expect(r.value.backfeed).toBe(true)
    expect(r.warnings.find((w) => w.code === "SIEC-BACKFEED")?.level).toBe("critical")
  })
  it("N nieprzełączane albo nieznane → ostrzeżenie", () => {
    expect(kody({ przelaczaN: false })).toContain("SIEC-PRZELACZNIK-N")
    expect(kody({ przelaczaN: null })).toContain("SIEC-PRZELACZNIK-N")
  })
  it("praca równoległa → informacja o zgłoszeniu; bez zgłoszenia → ostrzeżenie", () => {
    expect(kody({ trybPracy: "rownolegle" })).toContain("SIEC-TCO-PRACA-ROWNOLEGLA")
    expect(kody({ trybPracy: "rownolegle", zgloszenieOsd: false })).toContain("SIEC-ROWNOLEGLE-BEZ-ZGLOSZENIA")
  })
  it("🔴 stopy 2 i 3: agregat bez przełącznika i w budynku (echo M2/E17, D48)", () => {
    const r = calculatePrzelacznik(
      wejscie({ trybPracy: "bez-sieci", maAgregat: true, miejsceAgregatu: "wewnatrz-budynku", podlaczenieAgregatu: "bez-przelacznika" }),
    )
    expect(r.value.twardeStopy).toBe(2)
    expect(r.warnings.map((w) => w.code)).toEqual(expect.arrayContaining(["AGREGAT-W-BUDYNKU-CZAD", "AGREGAT-BEZ-PRZELACZNIKA"]))
  })
})
