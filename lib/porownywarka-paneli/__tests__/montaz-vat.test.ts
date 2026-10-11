import { describe, expect, it } from "vitest"
import { policzMontaz, sumaZMontazem } from "../montaz-vat"

describe("policzMontaz", () => {
  it("is empty when nothing is typed", () => {
    expect(policzMontaz("", "")).toEqual({ rodzaj: "brak" })
    expect(policzMontaz(undefined, undefined)).toEqual({ rodzaj: "brak" })
  })

  it("1000 net at 8 % → VAT 80, gross 1080", () => {
    expect(policzMontaz("1000", "8")).toEqual({ rodzaj: "ok", montaz: { nettoKwota: 1000, vatPct: 8, vatKwota: 80, bruttoKwota: 1080 } })
  })

  it("1234.56 net at 23 % → VAT 283.95 (283.9488 rounded), gross 1518.51", () => {
    const w = policzMontaz("1234,56", "23")
    expect(w.rodzaj).toBe("ok")
    if (w.rodzaj === "ok") {
      expect(w.montaz.vatKwota).toBeCloseTo(283.95, 9)
      expect(w.montaz.bruttoKwota).toBeCloseTo(1518.51, 9)
    }
  })

  it("an empty rate gives the net amount only", () => {
    expect(policzMontaz("1500", "")).toEqual({ rodzaj: "ok", montaz: { nettoKwota: 1500, vatPct: null, vatKwota: null, bruttoKwota: null } })
  })

  it("rate 0 % is a rate: VAT 0, gross = net", () => {
    expect(policzMontaz("500", "0")).toEqual({ rodzaj: "ok", montaz: { nettoKwota: 500, vatPct: 0, vatKwota: 0, bruttoKwota: 500 } })
  })

  it("is invalid for negative or non-numeric amounts and a rate outside 0–100; a rate without an amount is just empty", () => {
    expect(policzMontaz("-1", "8")).toEqual({ rodzaj: "blad" })
    expect(policzMontaz("abc", "")).toEqual({ rodzaj: "blad" })
    expect(policzMontaz("1000", "101")).toEqual({ rodzaj: "blad" })
    expect(policzMontaz("1000", "-1")).toEqual({ rodzaj: "blad" })
    expect(policzMontaz("", "8")).toEqual({ rodzaj: "brak" })
  })
})

describe("sumaZMontazem", () => {
  const montaz = (n: string, v: string) => {
    const w = policzMontaz(n, v)
    if (w.rodzaj !== "ok") throw new Error("expected ok")
    return w.montaz
  }

  it("adds the gross installation to a gross price: 12 000 + 1 518,51 = 13 518,51", () => {
    expect(sumaZMontazem(12000, montaz("1234,56", "23"))).toBe(13518.51)
  })

  it("is null without a rate (no gross amount), without a price or without an installation", () => {
    expect(sumaZMontazem(12000, montaz("1500", ""))).toBeNull()
    expect(sumaZMontazem(null, montaz("1000", "8"))).toBeNull()
    expect(sumaZMontazem(12000, null)).toBeNull()
  })

  it("rate 0 % adds the net amount unchanged", () => {
    expect(sumaZMontazem(100, montaz("500", "0"))).toBe(600)
  })
})
