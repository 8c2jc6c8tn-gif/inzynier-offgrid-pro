import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))
const { odczyt, zapis } = vi.hoisted(() => ({ odczyt: vi.fn(), zapis: vi.fn() }))
vi.mock("@/lib/adapters/supabase/kursy-store", () => ({ odczytajNajnowszeKursy: odczyt, zapiszKursy: zapis }))

import { kursyDlaKlientow } from "../serwis"

const FRANKFURTER = { date: "2026-10-02", rates: { EUR: 0.23 } }
const STARY = { date: "2026-09-30", rates: { EUR: 0.2 }, pobranoMs: Date.now() - 24 * 3600 * 1000 }

afterEach(() => {
  vi.restoreAllMocks()
  odczyt.mockReset()
  zapis.mockReset()
})

describe("kursyDlaKlientow", () => {
  it("serves a fresh stored copy without calling Frankfurter", async () => {
    odczyt.mockResolvedValue({ date: "2026-10-01", rates: { EUR: 0.22 }, pobranoMs: Date.now() - 1000 })
    const f = vi.spyOn(globalThis, "fetch")
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-10-01", source: "zapis" })
    expect(f).not.toHaveBeenCalled()
  })

  it("fetches Frankfurter when the stored copy is old and saves the result", async () => {
    odczyt.mockResolvedValue(STARY)
    zapis.mockResolvedValue(true)
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(FRANKFURTER)))
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-10-02", source: "ecb" })
    expect(zapis).toHaveBeenCalledWith(FRANKFURTER)
  })

  it("falls back to the stale stored copy when Frankfurter fails", async () => {
    odczyt.mockResolvedValue(STARY)
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-09-30", source: "zapis-nieaktualny" })
  })

  it("reports unavailability with neither a stored copy nor Frankfurter", async () => {
    odczyt.mockResolvedValue(null)
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
    expect(await kursyDlaKlientow()).toEqual({ ok: false, kod: "KURSY-NIEDOSTEPNE" })
  })
})
