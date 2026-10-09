import { describe, expect, it, vi } from "vitest"
import { parametrySchema, parsujOdpowiedzTmy, pobierzTmy, PVGIS_TMY_URL } from "../tmy"

/** Nagłówek skopiowany ze struktury realnej odpowiedzi PVGIS v5_3 (Warszawa, 23.09.2026). */
function odpowiedz(offset = 0.1832, liczbaRekordow = 8760) {
  const start = Date.UTC(2018, 0, 1)
  const tmy_hourly = Array.from({ length: liczbaRekordow }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const p = (n: number) => String(n).padStart(2, "0")
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      // Month number as temperature — makes each monthly mean exactly checkable.
      T2m: d.getUTCMonth() + 1 + (h % 2 === 0 ? 0.5 : -0.5),
      RH: 86.2,
      "G(h)": h % 24 === 12 ? 72 : 0,
      "Gb(n)": h % 24 === 12 ? 9.51 : 0,
      "Gd(h)": h % 24 === 12 ? 70 : 0,
      "IR(h)": 281.39,
      WS10m: 3.72,
      WD10m: 216,
      SP: 99190,
    }
  })
  return {
    inputs: {
      location: { latitude: 52.23, longitude: 21.01, elevation: 119, irradiance_time_offset: offset },
      meteo_data: {
        radiation_db: "PVGIS-SARAH3",
        meteo_db: "ERA5",
        year_min: 2005,
        year_max: 2023,
        use_horizon: true,
        horizon_db: "DEM-calculated",
      },
    },
    outputs: { months_selected: [], tmy_hourly },
    meta: {},
  }
}

describe("parsujOdpowiedzTmy", () => {
  it("poprawna odpowiedź → 8760 rekordów, mapowanie G(h)/Gb(n)/Gd(h) → ghi/dni/dhi, metadane", () => {
    const w = parsujOdpowiedzTmy(odpowiedz())
    expect(w.ok).toBe(true)
    if (!w.ok) return
    expect(w.dane.rekordy).toHaveLength(8760)
    expect(w.dane.rekordy[12]).toMatchObject({ ghi: 72, dni: 9.51, dhi: 70 })
    expect(w.dane.meta).toMatchObject({ bazaPromieniowania: "PVGIS-SARAH3", przesuniecieCzasuH: 0.1832, wysokoscNpmM: 119 })
  })

  it("T2m przechodzi do rekordu jako tempC (godzinowa temperatura — Porównywarka paneli PV); brak T2m w godzinie → rekord bez tempC", () => {
    const o = odpowiedz()
    delete (o.outputs.tmy_hourly[5] as { T2m?: number }).T2m
    const w = parsujOdpowiedzTmy(o)
    if (!w.ok) throw new Error("oczekiwano ok")
    expect(w.dane.rekordy[0]!.tempC).toBeCloseTo(1.5, 10)
    expect(w.dane.rekordy[1]!.tempC).toBeCloseTo(0.5, 10)
    expect(w.dane.rekordy[5]!.tempC).toBeUndefined()
    expect(w.dane.rekordy[6]!.tempC).toBeDefined()
  })

  it("średnie miesięczne T2m — 12 wartości, miesiąc ze znacznika PVGIS (M6/E1)", () => {
    const w = parsujOdpowiedzTmy(odpowiedz(0.9))
    if (!w.ok) throw new Error("oczekiwano ok")
    expect(w.dane.temperaturyMiesieczneC).toHaveLength(12)
    w.dane.temperaturyMiesieczneC!.forEach((t, i) => expect(t).toBeCloseTo(i + 1, 10))
  })

  it("brak T2m choćby w jednej godzinie → dane nasłonecznienia bez temperatur (nigdy średnia z niepełnego miesiąca)", () => {
    const o = odpowiedz()
    delete (o.outputs.tmy_hourly[5] as { T2m?: number }).T2m
    const w = parsujOdpowiedzTmy(o)
    if (!w.ok) throw new Error("oczekiwano ok")
    expect(w.dane.rekordy).toHaveLength(8760)
    expect(w.dane.temperaturyMiesieczneC).toBeUndefined()
  })

  it("czas rekordu = znacznik HH:00 + irradiance_time_offset (TD15)", () => {
    const w = parsujOdpowiedzTmy(odpowiedz(0.5))
    if (!w.ok) throw new Error("oczekiwano ok")
    expect(w.dane.rekordy[12]!.czasUtcMs).toBe(Date.UTC(2018, 0, 1, 12, 30))
  })

  it("niepełny rok → PVGIS-NIEOCZEKIWANY-FORMAT (nigdy dane częściowe podane jako pełne)", () => {
    const w = parsujOdpowiedzTmy(odpowiedz(0.18, 100))
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
  })

  it("ujemne promieniowanie albo brak pola → PVGIS-NIEOCZEKIWANY-FORMAT", () => {
    const zla = odpowiedz()
    ;(zla.outputs.tmy_hourly[0] as Record<string, unknown>)["G(h)"] = -5
    expect(parsujOdpowiedzTmy(zla)).toMatchObject({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
    expect(parsujOdpowiedzTmy({ message: "cokolwiek" })).toMatchObject({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
  })
})

describe("parametrySchema", () => {
  it("brak parametru (null) jest odrzucany — nie zamieniany na 0°", () => {
    expect(parametrySchema.safeParse({ lat: null, lon: "21" }).success).toBe(false)
    expect(parametrySchema.safeParse({ lat: "", lon: "21" }).success).toBe(false)
  })

  it("tekst nieliczbowy i wartości poza zakresem są odrzucane", () => {
    expect(parametrySchema.safeParse({ lat: "abc", lon: "21" }).success).toBe(false)
    expect(parametrySchema.safeParse({ lat: "95", lon: "21" }).success).toBe(false)
  })

  it("poprawne parametry → liczby", () => {
    expect(parametrySchema.parse({ lat: "52.23", lon: "21.01" })).toEqual({ lat: 52.23, lon: 21.01 })
  })
})

describe("pobierzTmy", () => {
  it("woła stały adres PVGIS z lat/lon/outputformat=json", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(odpowiedz()), { status: 200 }))
    const w = await pobierzTmy(52.23, 21.01, fetchMock as unknown as typeof fetch)
    expect(w.ok).toBe(true)
    const url = (fetchMock.mock.calls[0] as unknown as [URL])[0]
    expect(`${url.origin}${url.pathname}`).toBe(PVGIS_TMY_URL)
    expect(url.searchParams.get("lat")).toBe("52.23")
    expect(url.searchParams.get("outputformat")).toBe("json")
  })

  it("HTTP 400 (np. lokalizacja na morzu) → PVGIS-ODRZUCIL-ZAPYTANIE z treścią komunikatu", async () => {
    const tresc = '{"message":"Location over the sea. Please, select another location","status":400}'
    const w = await pobierzTmy(55.5, 17, (async () => new Response(tresc, { status: 400 })) as unknown as typeof fetch)
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-ODRZUCIL-ZAPYTANIE" })
    if (!w.ok) expect(w.szczegoly).toContain("over the sea")
  })

  it("HTTP 503 → PVGIS-NIEDOSTEPNY", async () => {
    const w = await pobierzTmy(52, 21, (async () => new Response("", { status: 503 })) as unknown as typeof fetch)
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-NIEDOSTEPNY" })
  })

  it("timeout → PVGIS-TIMEOUT", async () => {
    const w = await pobierzTmy(52, 21, (async () => {
      throw new DOMException("The operation timed out.", "TimeoutError")
    }) as unknown as typeof fetch)
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-TIMEOUT" })
  })

  it("błąd sieci → PVGIS-NIEDOSTEPNY", async () => {
    const w = await pobierzTmy(52, 21, (async () => {
      throw new TypeError("fetch failed")
    }) as unknown as typeof fetch)
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-NIEDOSTEPNY" })
  })

  it("odpowiedź 200, ale nie-JSON → PVGIS-NIEOCZEKIWANY-FORMAT", async () => {
    const w = await pobierzTmy(52, 21, (async () => new Response("<html>", { status: 200 })) as unknown as typeof fetch)
    expect(w).toMatchObject({ ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT" })
  })
})
