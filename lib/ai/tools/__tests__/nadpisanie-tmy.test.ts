import { beforeEach, describe, expect, it, vi } from "vitest"

const pobierzTmy = vi.fn()
vi.mock("@/lib/adapters/pvgis/tmy", () => ({ pobierzTmy: (...a: unknown[]) => pobierzTmy(...a) }))

import { pobierzTmyZNadpisaniem } from "../nadpisanie-tmy"

const GODZINA = 3600_000
const STYCZEN = Date.UTC(2020, 0, 15, 12)
const LUTY = Date.UTC(2020, 1, 15, 12)

const dane = () => ({
  meta: {} as never,
  rekordy: [
    { czasUtcMs: STYCZEN, ghi: 100, dni: 60, dhi: 40, tempC: -4 },
    { czasUtcMs: STYCZEN + GODZINA, ghi: 100, dni: 60, dhi: 40, tempC: -2 },
    { czasUtcMs: LUTY, ghi: 200, dni: 120, dhi: 80, tempC: 0 },
  ],
})

describe("pobierzTmyZNadpisaniem (own monthly values in the AI tools, INFRA-2)", () => {
  beforeEach(() => pobierzTmy.mockReset())

  it("without own values returns the PVGIS data untouched", async () => {
    const tmy = { ok: true, dane: dane() }
    pobierzTmy.mockResolvedValue(tmy)
    expect(await pobierzTmyZNadpisaniem(50, 20, fetch, {})).toBe(tmy)
  })

  it("scales the radiation of an overridden month and shifts its temperature; other months stay", async () => {
    pobierzTmy.mockResolvedValue({ ok: true, dane: dane() })
    const ghi = Array<number | null>(12).fill(null)
    ghi[0] = 0.4 // January PVGIS sum: (100 + 100) W/m² × 1 h = 0.2 kWh/m² → factor 2
    const temp = Array<number | null>(12).fill(null)
    temp[0] = 1 // January PVGIS mean −3 → shift +4
    const wynik = await pobierzTmyZNadpisaniem(50, 20, fetch, { nadpisanieGhiKwhM2: ghi, nadpisanieTempSrednieC: temp })
    expect(wynik.ok).toBe(true)
    if (!wynik.ok) return
    const [a, b, c] = wynik.dane.rekordy
    expect(a!.ghi).toBeCloseTo(200, 10)
    expect(a!.dni).toBeCloseTo(120, 10)
    expect(a!.tempC).toBeCloseTo(0, 10)
    expect(b!.tempC).toBeCloseTo(2, 10)
    expect(c).toEqual({ czasUtcMs: LUTY, ghi: 200, dni: 120, dhi: 80, tempC: 0 })
  })

  it("passes a PVGIS error through unchanged", async () => {
    const blad = { ok: false, kod: "PVGIS-TIMEOUT", szczegoly: "x" }
    pobierzTmy.mockResolvedValue(blad)
    expect(await pobierzTmyZNadpisaniem(50, 20, fetch, { nadpisanieGhiKwhM2: Array(12).fill(1) })).toBe(blad)
  })
})
