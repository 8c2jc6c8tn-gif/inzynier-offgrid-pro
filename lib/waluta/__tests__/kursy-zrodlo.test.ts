import { describe, expect, it } from "vitest"
import { parsujOdpowiedzKursow, URL_TABELI_NBP } from "../kursy-zrodlo"

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
  it("asks NBP table A as JSON", () => {
    expect(URL_TABELI_NBP).toBe("https://api.nbp.pl/api/exchangerates/tables/A/?format=json")
  })
})
