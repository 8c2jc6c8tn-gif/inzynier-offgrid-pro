import { describe, expect, it } from "vitest"
import { calculateAlternatorVsPanele } from "../calculator"

// Tresc E20 C: "3 h jazdy → 900 Wh; panel 200 W → 1000 Wh". 25 A × 12 V × 3 h = 900 Wh;
// 200 W × 5 h × 100% = 1000 Wh — test values reproducing the source arithmetic, not defaults.
const BAZA = {
  napiecieV: 12,
  godzinJazdy: 3,
  pradLadowaniaA: 25,
  mocPaneluW: 200,
  godzinSlonca: 5,
  sprawnoscToruPct: 100,
  zapotrzebowanieWhDoba: 0,
  typAkumulatora: null,
  maDcDc: null,
  napiecieLadowaniaV: 0,
  pojemnoscAh: 0,
  socStartPct: 0,
}

describe("calculateAlternatorVsPanele (M12/E20, dawne 8.40 + 8.43)", () => {
  it("przykład Treści: alternator 900 Wh, panel 1000 Wh", () => {
    const w = calculateAlternatorVsPanele(BAZA)
    expect(w.value.energiaAlternatorWh).toBe(900)
    expect(w.value.energiaPaneliWh).toBe(1000)
    expect(w.value.sumaWh).toBe(1900)
    expect(w.status).toBe("VALID")
  })

  it("przykład Biblii §12.31: 10 A, 100 Ah od 50% → 5 h", () => {
    const w = calculateAlternatorVsPanele({ ...BAZA, pradLadowaniaA: 10, pojemnoscAh: 100, socStartPct: 50 })
    expect(w.value.czasLadowaniaH).toBe(5)
  })

  it("LiFePO4 12 V: 14,8 V → 🔴; 14,0 V → 🟡; 24 V: okno 28,4–29,2 V", () => {
    const lfp = { ...BAZA, typAkumulatora: "lifepo4" as const }
    const wys = calculateAlternatorVsPanele({ ...lfp, napiecieLadowaniaV: 14.8 })
    expect(wys.warnings.find((x) => x.code === "AL-NAPIECIE-ZA-WYSOKIE")!.level).toBe("critical")
    expect(calculateAlternatorVsPanele({ ...lfp, napiecieLadowaniaV: 14.0 }).warnings.map((x) => x.code)).toContain("AL-NAPIECIE-ZA-NISKIE")
    expect(calculateAlternatorVsPanele({ ...lfp, napiecieV: 24 }).value.oknoNapieciaV).toEqual({ minV: 28.4, maxV: 29.2 })
    expect(calculateAlternatorVsPanele({ ...lfp, napiecieV: 24, napiecieLadowaniaV: 29.2 }).warnings).toEqual([])
  })

  it("LiFePO4 bez DC/DC → 🟡; brak pokrycia zapotrzebowania → 🟡", () => {
    const w = calculateAlternatorVsPanele({ ...BAZA, typAkumulatora: "lifepo4", maDcDc: false, zapotrzebowanieWhDoba: 2500 })
    expect(w.warnings.map((x) => x.code)).toEqual(["AL-LIFEPO4-BEZ-DCDC", "AL-BRAK-POKRYCIA"])
  })

  it("brak danych → INCOMPLETE; jazda > 24 h → INVALID_INPUT", () => {
    expect(calculateAlternatorVsPanele({ ...BAZA, pradLadowaniaA: 0 }).status).toBe("INCOMPLETE")
    expect(calculateAlternatorVsPanele({ ...BAZA, godzinJazdy: 30 }).status).toBe("INVALID_INPUT")
  })
})
