import { describe, expect, it } from "vitest"
import { LIMIT_GLOBALNY, LIMIT_NA_KLUCZ, utworzLimiter, utworzLimiterOdczytu } from "../limit"

describe("utworzLimiter", () => {
  it("przepuszcza do limitu, potem odmawia z czasem do ponowienia", () => {
    let t = 1_000_000
    const l = utworzLimiter(3, 60_000, () => t)
    expect(l.sprobuj("a")).toEqual({ ok: true })
    t += 1000
    expect(l.sprobuj("a")).toEqual({ ok: true })
    t += 1000
    expect(l.sprobuj("a")).toEqual({ ok: true })
    t += 1000
    // the oldest attempt (t0) leaves the window 60 s after t0, i.e. 57 s from now
    expect(l.sprobuj("a")).toEqual({ ok: false, ponowZaSekund: 57 })
  })

  it("okno jest przesuwne: po wyjściu najstarszej próby znów przepuszcza", () => {
    let t = 0
    const l = utworzLimiter(1, 10_000, () => t)
    expect(l.sprobuj("a").ok).toBe(true)
    t = 9_999
    expect(l.sprobuj("a").ok).toBe(false)
    t = 10_000
    expect(l.sprobuj("a").ok).toBe(true)
  })

  it("klucze liczą się osobno", () => {
    const l = utworzLimiter(1, 10_000, () => 0)
    expect(l.sprobuj("a").ok).toBe(true)
    expect(l.sprobuj("b").ok).toBe(true)
    expect(l.sprobuj("a").ok).toBe(false)
  })
})

describe("utworzLimiterOdczytu", () => {
  it("jeden adres: maks na godzinę, potem odmowa", () => {
    const t = 0
    const l = utworzLimiterOdczytu(() => t)
    for (let i = 0; i < LIMIT_NA_KLUCZ.maks; i++) expect(l.sprobuj("1.2.3.4").ok).toBe(true)
    expect(l.sprobuj("1.2.3.4").ok).toBe(false)
  })

  it("wspólny limit dobowy zatrzymuje wszystkich, także nowe adresy", () => {
    const l = utworzLimiterOdczytu(() => 0)
    let przeszlo = 0
    for (let i = 0; i < LIMIT_GLOBALNY.maks + 20; i++) if (l.sprobuj(`ip-${i}`).ok) przeszlo++
    expect(przeszlo).toBe(LIMIT_GLOBALNY.maks)
  })
})
