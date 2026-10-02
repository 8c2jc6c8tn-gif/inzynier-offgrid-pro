import { describe, expect, it } from "vitest"
import { parsujOdpowiedzKursow, urlKursowEbc } from "../kursy-zrodlo"

describe("parsujOdpowiedzKursow", () => {
  it("accepts a Frankfurter response and keeps only positive finite rates", () => {
    const r = parsujOdpowiedzKursow({ date: "2026-10-01", rates: { EUR: 0.23, USD: -1, GBP: "x", CZK: 5.6 } })
    expect(r).toEqual({ date: "2026-10-01", rates: { EUR: 0.23, CZK: 5.6 } })
  })
  it("rejects malformed payloads", () => {
    expect(parsujOdpowiedzKursow(null)).toBeNull()
    expect(parsujOdpowiedzKursow({ date: 5, rates: {} })).toBeNull()
    expect(parsujOdpowiedzKursow({ date: "2026-10-01" })).toBeNull()
  })
  it("builds the ECB URL with PLN base", () => {
    expect(urlKursowEbc()).toContain("base=PLN")
  })
})
