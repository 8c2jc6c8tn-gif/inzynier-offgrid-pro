import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))
const { odczyt, zapis } = vi.hoisted(() => ({ odczyt: vi.fn(), zapis: vi.fn() }))
vi.mock("@/lib/adapters/supabase/kursy-store", () => ({ odczytajNajnowszeKursy: odczyt, zapiszKursy: zapis }))

import { kursyDlaKlientow } from "../serwis"

// NBP table A shape; mid = PLN per unit, stored as units per 1 PLN.
const NBP = [{ table: "A", no: "190/A/NBP/2026", effectiveDate: "2026-10-02", rates: [{ currency: "euro", code: "EUR", mid: 4.25 }] }]
const STARY = { date: "2026-09-30", rates: { EUR: 0.2 }, pobranoMs: Date.now() - 24 * 3600 * 1000 }

afterEach(() => {
  vi.restoreAllMocks()
  odczyt.mockReset()
  zapis.mockReset()
})

describe("kursyDlaKlientow", () => {
  it("serves a fresh stored copy without calling NBP", async () => {
    odczyt.mockResolvedValue({ date: "2026-10-01", rates: { EUR: 0.22 }, pobranoMs: Date.now() - 1000 })
    const f = vi.spyOn(globalThis, "fetch")
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-10-01", source: "zapis" })
    expect(f).not.toHaveBeenCalled()
  })

  it("fetches NBP when the stored copy is old and saves the result", async () => {
    odczyt.mockResolvedValue(STARY)
    zapis.mockResolvedValue(true)
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(NBP)))
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-10-02", source: "nbp" })
    expect(zapis).toHaveBeenCalledWith({ date: "2026-10-02", rates: { EUR: 1 / 4.25 } })
  })

  it("falls back to the stale stored copy when NBP fails", async () => {
    odczyt.mockResolvedValue(STARY)
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
    expect(await kursyDlaKlientow()).toMatchObject({ ok: true, date: "2026-09-30", source: "zapis-nieaktualny" })
  })

  it("reports unavailability with neither a stored copy nor NBP", async () => {
    odczyt.mockResolvedValue(null)
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
    expect(await kursyDlaKlientow()).toEqual({ ok: false, kod: "KURSY-NIEDOSTEPNE" })
  })
})
