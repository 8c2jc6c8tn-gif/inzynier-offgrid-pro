import { describe, expect, it } from "vitest"
import { formatujHistorie } from "../formatuj-historie"
import { parsujHistorie } from "../parsuj-historie"

describe("formatujHistorie", () => {
  it("writes one line per year with '-' for a missing day", () => {
    expect(formatujHistorie([{ rok: 2020, dni: [1.5, null, 0] }, { rok: 2021, dni: [2] }])).toBe("2020 1.5 - 0\n2021 2")
  })

  it("rounds to the given decimals without trailing zeros", () => {
    expect(formatujHistorie([{ rok: 2020, dni: [2.4000000001, 0.12349] }])).toBe("2020 2.4 0.123")
  })

  it("round-trips through parsujHistorie", () => {
    const lata = [{ rok: 2019, dni: [0.5, null, 3.25] }]
    expect(parsujHistorie(formatujHistorie(lata)).lata).toEqual(lata)
  })

  it("returns an empty text for no years", () => {
    expect(formatujHistorie([])).toBe("")
  })
})
