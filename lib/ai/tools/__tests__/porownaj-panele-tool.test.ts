import { describe, expect, it } from "vitest"
import { parsujOdpowiedzTmy } from "@/lib/adapters/pvgis/tmy"
import { calculatePorownywarkaPaneli } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import { domyslnyWyborKryteriow } from "@/lib/core/modules/pv/porownywarka-paneli/kryteria"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { validateAiToolDefinition } from "../../types"
import { porownajPaneleTool, utworzPorownajPaneleTool } from "../porownaj-panele-tool"

/** Synthetic TMY year: noon radiation every day, 20 °C in summer and −5 °C in winter months. */
function odpowiedzPvgis(zTemperatura: boolean) {
  const start = Date.UTC(2018, 0, 1)
  const p = (n: number) => String(n).padStart(2, "0")
  const tmy_hourly = Array.from({ length: 8760 }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const poludnie = h % 24 === 11
    const zima = [10, 11, 0, 1].includes(d.getUTCMonth())
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      "G(h)": poludnie ? 400 : 0,
      "Gb(n)": poludnie ? 500 : 0,
      "Gd(h)": poludnie ? 100 : 0,
      ...(zTemperatura ? { T2m: zima ? -5 : 20 } : {}),
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
  liczbaPaneli: 10,
  zlNaKwh: 1,
  panele: [
    { nazwa: "Panel A", pmaxW: 500, cenaBruttoZl: 500, gammaPctNaC: -0.29, noctC: 45 },
    { nazwa: "Panel B", pmaxW: 450, cenaBruttoZl: 400, gammaPctNaC: -0.35, noctC: 43 },
  ],
}

const fetchZ = (json: unknown) => (async () => new Response(JSON.stringify(json))) as unknown as typeof fetch

describe("porownajPaneleTool (M3, D81)", () => {
  it("kontrakt 9.3: 'read', bez potwierdzenia, 'Użyj, gdy…' w opisie", () => {
    expect(porownajPaneleTool.operationType).toBe("read")
    expect(porownajPaneleTool.requiresConfirmation).toBe(false)
    expect(() => validateAiToolDefinition(porownajPaneleTool)).not.toThrow()
    expect(porownajPaneleTool.description).toContain("Użyj, gdy")
  })

  it("pobiera PVGIS po stronie serwera i deleguje do silnika — te same kWh co bezpośrednie wywołanie", async () => {
    const json = odpowiedzPvgis(true)
    const w = await utworzPorownajPaneleTool(fetchZ(json)).handler(wejscie)
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const r = calculatePorownywarkaPaneli({
      szerokoscGeograficzna: wejscie.szerokoscGeograficzna,
      dlugoscGeograficzna: wejscie.dlugoscGeograficzna,
      daneGodzinowe: dane.dane.rekordy,
      miejsce: { nachylenieDeg: 35, azymutDeg: 180 },
      liczbaPaneli: 10,
      panele: wejscie.panele.map((p, i) => ({
        id: `p${i + 1}`,
        nazwa: p.nazwa,
        pmaxW: p.pmaxW,
        cenaBruttoZl: p.cenaBruttoZl,
        gammaPctNaC: p.gammaPctNaC,
        noctC: p.noctC,
        sprawnoscWzglednaPrzy200WPct: null,
        degradacjaPierwszyRokPct: null,
        degradacjaLiniowaPctNaRok: null,
        bifacjalny: false,
      })),
      wycena: { rodzaj: "reczna", zlKwh: 1 },
      kryteria: domyslnyWyborKryteriow(),
    })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.panele).toHaveLength(2)
    expect(w.panele[0]!.zimaKwh).toBeCloseTo(r.value.panele[0]!.zimaKwh, 9)
    expect(w.panele[1]!.rokKwh).toBeCloseTo(r.value.panele[1]!.rokKwh, 9)
    expect(w.uwzglednionaTemperatura).toBe(true)
    expect(w.zrodloDanych).toBe("PVGIS TMY (PVGIS-SARAH3, lata 2005–2023)")
    expect(w.liderZimowyNazwa).not.toBeNull()
    expect(w.przewagaZimowaZl).toBeCloseTo(w.przewagaZimowaKwh!, 9)
    for (const tekst of [...w.ostrzezenia, ...w.zalozenia]) expect(tekst.startsWith("⚠")).toBe(false)
  })

  it("dane PVGIS bez temperatury → model bez temperatury i ostrzeżenie tekstem, nie kodem", async () => {
    const w = await utworzPorownajPaneleTool(fetchZ(odpowiedzPvgis(false))).handler(wejscie)
    expect(w.uwzglednionaTemperatura).toBe(false)
    expect(w.ostrzezenia.length).toBeGreaterThan(0)
    for (const tekst of w.ostrzezenia) expect(tekst.startsWith("⚠")).toBe(false)
  })

  it("taryfa dzienna i nocna: bez godzin stref → INCOMPLETE z prośbą o dane; z godzinami → wartość wg stref", async () => {
    const json = odpowiedzPvgis(true)
    const { zlNaKwh: _pomijam, ...baza } = wejscie
    void _pomijam
    const bez = await utworzPorownajPaneleTool(fetchZ(json)).handler({ ...baza, cenaDzienZlKwh: 1, cenaNocZlKwh: 0.5 })
    expect(bez.status).toBe("INCOMPLETE")
    expect(bez.ostrzezenia[0]).toContain("godzin taniej strefy")
    const z = await utworzPorownajPaneleTool(fetchZ(json)).handler({
      ...baza,
      cenaDzienZlKwh: 1,
      cenaNocZlKwh: 0.5,
      oknaTanie: [
        { odH: 22, doH: 6 },
        { odH: 13, doH: 15 },
      ],
    })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(z.status)
    expect(z.przewagaZimowaZl).not.toBeNull()
    // The synthetic radiation sits only at 12:00 local time, outside the example windows → everything at the day price.
    expect(z.przewagaZimowaZl!).toBeCloseTo(z.przewagaZimowaKwh!, 9)
    const wPoludnie = await utworzPorownajPaneleTool(fetchZ(json)).handler({ ...baza, cenaDzienZlKwh: 1, cenaNocZlKwh: 0.5, oknaTanie: [{ odH: 12, doH: 13 }] })
    expect(wPoludnie.przewagaZimowaZl!).toBeCloseTo(0.5 * wPoludnie.przewagaZimowaKwh!, 9)
    expect(z.zalozenia.some((x) => x.includes("czasie urzędowym"))).toBe(true)
  })

  it("PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzPorownajPaneleTool(zly).handler(wejscie)
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})
