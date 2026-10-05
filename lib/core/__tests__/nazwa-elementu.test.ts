import { describe, expect, it } from "vitest"
import { nazwaElementu } from "../nazwa-elementu"

describe("nazwaElementu", () => {
  it("passes the user's own name through as data", () => {
    expect(nazwaElementu("przegroda", " Ściana N ", "NAZWA-PRZEGRODA-NR", 3)).toEqual({ przegroda: "Ściana N" })
  })

  it("unnamed (empty, blank, null) -> numbered fallback key, never Polish text", () => {
    for (const nazwa of ["", "   ", null, undefined]) {
      expect(nazwaElementu("przegroda", nazwa, "NAZWA-PRZEGRODA-NR", 3)).toEqual({ przegrodaKey: "NAZWA-PRZEGRODA-NR", nr: 3 })
    }
  })
})
