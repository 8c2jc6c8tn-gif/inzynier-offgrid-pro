import { describe, expect, it } from "vitest"
import { calculateTestAkumulatora } from "../calculator"

const BAZA = {
  chemia: "olow" as const,
  napiecieZnamionoweV: 12,
  napiecieSpoczynkoweV: 12.6,
  mocObciazeniaW: 0,
  napiecieObciazenieV: 0,
  rezystancjaKartaMOhm: 0,
}

describe("calculateTestAkumulatora (M12/E33, dawne 8.60)", () => {
  it("sam spoczynek 12,6 V, ołów → niejasny, ℹ️ test pojemności, status VALID", () => {
    const w = calculateTestAkumulatora(BAZA)
    expect(w.value.stan).toBe("niejasny")
    expect(w.status).toBe("VALID")
    expect(w.warnings.map((x) => x.code)).toEqual(["TA-BRAK-ODNIESIENIA"])
    expect(w.value.progWyrzuceniaV).toBeCloseTo(10.5, 12)
  })

  it("Biblia §12.48: 10,5 V w spoczynku (12 V ołów) → uszkodzony 🟡", () => {
    const w = calculateTestAkumulatora({ ...BAZA, napiecieSpoczynkoweV: 10.5 })
    expect(w.value.stan).toBe("uszkodzony")
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([["TA-PONIZEJ-PROGU-WYRZUCENIA", "warning"]])
  })

  it("24 V ołów: próg przeliczony przez ogniwa → 21 V", () => {
    const w = calculateTestAkumulatora({ ...BAZA, napiecieZnamionoweV: 24, napiecieSpoczynkoweV: 21.5 })
    expect(w.value.progWyrzuceniaV).toBeCloseTo(21, 12)
    expect(w.value.stan).toBe("niejasny")
  })

  it("przykład Biblii 12,6 → 12,0 V przy 50 W: R = 0,6 / (50/12) = 144 mΩ (Python)", () => {
    const w = calculateTestAkumulatora({ ...BAZA, mocObciazeniaW: 50, napiecieObciazenieV: 12 })
    expect(w.value.pradA).toBeCloseTo(50 / 12, 12)
    expect(w.value.spadekV).toBeCloseTo(0.6, 12)
    expect(w.value.rezystancjaMOhm).toBeCloseTo(144, 9)
  })

  it("karta 10 mΩ, zmierzone 14,4 mΩ (+44%) → dobry; 16 mΩ (+60%) → do wymiany 🟡", () => {
    const dobry = calculateTestAkumulatora({ ...BAZA, mocObciazeniaW: 500, napiecieObciazenieV: 12, rezystancjaKartaMOhm: 10, napiecieSpoczynkoweV: 12.6 })
    // I = 41,67 A, ΔU = 0,6 V → R = 14,4 mΩ
    expect(dobry.value.rezystancjaMOhm).toBeCloseTo(14.4, 9)
    expect(dobry.value.wzrostPct).toBeCloseTo(44, 9)
    expect(dobry.value.stan).toBe("dobry")
    expect(dobry.status).toBe("VALID")
    const zly = calculateTestAkumulatora({ ...BAZA, mocObciazeniaW: 450, napiecieObciazenieV: 12, rezystancjaKartaMOhm: 10 })
    // I = 37,5 A, ΔU = 0,6 V → R = 16 mΩ → +60%
    expect(zly.value.stan).toBe("do-wymiany")
    expect(zly.warnings.map((x) => x.code)).toEqual(["TA-REZYSTANCJA-WZROSLA"])
  })

  it("LiFePO4: bez progu napięciowego, ℹ️ płaska krzywa", () => {
    const w = calculateTestAkumulatora({ ...BAZA, chemia: "lifepo4", napiecieSpoczynkoweV: 10 })
    expect(w.value.stan).toBe("niejasny")
    expect(w.value.progWyrzuceniaV).toBe(0)
    expect(w.warnings.map((x) => x.code)).toEqual(["TA-LIFEPO4-PLASKA-KRZYWA", "TA-BRAK-ODNIESIENIA"])
  })

  it("napięcie pod obciążeniem ≥ spoczynkowego → INVALID_INPUT", () => {
    const w = calculateTestAkumulatora({ ...BAZA, mocObciazeniaW: 50, napiecieObciazenieV: 12.7 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.code).toBe("TA-OBCIAZENIE-NIE-NIZSZE")
  })

  it("brak chemii albo test obciążeniowy w połowie → INCOMPLETE", () => {
    expect(calculateTestAkumulatora({ ...BAZA, chemia: null }).status).toBe("INCOMPLETE")
    expect(calculateTestAkumulatora({ ...BAZA, mocObciazeniaW: 50 }).status).toBe("INCOMPLETE")
  })
})
