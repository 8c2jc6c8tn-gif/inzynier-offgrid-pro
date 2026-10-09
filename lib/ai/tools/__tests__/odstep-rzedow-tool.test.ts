import { describe, expect, it } from "vitest"
import { parsujOdpowiedzTmy } from "@/lib/adapters/pvgis/tmy"
import { calculateOdstepRzedow } from "@/lib/core/modules/pv/odstep-rzedow/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { validateAiToolDefinition } from "../../types"
import { odstepRzedowTool, utworzOdstepRzedowTool } from "../odstep-rzedow-tool"

/** Synthetic TMY year: a bright noon hour every day, nothing otherwise (only the order of magnitude matters here). */
function odpowiedzPvgis() {
  const start = Date.UTC(2018, 0, 1)
  const p = (n: number) => String(n).padStart(2, "0")
  const tmy_hourly = Array.from({ length: 8760 }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const poludnie = h % 24 === 10
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      "G(h)": poludnie ? 400 : 0,
      "Gb(n)": poludnie ? 500 : 0,
      "Gd(h)": poludnie ? 100 : 0,
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

const wejscie = {
  szerokoscGeograficzna: 52.23,
  dlugoscGeograficzna: 21.01,
  nachylenieDeg: 35,
  azymutDeg: 180,
  dlugoscWzdluzSpaduM: 2.278,
  oknoOdH: 10,
  oknoDoH: 14,
  odstepM: 6,
}

const fetchZ = (json: unknown) => (async () => new Response(JSON.stringify(json))) as unknown as typeof fetch

describe("odstepRzedowTool (M3, D81)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, 'Użyj, gdy…' w opisie", () => {
    expect(odstepRzedowTool.operationType).toBe("read")
    expect(odstepRzedowTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(odstepRzedowTool)).not.toThrow()
    expect(odstepRzedowTool.description).toContain("Użyj, gdy")
  })

  it("deleguje do silnika: te same liczby co bezpośrednie wywołanie, ostrzeżenia i założenia jako tekst PL", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzOdstepRzedowTool(fetchZ(json)).handler({ ...wejscie, docelowaStrataZimaPct: 5 })
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const r = calculateOdstepRzedow({ ...wejscie, odstepM: 6, docelowaStrataZimaPct: 5, liczbaRzedow: null, daneGodzinowe: dane.dane.rekordy })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.odstepWymaganyM).toBeCloseTo(r.value!.odstepWymaganyM, 9)
    expect(w.zadanyOdstep!.strata!.zimaPct).toBeCloseTo(r.value!.zadanyOdstep!.strata!.zimaPct, 9)
    expect(w.odstepDlaStratyM).toBeCloseTo(r.value!.odstepDlaStraty!.odstepM, 9)
    expect(w.tabelaKatow.length).toBeGreaterThan(5)
    expect(w.zrodloDanych).toBe("PVGIS TMY (PVGIS-SARAH3, lata 2005–2023)")
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
    expect(w.zalozenia.some((x) => x.includes("Geometria cienia"))).toBe(true)
  })

  it("okno domyślne, gdy go nie podano", async () => {
    const { oknoOdH: _od, oknoDoH: _do, ...bez } = wejscie
    void _od
    void _do
    const w = await utworzOdstepRzedowTool(fetchZ(odpowiedzPvgis())).handler(bez)
    const szerokie = await utworzOdstepRzedowTool(fetchZ(odpowiedzPvgis())).handler({ ...bez, oknoOdH: 9, oknoDoH: 15 })
    expect(w.odstepWymaganyM).toBeCloseTo(szerokie.odstepWymaganyM!, 9)
  })

  it("PVGIS odrzuca → sama geometria cienia z ostrzeżeniem, bez strat energii", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzOdstepRzedowTool(zly).handler(wejscie)
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.odstepWymaganyM).not.toBeNull()
    expect(w.zadanyOdstep!.strata).toBeNull()
    expect(w.zrodloDanych).toBeNull()
    expect(w.ostrzezenia.some((x) => x.includes(KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]))).toBe(true)
  })

  it("błędne dane → INVALID_INPUT z tekstem ostrzeżenia", async () => {
    const w = await utworzOdstepRzedowTool(fetchZ(odpowiedzPvgis())).handler({ ...wejscie, odstepM: 1 })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.ostrzezenia[0]).toContain("mniejszy niż rzut")
  })
})
