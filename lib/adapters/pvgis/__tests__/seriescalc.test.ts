import { describe, expect, it, vi } from "vitest"
import {
  parametrySeriescalcSchema,
  parsujOdpowiedzSeriescalc,
  pobierzSeriescalc,
  type ParametrySeriescalc,
} from "../seriescalc"

const pad = (n: number) => String(n).padStart(2, "0")

/** Hourly records for one calendar day; `godziny` limits the count (an incomplete day). */
function doba(rok: number, mies: number, dzien: number, g: number, godziny = 24) {
  return Array.from({ length: godziny }, (_, h) => ({
    time: `${rok}${pad(mies)}${pad(dzien)}:${pad(h)}10`,
    "G(i)": g,
    "H_sun": 0,
    T2m: 1,
    WS10m: 2,
    Int: 0,
  }))
}

const inputs = {
  location: { latitude: 52.2, longitude: 21.0, elevation: 110 },
  meteo_data: { radiation_db: "PVGIS-SARAH3", meteo_db: "ERA5" },
}

const parametry: ParametrySeriescalc = { lat: 52.2, lon: 21, od: 2020, do: 2020, nachylenie: 35, azymut: 0 }

describe("parsujOdpowiedzSeriescalc", () => {
  it("sums 24 hourly W/m² values into kWh/m² per day and keeps the year length", () => {
    const w = parsujOdpowiedzSeriescalc({
      inputs,
      outputs: { hourly: [...doba(2020, 1, 1, 100), ...doba(2020, 1, 2, 250)] },
    })
    expect(w.ok).toBe(true)
    if (!w.ok) return
    const rok = w.dane.lata[0]!
    expect(rok.rok).toBe(2020)
    expect(rok.dni).toHaveLength(366) // leap year
    expect(rok.dni[0]).toBeCloseTo(2.4, 10) // 24 × 100 Wh/m²
    expect(rok.dni[1]).toBeCloseTo(6.0, 10)
    expect(rok.dni[2]).toBeNull() // day not in the response
    expect(w.dane.meta.bazaPromieniowania).toBe("PVGIS-SARAH3")
  })

  it("marks an incomplete day as missing instead of filling it", () => {
    const w = parsujOdpowiedzSeriescalc({ inputs, outputs: { hourly: doba(2021, 3, 1, 100, 23) } })
    expect(w.ok && w.dane.lata[0]!.dni[59]).toBeNull()
    expect(w.ok && w.dane.lata[0]!.dni).toHaveLength(365)
  })

  it("indexes days from 1 January across months and sorts years", () => {
    const w = parsujOdpowiedzSeriescalc({
      inputs,
      outputs: { hourly: [...doba(2021, 12, 31, 10), ...doba(2020, 3, 1, 20)] },
    })
    expect(w.ok).toBe(true)
    if (!w.ok) return
    expect(w.dane.lata.map((r) => r.rok)).toEqual([2020, 2021])
    expect(w.dane.lata[0]!.dni[60]).toBeCloseTo(0.48, 10) // 1 March in a leap year = index 60
    expect(w.dane.lata[1]!.dni[364]).toBeCloseTo(0.24, 10)
  })

  it("rejects a response of the wrong shape", () => {
    expect(parsujOdpowiedzSeriescalc({ inputs }).ok).toBe(false)
    const w = parsujOdpowiedzSeriescalc({ inputs, outputs: { hourly: [{ time: "bad", "G(i)": 1 }] } })
    expect(w.ok).toBe(false)
    if (!w.ok) expect(w.kod).toBe("PVGIS-NIEOCZEKIWANY-FORMAT")
  })
})

describe("parametrySeriescalcSchema", () => {
  const baza = { lat: "52.2", lon: "21", od: "2010", do: "2020", nachylenie: "35", azymut: "0" }

  it("accepts valid parameters", () => {
    expect(parametrySeriescalcSchema.safeParse(baza).success).toBe(true)
  })
  it.each([
    ["missing value", { ...baza, nachylenie: null }],
    ["year before the database", { ...baza, od: "2004" }],
    ["year after the database", { ...baza, do: "2024" }],
    ["reversed range", { ...baza, od: "2020", do: "2010" }],
    ["fractional year", { ...baza, od: "2010.5" }],
    ["tilt above 90", { ...baza, nachylenie: "91" }],
    ["azimuth out of range", { ...baza, azymut: "181" }],
  ])("rejects %s", (_nazwa, wejscie) => {
    expect(parametrySeriescalcSchema.safeParse(wejscie).success).toBe(false)
  })
})

describe("pobierzSeriescalc", () => {
  it("sends the plane parameters and returns parsed data", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ inputs, outputs: { hourly: doba(2020, 1, 1, 100) } })))
    const w = await pobierzSeriescalc(parametry, fetchMock as unknown as typeof fetch)
    expect(w.ok).toBe(true)
    const url = (fetchMock.mock.calls[0] as unknown as [URL])[0]
    expect(url.searchParams.get("angle")).toBe("35")
    expect(url.searchParams.get("aspect")).toBe("0")
    expect(url.searchParams.get("startyear")).toBe("2020")
    expect(url.searchParams.get("endyear")).toBe("2020")
  })

  it("maps 4xx to ODRZUCIL-ZAPYTANIE and 5xx to NIEDOSTEPNY", async () => {
    const r4 = await pobierzSeriescalc(parametry, (async () => new Response("no data", { status: 400 })) as unknown as typeof fetch)
    const r5 = await pobierzSeriescalc(parametry, (async () => new Response("down", { status: 503 })) as unknown as typeof fetch)
    expect(!r4.ok && r4.kod).toBe("PVGIS-ODRZUCIL-ZAPYTANIE")
    expect(!r5.ok && r5.kod).toBe("PVGIS-NIEDOSTEPNY")
  })

  it("maps a timeout and a network failure to distinct codes", async () => {
    const timeout = await pobierzSeriescalc(parametry, (async () => {
      throw new DOMException("t", "TimeoutError")
    }) as unknown as typeof fetch)
    const siec = await pobierzSeriescalc(parametry, (async () => {
      throw new Error("offline")
    }) as unknown as typeof fetch)
    expect(!timeout.ok && timeout.kod).toBe("PVGIS-TIMEOUT")
    expect(!siec.ok && siec.kod).toBe("PVGIS-NIEDOSTEPNY")
  })

  it("reports invalid JSON as unexpected format", async () => {
    const w = await pobierzSeriescalc(parametry, (async () => new Response("<html>")) as unknown as typeof fetch)
    expect(!w.ok && w.kod).toBe("PVGIS-NIEOCZEKIWANY-FORMAT")
  })
})
