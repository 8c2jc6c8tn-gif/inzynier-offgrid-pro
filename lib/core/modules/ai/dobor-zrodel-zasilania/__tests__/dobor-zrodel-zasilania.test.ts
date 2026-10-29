import { describe, expect, it } from "vitest"
import { calculateDoborZrodelZasilania } from "../calculator"
import type { DoborZrodelZasilaniaInput } from "../input"

const baza: DoborZrodelZasilaniaInput = {
  produkcjaPvDostepnaTeraz: true,
  socAktualnyPct: 50,
  socProguKrytycznegoPct: 20,
  prognozaSloncaJutro: false,
  agregatDostepny: true,
  siecDostepna: false,
  taniaTaryfaNocna: false,
  temperaturaOgniwaC: 15,
  pojemnoscAh: 100,
  pradMozliwyA: 30,
}

describe("dobór źródeł zasilania (M10/E4, dawne 12.7–12.9) — echo M4/E32 + M4/E12", () => {
  it("słońce, ciepłe ogniwa → PV, pełny prąd możliwy (brak limitu w źródle powyżej 10 °C)", () => {
    const r = calculateDoborZrodelZasilania(baza)
    expect(r.status).toBe("VALID")
    expect(r.value.zrodlo).toBe("PV")
    expect(r.value.strefa).toBe("pelny-prad")
    expect(r.value.pradLadowaniaA).toBe(30)
  })

  it("PV ładuje z ograniczeniem prądu przy niskiej temperaturze — 2 °C, 100 Ah → 0,2C = 20 A", () => {
    const r = calculateDoborZrodelZasilania({ ...baza, temperaturaOgniwaC: 2 })
    expect(r.value.maxPradA).toBeCloseTo(20, 9)
    expect(r.value.pradLadowaniaA).toBeCloseTo(20, 9)
    expect(r.warnings.map((w) => w.code)).toEqual(["LIMIT-PRADU-CHLODNO", "AIZR-PRAD-OGRANICZONY"])
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("poniżej 0 °C → ładowanie zablokowane (0 A) z 🔴 M4/E12", () => {
    const r = calculateDoborZrodelZasilania({ ...baza, temperaturaOgniwaC: -5 })
    expect(r.value.pradLadowaniaA).toBe(0)
    expect(r.warnings[0]!.code).toBe("BLOKADA-LADOWANIA-MROZ")
  })

  it("noc, SoC poniżej progu, brak słońca jutro → agregat (hierarchia M4/E32)", () => {
    const r = calculateDoborZrodelZasilania({ ...baza, produkcjaPvDostepnaTeraz: false, socAktualnyPct: 15 })
    expect(r.value.zrodlo).toBe("AGREGAT")
  })

  it("nic nie ładuje → prąd ładowania null; brak temperatury → ℹ️ limit niesprawdzony", () => {
    const r = calculateDoborZrodelZasilania({
      ...baza,
      produkcjaPvDostepnaTeraz: false,
      temperaturaOgniwaC: null,
    })
    expect(r.value.zrodlo).toBe("BRAK")
    expect(r.value.pradLadowaniaA).toBeNull()
    expect(r.warnings.map((w) => w.code)).toEqual(["AIZR-BEZ-TEMPERATURY"])
  })

  it("SoC nie wpisany → INCOMPLETE; ujemny prąd albo SoC > 100 → INVALID_INPUT", () => {
    expect(calculateDoborZrodelZasilania({ ...baza, socAktualnyPct: 0, socProguKrytycznegoPct: 0 }).status).toBe("INCOMPLETE")
    expect(calculateDoborZrodelZasilania({ ...baza, pradMozliwyA: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateDoborZrodelZasilania({ ...baza, socAktualnyPct: 120 }).status).toBe("INVALID_INPUT")
  })
})
