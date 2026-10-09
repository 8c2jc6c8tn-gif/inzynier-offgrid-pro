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
        dlugoscMm: null,
        szerokoscMm: null,
        masaKg: null,
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

  it("A2: liczba paneli z wymiarów miejsca (osobno dla każdego modelu) i energia wykorzystana ze zużycia", async () => {
    const json = odpowiedzPvgis(true)
    const { liczbaPaneli: _pomijam, ...baza } = wejscie
    void _pomijam
    const w = await utworzPorownajPaneleTool(fetchZ(json)).handler({
      ...baza,
      wymiaryMiejsca: { dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "rownolegly" },
      zuzycieMiesieczneKwh: Array(12).fill(5),
      panele: [
        { ...baza.panele[0]!, dlugoscMm: 1762, szerokoscMm: 1134 },
        { ...baza.panele[1]!, dlugoscMm: 2278, szerokoscMm: 1134 },
      ],
    })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.panele[0]!.liczbaPaneli).toBeGreaterThan(w.panele[1]!.liczbaPaneli)
    expect(w.panele[0]!.mieszcaSieSzt).toBe(w.panele[0]!.liczbaPaneli)
    // Consumption of 5 kWh a month is far below the yield → the useful energy is capped by it, the rest is surplus.
    expect(w.panele[0]!.uzytecznaRokKwh).toBeCloseTo(60, 9)
    expect(w.panele[0]!.nadwyzkaUlamek!).toBeGreaterThan(0)
  })

  it("A2: montaż pochylony na konstrukcji bez liczby paneli → sztuki z odstępu rzędów (okno z wejścia), układ rzędów w wyniku", async () => {
    const { liczbaPaneli: _pomijam, ...baza } = wejscie
    void _pomijam
    const w = await utworzPorownajPaneleTool(fetchZ(odpowiedzPvgis(true))).handler({
      ...baza,
      wymiaryMiejsca: { dlugoscM: 20, szerokoscM: 20, marginesM: 0.5, montaz: "pochylony-na-konstrukcji", oknoOdH: 10, oknoDoH: 14 },
      panele: baza.panele.map((p) => ({ ...p, dlugoscMm: 1762, szerokoscMm: 1134 })),
    })
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.panele[0]!.liczbaPaneli).toBeGreaterThan(0)
    expect(w.panele[0]!.rozmieszczenie!.odstepM).toBeGreaterThan(0)
    expect(w.zalozenia.some((x) => x.includes("10") && x.includes("14"))).toBe(true)
  })

  it("panel bez NOCT obok kompletnego → wykluczony i wymieniony w wyniku, kompletny liczony z temperaturą", async () => {
    const w = await utworzPorownajPaneleTool(fetchZ(odpowiedzPvgis(true))).handler({
      ...wejscie,
      panele: [wejscie.panele[0]!, { nazwa: "Panel C", pmaxW: 400, cenaBruttoZl: 300, gammaPctNaC: -0.3 }],
    })
    expect(w.uwzglednionaTemperatura).toBe(true)
    expect(w.panele.map((p) => p.nazwa)).toEqual(["Panel A"])
    expect(w.wykluczone).toEqual([{ nazwa: "Panel C", brakuje: ["noct"] }])
    expect(w.ostrzezenia.some((x) => x.includes("Panel C"))).toBe(true)
  })

  it("A3: dane elektryczne z karty + tminC → napięcie zimą, limit w szeregu i warianty stringów; bez tminC elektryka null i prośba w ostrzeżeniu", async () => {
    // JA 500 W (karta): Voc 43,85, Vmp 36,91, Isc 14,42, Imp 13,55, β −0,25 %/°C, 1500 V, bezpiecznik 30 A; −20 °C → Voc zimą 48,7831 V
    const elektryka = { vocV: 43.85, vmpV: 36.91, iscA: 14.42, impA: 13.55, betaVocPctNaC: -0.25, maxNapieciaSystemuV: 1500, maxBezpiecznikSzeregowyA: 30 }
    const panele = [{ ...wejscie.panele[0]!, liczbaPaneli: undefined, dlugoscMm: 1953, szerokoscMm: 1134, masaKg: 27.3, elektryka }]
    const z = await utworzPorownajPaneleTool(fetchZ(odpowiedzPvgis(true))).handler({ ...wejscie, liczbaPaneli: 12, tminC: -20, panele })
    const e = z.panele[0]!.elektryka!
    expect(e.vocZimaPanelaV).toBeCloseTo(48.7831, 4)
    expect(e.maxPaneliWSzeregu).toBe(30)
    expect(e.warianty.map((w) => [w.panelowWSzeregu, w.stringowRownolegle])).toEqual([[12, 1], [6, 2], [4, 3], [3, 4], [2, 6], [1, 12]])
    expect(e.warianty.find((w) => w.stringowRownolegle === 4)).toMatchObject({ ochronaStringowWymagana: true, alternatywaKablowa: false })
    expect(e.warianty.find((w) => w.stringowRownolegle === 3)).toMatchObject({ ochronaStringowWymagana: false, alternatywaKablowa: true })
    expect(z.panele[0]!.masaNaM2Kg).toBeCloseTo(27.3 / (1.953 * 1.134), 6)
    const bez = await utworzPorownajPaneleTool(fetchZ(odpowiedzPvgis(true))).handler({ ...wejscie, liczbaPaneli: 12, panele })
    expect(bez.panele[0]!.elektryka).toBeNull()
    expect(bez.ostrzezenia.some((x) => x.includes("temperatur"))).toBe(true)
  })

  it("PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzPorownajPaneleTool(zly).handler(wejscie)
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})
