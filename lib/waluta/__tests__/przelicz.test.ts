import { describe, expect, it } from "vitest"
import { formatujKwote, kursEfektywny, przeliczZPln } from "../przelicz"
import { parsujKursy, parsujPreferencje, kursyPrzeterminowane } from "../storage"

describe("kursEfektywny", () => {
  it("PLN is always 1", () => expect(kursEfektywny("PLN", {}, {}, 5)).toBe(1))
  it("uses the fetched rate", () => expect(kursEfektywny("EUR", { EUR: 0.23 }, {}, 0)).toBeCloseTo(0.23))
  it("manual rate wins over fetched", () => expect(kursEfektywny("EUR", { EUR: 0.23 }, { EUR: 0.25 }, 0)).toBeCloseTo(0.25))
  it("markup widens the rate", () => expect(kursEfektywny("EUR", { EUR: 0.2 }, {}, 10)).toBeCloseTo(0.22))
  it("no rate → null", () => expect(kursEfektywny("UAH", {}, {}, 0)).toBeNull())
})

describe("formatujKwote", () => {
  it("formats PLN in Polish", () => expect(formatujKwote(1234, "PLN", "pl")).toMatch(/1\s?234\s?zł/))
  it("formats EUR with symbol", () => expect(formatujKwote(przeliczZPln(1000, 0.23), "EUR", "en")).toContain("€230"))
  it("honours digits", () => expect(formatujKwote(1.5, "USD", "en", 2)).toContain("1.50"))
})

describe("parsing stored state", () => {
  it("bad preference JSON → defaults", () => expect(parsujPreferencje("{")).toEqual({ kod: "PLN", narzutProc: 0, reczne: {} }))
  it("unknown currency → PLN, markup clamped", () => {
    const p = parsujPreferencje(JSON.stringify({ kod: "XXX", narzutProc: 99, reczne: { EUR: -1, USD: 4 } }))
    expect(p.kod).toBe("PLN")
    expect(p.narzutProc).toBe(20)
    expect(p.reczne).toEqual({ USD: 4 })
  })
  it("rates parse and expire", () => {
    const k = parsujKursy(JSON.stringify({ pobranoMs: 0, dataEcb: "2026-10-01", kursy: { EUR: 0.23, X: "a" } }))
    expect(k?.kursy).toEqual({ EUR: 0.23 })
    expect(kursyPrzeterminowane(k, 13 * 3600 * 1000)).toBe(true)
    expect(kursyPrzeterminowane(k, 1000)).toBe(false)
  })
})
