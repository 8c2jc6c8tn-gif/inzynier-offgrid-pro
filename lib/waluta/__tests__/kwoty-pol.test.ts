import { describe, expect, it } from "vitest"
import { parsujTabeleNbp } from "../kursy-zrodlo"
import { przeliczMiedzyWalutami, rozbiciePoWalutach, sciezkiKonkretne, stanWWalucie, walutyPoZmianie, walutyZeStaregoSzkicu, type KursOd } from "../kwoty-pol"

// Rates per 1 PLN from NBP table A 227/A/NBP/2026 (23.11.2026): EUR mid 4.4556, USD mid 4.0601.
const kurs: KursOd = (k) => ({ EUR: 1 / 4.4556, USD: 1 / 4.0601 })[k as string] ?? null

describe("NBP table A", () => {
  it("mid (PLN per unit) becomes units per 1 PLN; unknown codes and bad numbers are dropped", () => {
    const r = parsujTabeleNbp([
      { table: "A", no: "227/A/NBP/2026", effectiveDate: "2026-11-23", rates: [{ code: "EUR", mid: 4.4556 }, { code: "XDR", mid: 5.4 }, { code: "USD", mid: -1 }, { code: "GBP", mid: "x" }] },
    ])
    expect(r?.date).toBe("2026-11-23")
    expect(r?.rates.EUR).toBeCloseTo(1 / 4.4556, 12)
    expect(Object.keys(r!.rates)).toEqual(["EUR"])
    expect(parsujTabeleNbp({})).toBeNull()
    expect(parsujTabeleNbp([{ effectiveDate: "2026-11-23", rates: [] }])).toBeNull()
  })
})

describe("conversion between any two currencies goes through PLN", () => {
  it("EUR → PLN, PLN → EUR, EUR → USD; unknown rate = null", () => {
    expect(przeliczMiedzyWalutami(100, "EUR", "PLN", kurs)).toBeCloseTo(445.56, 9)
    expect(przeliczMiedzyWalutami(445.56, "PLN", "EUR", kurs)).toBeCloseTo(100, 9)
    expect(przeliczMiedzyWalutami(100, "EUR", "USD", kurs)).toBeCloseTo((100 * 4.4556) / 4.0601, 9)
    expect(przeliczMiedzyWalutami(5, "GBP", "PLN", kurs)).toBeNull()
    expect(przeliczMiedzyWalutami(5, "GBP", "GBP", kurs)).toBe(5)
  })
})

type Stan = { cena: string; panele: { id: string; cena: string }[] }
const DEKL = ["cena", "panele.*.cena"]

describe("currency of each field and list row", () => {
  it("paths of flat fields and of list rows", () => {
    expect(sciezkiKonkretne({ cena: "1", panele: [{ id: "a", cena: "" }, { id: "b", cena: "2" }] }, DEKL)).toEqual(["cena", "panele.a.cena", "panele.b.cena"])
  })

  it("an amount typed into an empty field gets the working currency of that moment and keeps it", () => {
    const s1: Stan = { cena: "1000", panele: [] }
    const w1 = walutyPoZmianie(s1, DEKL, {}, "PLN")
    expect(w1).toEqual({ cena: "PLN" })
    const s2: Stan = { cena: "1000", panele: [{ id: "a", cena: "200" }] }
    const w2 = walutyPoZmianie(s2, DEKL, w1, "EUR")
    expect(w2).toEqual({ cena: "PLN", "panele.a.cena": "EUR" })
    expect(walutyPoZmianie({ cena: "", panele: [] }, DEKL, w2, "EUR")).toEqual({})
    expect(walutyPoZmianie(s2, DEKL, w2, "USD")).toBe(w2)
  })

  it("an old draft: every amount is in the draft's old denomination", () => {
    expect(walutyZeStaregoSzkicu({ cena: "5", panele: [{ id: "a", cena: "1" }] }, DEKL, "EUR")).toEqual({ cena: "EUR", "panele.a.cena": "EUR" })
  })

  it("the state for the calculator is in one currency; an unknown rate empties the amount", () => {
    const s: Stan = { cena: "100", panele: [{ id: "a", cena: "445.56" }, { id: "b", cena: "10" }] }
    const w = { cena: "EUR", "panele.a.cena": "PLN", "panele.b.cena": "GBP" } as const
    const r = stanWWalucie(s, DEKL, w, "PLN", kurs)
    expect(r.cena).toBe("445.56")
    expect(r.panele[0]!.cena).toBe("445.56")
    expect(r.panele[1]!.cena).toBe("")
    expect(s.cena).toBe("100")
    expect(rozbiciePoWalutach(s, DEKL, w)).toEqual({ EUR: 100, PLN: 445.56, GBP: 10 })
  })
})
