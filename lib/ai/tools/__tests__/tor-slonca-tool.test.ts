import { describe, expect, it } from "vitest"
import { parsujOdpowiedzTmy } from "@/lib/adapters/pvgis/tmy"
import { calculateTorSlonca } from "@/lib/core/modules/pv/tor-slonca/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { validateAiToolDefinition } from "../../types"
import { torSloncaTool, utworzTorSloncaTool } from "../tor-slonca-tool"

/** Synthetic TMY year: a bright block of hours every day, nothing otherwise (only the structure matters here). */
function odpowiedzPvgis() {
  const start = Date.UTC(2018, 0, 1)
  const p = (n: number) => String(n).padStart(2, "0")
  const tmy_hourly = Array.from({ length: 8760 }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const jasno = h % 24 >= 6 && h % 24 <= 15
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      "G(h)": jasno ? 300 : 0,
      "Gb(n)": jasno ? 400 : 0,
      "Gd(h)": jasno ? 80 : 0,
      T2m: 5,
    }
  })
  return {
    inputs: {
      location: { latitude: 52.23, longitude: 21.01, elevation: 119, irradiance_time_offset: 0.18 },
      meteo_data: { radiation_db: "PVGIS-SARAH3", meteo_db: "ERA5", year_min: 2005, year_max: 2023, use_horizon: true, horizon_db: "DEM-calculated" },
    },
    outputs: { months_selected: [], tmy_hourly },
    meta: {},
  }
}

const sam = { szerokoscGeograficzna: 52.23, dlugoscGeograficzna: 21.01, miesiac: 12 }
const pelne = { ...sam, nachylenieDeg: 35, azymutDeg: 180, mocKwp: 5, pr: 0.8 }
const fetchZ = (json: unknown) => (async () => new Response(JSON.stringify(json))) as unknown as typeof fetch
const bezSieci = (async () => {
  throw new Error("sieć nie powinna być użyta")
}) as unknown as typeof fetch

describe("torSloncaTool (M3)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, 'Użyj, gdy…' w opisie", () => {
    expect(torSloncaTool.operationType).toBe("read")
    expect(torSloncaTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(torSloncaTool)).not.toThrow()
    expect(torSloncaTool.description).toContain("Użyj, gdy")
  })

  it("sam tor słońca: bez pobierania PVGIS, cztery łuki, energia null i informacja po polsku", async () => {
    const w = await utworzTorSloncaTool(bezSieci).handler(sam)
    expect(w.luki.map((l) => l.id)).toEqual(["lato", "rownonoc", "zima", "wybrany"])
    expect(w.energia).toBeNull()
    expect(w.zrodloDanych).toBeNull()
    expect(w.ostrzezenia.length).toBeGreaterThan(0)
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })

  it("deleguje do silnika: te same liczby co bezpośrednie wywołanie z danymi TMY", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzTorSloncaTool(fetchZ(json)).handler(pelne)
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const r = calculateTorSlonca({ ...pelne, nachylenieDeg: 35, daneGodzinowe: dane.dane.rekordy })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.energia!.typowaDobaKwh).toBeCloseTo(r.value!.energia!.typowaDobaKwh!, 9)
    expect(w.energia!.czysteNiebo).toBeCloseTo(r.value!.energia!.czysteNiebo, 9)
    expect(w.energia!.godziny).toHaveLength(24)
    expect(w.energia!.miesiacamiKwhNaDobe).toHaveLength(12)
    expect(w.zrodloDanych).toBe("PVGIS TMY (PVGIS-SARAH3, lata 2005–2023)")
    expect(w.luki.find((l) => l.id === "zima")!.maksWysokoscDeg).toBeCloseTo(r.value!.luki.find((l) => l.id === "zima")!.maksWysokoscDeg, 9)
  })

  it("PVGIS odrzuca → tor i czyste niebo z ostrzeżeniem, bez typowego dnia", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzTorSloncaTool(zly).handler(pelne)
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.energia!.typowaDobaKwh).toBeNull()
    expect(w.energia!.czysteNiebo).toBeGreaterThan(0)
    expect(w.zrodloDanych).toBeNull()
    expect(w.ostrzezenia.some((x) => x.includes(KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]))).toBe(true)
  })

  it("błędne dane → INVALID_INPUT z tekstem ostrzeżenia", async () => {
    const w = await utworzTorSloncaTool(bezSieci).handler({ ...sam, miesiac: 13 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.ostrzezenia[0]).toContain("Miesiąc")
    expect(w.luki).toEqual([])
  })
})
