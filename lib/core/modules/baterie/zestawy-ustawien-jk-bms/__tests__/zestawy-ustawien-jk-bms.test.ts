import { describe, expect, it } from "vitest"
import { calculateZestawyUstawienJkBms } from "../calculator"
import { ZESTAWY } from "../constants"

const ID = "pozytywnie-nauczeni-314ah-16s"

describe("calculateZestawyUstawienJkBms", () => {
  it("INCOMPLETE — set not chosen yet", () => {
    const r = calculateZestawyUstawienJkBms({ zestawId: "" })
    expect(r.status).toBe("INCOMPLETE")
    expect(r.value.wiersze).toEqual([])
  })

  it("INVALID_INPUT — id not in the catalogue", () => {
    const r = calculateZestawyUstawienJkBms({ zestawId: "nie-ma" })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0].code).toBe("ZJK-NIEZNANY-ZESTAW")
  })

  it("derives pack voltages as cell voltage × 16 (OVP 57.6 V, UVP 42.4 V)", () => {
    const r = calculateZestawyUstawienJkBms({ zestawId: ID })
    expect(r.value.liczbaOgniw).toBe(16)
    expect(r.value.pochodne?.ovpPakietV).toBeCloseTo(57.6, 6)
    expect(r.value.pochodne?.uvpPakietV).toBeCloseTo(42.4, 6)
    const balans = r.value.wiersze.find((w) => w.id === "startBalanceVolt")
    expect(balans?.pakietV).toBeCloseTo(54.4, 6)
    expect(balans?.pakietAlternatywaV).toBeCloseTo(55.2, 6)
  })

  it("derives the C-rate of the continuous currents (100 A / 314 Ah ≈ 0.318)", () => {
    const r = calculateZestawyUstawienJkBms({ zestawId: ID })
    expect(r.value.wiersze.find((w) => w.id === "continuedCharge")?.cRate).toBeCloseTo(0.318, 3)
    expect(r.value.wiersze.find((w) => w.id === "continuedDischarge")?.cRate).toBeCloseTo(0.318, 3)
  })

  it("derives the OVP and UVP hysteresis (0.200 V and 0.150 V)", () => {
    const p = calculateZestawyUstawienJkBms({ zestawId: ID }).value.pochodne
    expect(p?.histerezaOvpV).toBeCloseTo(0.2, 6)
    expect(p?.histerezaUvpV).toBeCloseTo(0.15, 6)
  })

  it("compares only the confirmed parameters with the source; the five unconfirmed ones stay unmatched", () => {
    const w = calculateZestawyUstawienJkBms({ zestawId: ID }).value.wiersze
    const zg = (id: string) => w.find((x) => x.id === id)?.zgodnosc
    expect(zg("cellOvp")).toBe("zgodne")
    expect(zg("cellUvp")).toBe("zgodne")
    expect(zg("startBalanceVolt")).toBe("zgodne")
    expect(zg("continuedCharge")).toBe("zgodne")
    expect(zg("continuedDischarge")).toBe("brak-odniesienia")
    expect(w.filter((x) => x.zgodnosc === "do-potwierdzenia").map((x) => x.id)).toEqual([
      "cellRcv",
      "soc100",
      "soc0",
      "cellRfv",
      "smartSleep",
    ])
  })

  it("flags the missing temperature hysteresis (UTPR = UTP = 5 °C) and the five unconfirmed parameters", () => {
    const r = calculateZestawyUstawienJkBms({ zestawId: ID })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const kody = r.warnings.map((x) => x.code)
    expect(kody).toContain("ZJK-BRAK-HISTEREZY-TEMP")
    expect(kody).toContain("ZJK-DO-POTWIERDZENIA")
    expect(r.warnings.find((x) => x.code === "ZJK-DO-POTWIERDZENIA")?.params).toEqual({ liczba: 5 })
    expect(kody).not.toContain("ZJK-KOLEJNOSC-PROGOW")
    expect(r.warnings.every((x) => x.level !== "critical")).toBe(true)
  })

  it("the catalogue entries have unique ids and unique parameter ids", () => {
    expect(new Set(ZESTAWY.map((z) => z.id)).size).toBe(ZESTAWY.length)
    for (const z of ZESTAWY) expect(new Set(z.parametry.map((p) => p.id)).size).toBe(z.parametry.length)
  })
})
