import { describe, expect, it } from "vitest"
import { calculateWeekend } from "../calculator"

const BAZA = {
  dni: 2,
  osoby: 4,
  urzadzenia: [
    { nazwa: "LED", mocW: 10, godzinNaDobe: 5, naOsobe: false },
    { nazwa: "Ładowarka", mocW: 10, godzinNaDobe: 2, naOsobe: true },
    { nazwa: "Radio", mocW: 5, godzinNaDobe: 4, naOsobe: false },
  ],
  pojemnoscAh: 100,
  napiecieV: 12,
  dodPct: 50,
  mocPaneluW: 0,
  godzinSlonca: 0,
  sprawnoscToruPct: 0,
}

describe("calculateWeekend (M12/E5, dawne 8.5)", () => {
  it("doba: 10×5 + 10×2×4 + 5×4 = 150 Wh; pobyt 300 Wh; akumulator 600 Wh → 4 doby bez słońca, OK", () => {
    const w = calculateWeekend(BAZA)
    expect(w.status).toBe("VALID")
    expect(w.value.zuzycieDobaWh).toBe(150)
    expect(w.value.zuzyciePobytWh).toBe(300)
    expect(w.value.energiaAkumulatoraWh).toBeCloseTo(600, 12)
    expect(w.value.dniBezSlonca).toBeCloseTo(4, 12)
    expect(w.value.bilansPobytuWh).toBeCloseTo(300, 12)
  })

  it("przykład Biblii §12.5: 800 Wh/dobę, 12 V 80 Ah przy DoD 100% → 1,2 doby; pobyt 2 dni → 🟡", () => {
    const w = calculateWeekend({
      ...BAZA,
      osoby: 1,
      urzadzenia: [{ nazwa: "Razem", mocW: 800, godzinNaDobe: 1, naOsobe: false }],
      pojemnoscAh: 80,
      dodPct: 100,
    })
    expect(w.value.dniBezSlonca).toBeCloseTo(1.2, 12)
    expect(w.warnings.map((x) => x.code)).toEqual(["WK-BRAK-NA-POCHMURNY-POBYT"])
  })

  it("panel 100 W × 4 h × 80% = 320 Wh/dobę; 800 Wh/dobę, 960 Wh akum., 2 dni: 960 + 640 − 1600 = 0 → bez 🟡 panelu", () => {
    const w = calculateWeekend({
      ...BAZA,
      osoby: 1,
      urzadzenia: [{ nazwa: "Razem", mocW: 800, godzinNaDobe: 1, naOsobe: false }],
      pojemnoscAh: 80,
      dodPct: 100,
      mocPaneluW: 100,
      godzinSlonca: 4,
      sprawnoscToruPct: 80,
    })
    expect(w.value.produkcjaPaneluDobaWh).toBeCloseTo(320, 12)
    expect(w.value.bilansPobytuWh).toBeCloseTo(0, 9)
    expect(w.warnings.map((x) => x.code)).toEqual(["WK-BRAK-NA-POCHMURNY-POBYT"])
  })

  it("3 dni z tym samym panelem: bilans −480 Wh → 🟡 WK-BRAK-NAWET-Z-PANELEM", () => {
    const w = calculateWeekend({
      ...BAZA,
      dni: 3,
      osoby: 1,
      urzadzenia: [{ nazwa: "Razem", mocW: 800, godzinNaDobe: 1, naOsobe: false }],
      pojemnoscAh: 80,
      dodPct: 100,
      mocPaneluW: 100,
      godzinSlonca: 4,
      sprawnoscToruPct: 80,
    })
    expect(w.value.bilansPobytuWh).toBeCloseTo(-480, 9)
    expect(w.warnings.find((x) => x.code === "WK-BRAK-NAWET-Z-PANELEM")!.params).toEqual({ wh: 480 })
  })

  it("panel bez godzin słońca → INCOMPLETE; 25 h/dobę → INVALID_INPUT", () => {
    expect(calculateWeekend({ ...BAZA, mocPaneluW: 100 }).status).toBe("INCOMPLETE")
    const w = calculateWeekend({ ...BAZA, urzadzenia: [{ nazwa: "X", mocW: 5, godzinNaDobe: 25, naOsobe: false }] })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.field).toBe("urzadzenia.0.godzinNaDobe")
  })
})
