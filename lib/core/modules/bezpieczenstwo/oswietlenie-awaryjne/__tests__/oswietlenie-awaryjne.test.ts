import { describe, expect, it } from "vitest"
import { calculateOswietlenieAwaryjne } from "../calculator"
import type { OswietlenieAwaryjneInput } from "../input"

const OK: OswietlenieAwaryjneInput = {
  zasilanie: "ups",
  lampy: [
    { nazwa: "Korytarz", stan: "sprawna" },
    { nazwa: "Klatka", stan: "sprawna" },
  ],
  oswietlenieZewnetrzne: true,
}

describe("calculateOswietlenieAwaryjne (M8/E7, dawne 11.55)", () => {
  it("wszystkie lampy sprawne + oświetlenie zewnętrzne → VALID", () => {
    const w = calculateOswietlenieAwaryjne(OK)
    expect(w.status).toBe("VALID")
    expect(w.value).toEqual({ sprawne: 2, niesprawne: 0, nietestowane: 0 })
  })

  it("przykład źródła: lampa #3 nie działa → 🔴 z nazwą (pusta nazwa → numer)", () => {
    const w = calculateOswietlenieAwaryjne({ ...OK, lampy: [...OK.lampy, { nazwa: " ", stan: "niesprawna" }] })
    expect(w.warnings).toHaveLength(1)
    expect(w.warnings[0]!.level).toBe("critical")
    expect(w.warnings[0]!.params).toEqual({ nazwa: "#3" })
    expect(w.value.niesprawne).toBe(1)
  })

  it("lampa nietestowana → 🟡; brak oświetlenia zewnętrznego → info", () => {
    const w = calculateOswietlenieAwaryjne({
      zasilanie: "wlasne-akumulatory",
      lampy: [{ nazwa: "Garaż", stan: "nietestowana" }],
      oswietlenieZewnetrzne: false,
    })
    expect(w.warnings.map((x) => [x.code, x.level])).toEqual([
      ["OSW-LAMPA-NIETESTOWANA", "warning"],
      ["OSW-BRAK-ZEWNETRZNEGO", "info"],
    ])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
  })

  it("brak zasilania albo lamp → INCOMPLETE", () => {
    expect(calculateOswietlenieAwaryjne({ ...OK, zasilanie: null }).status).toBe("INCOMPLETE")
    expect(calculateOswietlenieAwaryjne({ ...OK, lampy: [] }).status).toBe("INCOMPLETE")
  })
})
