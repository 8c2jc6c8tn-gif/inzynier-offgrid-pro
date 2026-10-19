import { describe, expect, it, vi } from "vitest"
import { parsujOdpowiedzTmy } from "@/lib/adapters/pvgis/tmy"
import { calculateKatIAzymut, obliczTabeleNapromieniowania } from "@/lib/core/modules/pv/kat-i-azymut/calculator"
import { KOMUNIKAT_PVGIS } from "@/lib/lokalizacja/dane-tmy"
import { CALCULATOR_VERSION as WERSJA_E7 } from "@/lib/core/modules/pv/mikropekniecia-termiczne/calculator"
import { t } from "@/lib/i18n/t"
import { validateAiToolDefinition } from "../../types"
import { mikropeknieciaTermiczneTool } from "../mikropekniecia-termiczne-tool"
import { powlokiAntyrefleksyjneTool } from "../powloki-antyrefleksyjne-tool"
import { technologiePaneliTool } from "../technologie-paneli-tool"
import { mikroinwerteryVsCentralnyTool } from "../mikroinwertery-vs-centralny-tool"
import { warunkiNadmorskiePylisteTool } from "../warunki-nadmorskie-pyliste-tool"
import { katIAzymutTool, utworzKatIAzymutTool } from "../kat-i-azymut-tool"
import { utworzWschodZachodTool, wschodZachodTool } from "../wschod-zachod-tool"
import { utworzZlotySrodekTool, zlotySrodekTool } from "../zloty-srodek-tool"
import { liczbaPaneliTool, utworzLiczbaPaneliTool } from "../liczba-paneli-tool"
import { trackerVsStalyTool } from "../tracker-vs-staly-tool"
import { typMontazuTool, utworzTypMontazuTool } from "../typ-montazu-tool"
import { wiatrPowyzej30Tool } from "../wiatr-powyzej-30-tool"
import { ogrodzeniePvTool } from "../ogrodzenie-pv-tool"

const bezBrakujacegoKlucza = (teksty: string[]) => {
  for (const tekst of teksty) expect(tekst.startsWith("⚠")).toBe(false)
}

describe("narzędzia AI Modułu 3 — kontrakt 9.3", () => {
  it("wszystkie: 'read', bez potwierdzenia, przechodzą validateAiToolDefinition", () => {
    for (const n of [mikropeknieciaTermiczneTool, powlokiAntyrefleksyjneTool, technologiePaneliTool, mikroinwerteryVsCentralnyTool, warunkiNadmorskiePylisteTool, katIAzymutTool, wschodZachodTool, zlotySrodekTool, liczbaPaneliTool, trackerVsStalyTool, typMontazuTool]) {
      expect(n.operationType).toBe("read")
      expect(n.requiresConfirmation).toBe(false)
      expect(() => validateAiToolDefinition(n)).not.toThrow()
    }
  })
})

describe("mikropeknieciaTermiczneTool (M3/E7)", () => {
  it("deleguje do kalkulatora: sztywny montaż → ostrzeżenia jako tekst PL, nie kod", async () => {
    const wynik = await mikropeknieciaTermiczneTool.handler({ odstepDylatacyjnyMm: 2, podkladkiEpdm: false })
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.montazSztywny).toBe(true)
    expect(wynik.wersjaKalkulatora).toBe(WERSJA_E7)
    expect(wynik.ostrzezenia).toContain(
      t("pl", "MIKROPEKNIECIA-ODSTEP-ZA-MALY", { odstep: 2, min: 5, lata: 2 }),
    )
    expect(wynik.zalozenia).toEqual([t("pl", "MIKROPEKNIECIA-DANE-ZE-ZRODLA")])
    bezBrakujacegoKlucza([...wynik.ostrzezenia, ...wynik.zalozenia])
  })

  it("montaż elastyczny → VALID, montazSztywny=false", async () => {
    const wynik = await mikropeknieciaTermiczneTool.handler({ odstepDylatacyjnyMm: 8, podkladkiEpdm: true })
    expect(wynik.status).toBe("VALID")
    expect(wynik.montazSztywny).toBe(false)
  })
})

describe("powlokiAntyrefleksyjneTool (M3/E23)", () => {
  it("deleguje do kalkulatora: 4000 kWh → 40–120 kWh, założenie i uwaga jako tekst PL", async () => {
    const wynik = await powlokiAntyrefleksyjneTool.handler({ rocznyUzyskKwh: 4000 })
    expect(wynik.status).toBe("VALID")
    expect(wynik.zyskMinKwh).toBeCloseTo(40, 9)
    expect(wynik.zyskMaxKwh).toBeCloseTo(120, 9)
    expect(wynik.jednostka).toBe("kWh/rok")
    expect(wynik.ostrzezenia).toEqual([t("pl", "POWLOKA-AR-CZYSZCZENIE")])
    expect(wynik.zalozenia).toEqual([t("pl", "POWLOKA-AR-ZAKRES-ZE-ZRODLA", { min: 1, max: 3 })])
    bezBrakujacegoKlucza([...wynik.ostrzezenia, ...wynik.zalozenia])
  })
})

describe("technologiePaneliTool (M3/E15)", () => {
  it("z mocą: powierzchnie z kalkulatora + założenie 🔎 o uzysku jako tekst PL", async () => {
    const wynik = await technologiePaneliTool.handler({ mocInstalacjiKwp: 4 })
    expect(wynik.status).toBe("VALID")
    const perc = wynik.technologie.find((x) => x.nazwa === "PERC")
    expect(perc?.powierzchniaModulow?.maxM2).toBeCloseTo(20, 6)
    expect(perc?.uzyskWzgledemPercWgZrodla).toBe("100% (wzorzec)")
    expect(wynik.zalozenia).toContain(t("pl", "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA"))
    bezBrakujacegoKlucza(wynik.zalozenia)
  })

  it("bez mocy (0): dane porównawcze nadal zwrócone, powierzchnia null, zastrzeżenie o uzysku obecne", async () => {
    const wynik = await technologiePaneliTool.handler({ mocInstalacjiKwp: 0 })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.technologie).toHaveLength(4)
    expect(wynik.technologie[0].powierzchniaModulow).toBeNull()
    expect(wynik.zalozenia).toEqual([t("pl", "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA")])
  })
})

describe("mikroinwerteryVsCentralnyTool (M3/E21)", () => {
  it("zacienienie → mikroinwertery + ostrzeżenie off-grid jako tekst PL, tabela 4 kryteriów", async () => {
    const wynik = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: true, falownikWyspowyAcCoupling: "tak" })
    expect(wynik.rekomendacja).toBe("mikroinwertery")
    expect(wynik.porownanie).toHaveLength(4)
    expect(wynik.ostrzezenia).toContain(t("pl", "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC"))
    bezBrakujacegoKlucza(wynik.ostrzezenia)
  })

  it("zacienienie bez falownika wyspowego → twardy stop jako tekst PL; bez odpowiedzi → INCOMPLETE", async () => {
    const bez = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: true, falownikWyspowyAcCoupling: "nie" })
    expect(bez.ostrzezenia).toContain(t("pl", "MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO"))
    bezBrakujacegoKlucza(bez.ostrzezenia)
    const brak = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: true })
    expect(brak.status).toBe("INCOMPLETE")
  })

  it("brak zacienienia → centralny", async () => {
    const wynik = await mikroinwerteryVsCentralnyTool.handler({ regularneZacienienie: false })
    expect(wynik.rekomendacja).toBe("centralny")
    expect(wynik.status).toBe("VALID")
  })
})

describe("warunkiNadmorskiePylisteTool (M3/E25)", () => {
  it("nadmorska bez zabezpieczeń → 4 reguły, komunikaty jako tekst PL", async () => {
    const wynik = await warunkiNadmorskiePylisteTool.handler({
      typLokalizacji: "nadmorska",
      wilgotnoscWysoka: false,
      certyfikatIec61701: false,
      ramaAnodowana: false,
      zlaczkiMorskie: false,
      certyfikatAntyPid: false,
    })
    expect(wynik.niespelnioneReguly).toBe(4)
    expect(wynik.ostrzezenia).toContain(t("pl", "NADMORSKA-BRAK-IEC-61701"))
    bezBrakujacegoKlucza(wynik.ostrzezenia)
  })
})

/** Syntetyczna odpowiedź PVGIS (jak w modul1-lokalizacja-tools.test.ts) — NIE dane klimatyczne. */
function odpowiedzPvgis() {
  const start = Date.UTC(2018, 0, 1)
  const p = (n: number) => String(n).padStart(2, "0")
  const tmy_hourly = Array.from({ length: 8760 }, (_, h) => {
    const d = new Date(start + h * 3_600_000)
    const poludnie = h % 24 === 11
    return {
      "time(UTC)": `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}:${p(d.getUTCHours())}00`,
      "G(h)": poludnie ? 400 : 0,
      "Gb(n)": poludnie ? 500 : 0,
      "Gd(h)": poludnie ? 100 : 0,
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

describe("katIAzymutTool (M3/E1)", () => {
  it("pobiera PVGIS po stronie serwera i deleguje do tabeli + kalkulatora; bez PR — bez kWh", async () => {
    const json = odpowiedzPvgis()
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(json))) as unknown as typeof fetch
    const w = await utworzKatIAzymutTool(fetchImpl).handler({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      azymutDeg: 180,
      nachylenieDeg: 35,
    })
    const dane = parsujOdpowiedzTmy(json)
    if (!dane.ok) throw new Error("oczekiwano poprawnych danych")
    const tabela = obliczTabeleNapromieniowania({ szerokoscGeograficzna: 52.23, dlugoscGeograficzna: 21.01, daneGodzinowe: dane.dane.rekordy, azymutDeg: 180 })
    const r = calculateKatIAzymut({ tabela: tabela.value, nachylenieDeg: 35, mocInstalacjiKwp: 0, wspolczynnikPr: null })
    expect(w.status).toBe("VALID")
    expect(w.napromieniowanieRoczneKwhM2).toBeCloseTo(r.value!.napromieniowanieRoczneKwhM2, 9)
    expect(w.najlepszyKatWMiesiacu).toHaveLength(12)
    expect(w.produkcjaRocznaKwh).toBeNull()
    expect(w.ostrzezenia).toEqual([t("pl", "KAT-PRODUKCJA-WYMAGA-MOCY-I-PR")])
    expect(w.zrodloDanych).toBe("PVGIS TMY (PVGIS-SARAH3, lata 2005–2023)")
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("z mocą i PR → produkcja kWh; PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const json = odpowiedzPvgis()
    const ok = (async () => new Response(JSON.stringify(json))) as unknown as typeof fetch
    const w = await utworzKatIAzymutTool(ok).handler({
      szerokoscGeograficzna: 52.23,
      dlugoscGeograficzna: 21.01,
      azymutDeg: 180,
      nachylenieDeg: 35,
      mocInstalacjiKwp: 4,
      wspolczynnikPr: 0.8,
    })
    expect(w.produkcjaRocznaKwh).toBeCloseTo(4 * w.napromieniowanieRoczneKwhM2! * 0.8, 6)

    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w2 = await utworzKatIAzymutTool(zly).handler({ szerokoscGeograficzna: 55, dlugoscGeograficzna: 18, azymutDeg: 180, nachylenieDeg: 35 })
    expect(w2.status).toBe("INCOMPLETE")
    expect(w2.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})

describe("wschodZachodTool (M3/E20)", () => {
  const wejscie = {
    szerokoscGeograficzna: 52.23,
    dlugoscGeograficzna: 21.01,
    wschod: { nachylenieDeg: 30, azymutDeg: 90 },
    zachod: { nachylenieDeg: 30, azymutDeg: 270 },
    udzialWschodPct: 50,
  }

  it("pobiera PVGIS po stronie serwera, zwraca stosunek do południa i założenia jako tekst PL", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzWschodZachodTool((async () => new Response(JSON.stringify(json))) as unknown as typeof fetch).handler(wejscie)
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.stosunekDoPoludniaPct).toBeGreaterThan(0)
    expect(w.stosunekMiesiecznyPct).toHaveLength(12)
    expect(w.zalozenia).toContain(t("pl", "WZ-ZALOZENIE-UDZIAL-MOCY", { wschod: 50, zachod: 50 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzWschodZachodTool(zly).handler(wejscie)
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})

describe("zlotySrodekTool (M3/E9)", () => {
  const wejscie = {
    szerokoscGeograficzna: 52.23,
    dlugoscGeograficzna: 21.01,
    azymutDeg: 180,
    strefaWiatrowa: 1 as const,
    kategoriaTerenu: "III",
    wysokoscKonstrukcjiM: 2,
    powierzchniaPaneliM2: 10,
    wspolczynnikPhi: 0,
  }

  it("wysokość n.p.m. i cena balastu z podpowiedzi → założenia jawne; zawsze ostrzeżenie o zakresie balastu EQU", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzZlotySrodekTool((async () => new Response(JSON.stringify(json))) as unknown as typeof fetch).handler(wejscie)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.rekomendacjaDeg).toBeNull()
    expect(w.punkty.map((p) => p.nachylenieDeg)).toContain(90)
    expect(w.punkty.find((p) => p.nachylenieDeg === 90)!.balastKg).toBeNull()
    expect(w.ostrzezenia).toContain(t("pl", "ZS-BALAST-EQU-TYLKO-ODRYWANIE"))
    expect(w.zalozenia).toContain(t("pl", "ZS-ZALOZENIE-CENA-BALASTU", { cena: 1 }))
    expect(w.zalozenia[0]).toMatch(/^Wysokość n\.p\.m\. z PVGIS/)
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("z wyceną energii wskazuje kąt 0–30°", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzZlotySrodekTool((async () => new Response(JSON.stringify(json))) as unknown as typeof fetch).handler({
      ...wejscie,
      mocInstalacjiKwp: 2,
      wspolczynnikPr: 0.8,
      cenaEnergiiZlKwh: 1,
      liczbaLat: 10,
    })
    expect(w.rekomendacjaDeg).not.toBeNull()
    expect(w.rekomendacjaDeg!).toBeLessThanOrEqual(30)
  })

  it("kąty powyżej 30° do 89° mają siłę i balast jako szacunek poza normą; pion i kąty normowe nie; rekomendacja zostaje normowa", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzZlotySrodekTool((async () => new Response(JSON.stringify(json))) as unknown as typeof fetch).handler({
      ...wejscie,
      nachylenieDeg: 45,
      mocInstalacjiKwp: 2,
      wspolczynnikPr: 0.8,
      cenaEnergiiZlKwh: 1,
      liczbaLat: 10,
    })
    const p45 = w.punkty.find((p) => p.nachylenieDeg === 45)!
    expect(p45.szacunekPozaNorma).toBe(true)
    expect(p45.silaWiatruN).not.toBeNull()
    expect(p45.balastKg).not.toBeNull()
    expect(w.punkty.find((p) => p.nachylenieDeg === 90)!.szacunekPozaNorma).toBe(false)
    expect(w.punkty.find((p) => p.nachylenieDeg === 30)!.szacunekPozaNorma).toBe(false)
    expect(w.rekomendacjaDeg!).toBeLessThanOrEqual(30)
    expect(w.ostrzezenia).toContain(t("pl", "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC", { kat: 45, max: 30 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzZlotySrodekTool(zly).handler(wejscie)
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})

describe("liczbaPaneliTool (M3/E4)", () => {
  const wejscie = {
    szerokoscGeograficzna: 52.23,
    dlugoscGeograficzna: 21.01,
    azymutDeg: 180,
    nachylenieDeg: 35,
    stelazRegulowany: false,
    mocPaneluWp: 450,
    wspolczynnikPr: 0.8,
    zapotrzebowanieDoboweKwh: 5,
    dodatkoweZimaKwhDzien: 0,
    miesiaceGrzewcze: [],
    limitMontazowy: 30,
  }

  it("zwraca 4 okresy, rekomendację w limicie i założenia jako tekst PL", async () => {
    const json = odpowiedzPvgis()
    const w = await utworzLiczbaPaneliTool((async () => new Response(JSON.stringify(json))) as unknown as typeof fetch).handler(wejscie)
    expect(["VALID", "VALID_WITH_WARNINGS"]).toContain(w.status)
    expect(w.warianty.map((x) => x.okres)).toEqual(["lato", "marPaz", "lutLis", "rok"])
    expect(w.deficytMiesiecznyKwh).toHaveLength(12)
    expect(w.zalozenia).toContain(t("pl", "LP-ZALOZENIE-LIMIT", { limit: 30 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("PVGIS odrzuca → INCOMPLETE z komunikatem", async () => {
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const w = await utworzLiczbaPaneliTool(zly).handler(wejscie)
    expect(w.status).toBe("INCOMPLETE")
    expect(w.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})

describe("trackerVsStalyTool (M3/E3)", () => {
  it("scenariusz źródła: +6 paneli, werdykt 'staly', ostrzeżenia i założenia jako tekst PL", async () => {
    const w = await trackerVsStalyTool.handler({ liczbaPaneliTracker: 9, kosztTrackeraZl: 6000, kosztPaneluZl: 1000, uzyskPaneluKwh: 450 })
    expect(w.status).toBe("VALID")
    expect(w.dodatkowePanele).toBe(6)
    expect(w.werdykt).toBe("staly")
    expect(w.ostrzezenia).toEqual([t("pl", "TVS-NAPOR-WIATRU-TRACKERA")])
    expect(w.zalozenia).toContain(t("pl", "TVS-ZYSK-TRACKERA-ZAKRES", { min: 30, max: 40 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("brak danych → INCOMPLETE", async () => {
    const w = await trackerVsStalyTool.handler({ liczbaPaneliTracker: 0, kosztTrackeraZl: 6000, kosztPaneluZl: 1000, uzyskPaneluKwh: 450 })
    expect(w.status).toBe("INCOMPLETE")
  })
})

describe("typMontazuTool (M3/E2)", () => {
  const pvgis = (async () => new Response(JSON.stringify(odpowiedzPvgis()))) as unknown as typeof fetch

  it("wiata bez sieci: przykład źródła 6×4 m → 8 paneli, 3,2 kWp, założenia jako tekst PL", async () => {
    const w = await typMontazuTool.handler({ tryb: "wiata", dlugoscWiatyM: 6, szerokoscWiatyM: 4, dlugoscPaneluM: 2, szerokoscPaneluM: 1.5, mocPaneluW: 400, nachylenieDeg: 12 })
    expect(w.status).toBe("VALID")
    expect(w.wiata!.liczbaPaneli).toBe(8)
    expect(w.wiata!.mocKwp).toBeCloseTo(3.2, 12)
    expect(w.zalozenia).toContain(t("pl", "TM-ZALOZENIE-BEZ-SZCZELIN"))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("dach płaski: brak danych wiatru → INCOMPLETE, bez zgadywania; komplet → balast EQU z ostrzeżeniem o zakresie", async () => {
    const geometria = { tryb: "dach_plaski_grunt" as const, miejsce: "grunt" as const, nachylenieDeg: 30, dlugoscWzdluzSpaduM: 2, szerokoscStelazaM: 5, wysokoscDolnejKrawedziM: 0.5 }
    expect((await typMontazuTool.handler(geometria)).status).toBe("INCOMPLETE")
    const w = await typMontazuTool.handler({ ...geometria, strefaWiatrowa: 1, kategoriaTerenu: "III", wysokoscNpmM: 100, wspolczynnikPhi: 0 })
    expect(w.dachPlaski!.podniesienieM).toBeCloseTo(1, 12)
    expect(w.dachPlaski!.balastKg).toBeGreaterThan(0)
    expect(w.ostrzezenia).toContain(t("pl", "ZS-BALAST-EQU-TYLKO-ODRYWANIE"))
  })

  it("pionowy i regulowany pobierają PVGIS po stronie serwera; błąd PVGIS → INCOMPLETE z komunikatem", async () => {
    const lok = { szerokoscGeograficzna: 52.23, dlugoscGeograficzna: 21.01, azymutDeg: 180 }
    const p = await utworzTypMontazuTool(pvgis).handler({ tryb: "pionowy", ...lok })
    expect(p.status).toBe("VALID")
    expect(p.pionowy!.roznicaMiesiecznaPct).toHaveLength(12)
    const r = await utworzTypMontazuTool(pvgis).handler({
      tryb: "regulowany", ...lok, katMinDeg: 0, katMaxDeg: 30, dlugoscWzdluzSpaduM: 2, szerokoscStelazaM: 5, wysokoscDolnejKrawedziM: 0.5,
      strefaWiatrowa: 1, kategoriaTerenu: "III", wspolczynnikPhi: 0,
    })
    expect(r.regulowany!.katyMiesieczneDeg).toHaveLength(12)
    expect(r.zalozenia[0]).toMatch(/^Wysokość n\.p\.m\. z PVGIS/)
    bezBrakujacegoKlucza([...r.ostrzezenia, ...r.zalozenia])
    const zly = (async () => new Response("location over the sea", { status: 400 })) as unknown as typeof fetch
    const b = await utworzTypMontazuTool(zly).handler({ tryb: "pionowy", ...lok })
    expect(b.status).toBe("INCOMPLETE")
    expect(b.ostrzezenia).toEqual([KOMUNIKAT_PVGIS["PVGIS-ODRZUCIL-ZAPYTANIE"]])
  })
})

describe("wiatrPowyzej30Tool (wiatr powyżej 30°, szacunek poza normą)", () => {
  const wejscie = { nachylenieDeg: 45, strefaWiatrowa: 2 as const, wysokoscNpmM: 120, kategoriaTerenu: "II" as const, wysokoscKonstrukcjiM: 4 }

  it("kontrakt 9.3 i opis z „Użyj, gdy”", () => {
    expect(() => validateAiToolDefinition(wiatrPowyzej30Tool)).not.toThrow()
    expect(wiatrPowyzej30Tool.description).toMatch(/Użyj, gdy/)
  })

  it("zwraca ESTIMATE z ciśnieniami; bez powierzchni i φ siła i balast są puste", async () => {
    const w = await wiatrPowyzej30Tool.handler(wejscie)
    expect(w.status).toBe("ESTIMATE")
    expect(w.szczytoweCisnienieWiatruPa).toBeGreaterThan(0)
    expect(w.odrywanie.krawedzPa).toBeGreaterThan(w.odrywanie.srodekPa)
    expect(w.silaWiatruN).toBeNull()
    expect(w.balastProjektowyKg).toBeNull()
    expect(w.ostrzezenia).toContain(t("pl", "WP30-SZACUNEK-POZA-NORMA", { kat: 45, max: 30 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("z powierzchnią i φ liczy siłę i balast; ostrzeżenie o własnej odpowiedzialności jest w wyniku", async () => {
    const w = await wiatrPowyzej30Tool.handler({ ...wejscie, powierzchniaM2: 10, wspolczynnikPhi: 0, masaPaneliStelazaKg: 40 })
    expect(w.silaWiatruN).toBeGreaterThan(0)
    expect(w.balastProjektowyKg).toBeGreaterThan(0)
    expect(w.ostrzezenia).toContain(t("pl", "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC", { kat: 45, max: 30 }))
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("do 30° nie podaje własnej liczby (norma)", async () => {
    const w = await wiatrPowyzej30Tool.handler({ ...wejscie, nachylenieDeg: 25, powierzchniaM2: 10, wspolczynnikPhi: 0 })
    expect(w.status).toBe("OUT_OF_SCOPE")
    expect(w.silaWiatruN).toBeNull()
  })

  it("z tarciem, wysokością i podstawą sprawdza przesuw i przewracanie — także dla 90°, gdzie bez nich balast to null", async () => {
    const pion = { ...wejscie, nachylenieDeg: 90, powierzchniaM2: 10, wspolczynnikPhi: 0 }
    const bez = await wiatrPowyzej30Tool.handler(pion)
    expect(bez.balastProjektowyKg).toBeNull()
    const z = await wiatrPowyzej30Tool.handler({ ...pion, wspolczynnikTarcia: 0.5, wysokoscSrodkaParciaM: 2, szerokoscPodstawyM: 1 })
    expect(z.balastProjektowyKg).toBeGreaterThan(0)
    expect(z.balastPrzesuwKg).toBeGreaterThan(0)
    expect(z.balastPrzewracanieKg).toBeGreaterThan(0)
    expect(z.balastOderwanieKg).toBeNull()
    expect(z.ostrzezenia).toContain(t("pl", "WP30-STATECZNOSC-SZACUNEK", { mu: 0.5, h: 2, b: 1 }))
    bezBrakujacegoKlucza([...z.ostrzezenia, ...z.zalozenia])
  })
})

describe("ogrodzeniePvTool (ogrodzenie z paneli PV, szacunek)", () => {
  const wejscie = {
    dlugoscPanelaMm: 1700,
    wysokoscPanelaMm: 1100,
    przeswitMm: 300,
    maxWysokoscMm: 2200,
    dlugoscOgrodzeniaM: 20,
    strefaWiatrowa: 2 as const,
    wysokoscNpmM: 100,
    kategoriaTerenu: "II" as const,
    grupaGruntu: "pr-ps" as const,
    stopienZageszczeniaId: 0.5,
    wilgotnoscGruntu: "wilgotne" as const,
    glebokoscPrzemarzaniaM: 1,
    gatunekStali: "S235" as const,
  }

  it("kontrakt 9.3 i opis z „Użyj, gdy”", () => {
    expect(() => validateAiToolDefinition(ogrodzeniePvTool)).not.toThrow()
    expect(ogrodzeniePvTool.description).toMatch(/Użyj, gdy/)
  })

  it("zwraca ESTIMATE z układem, profilami i fundamentem; zagłębienie nie mniejsze niż przemarzanie", async () => {
    const w = await ogrodzeniePvTool.handler(wejscie)
    expect(w.status).toBe("ESTIMATE")
    expect(w.rzedy).toBe(1)
    expect(w.wysokoscCalkowitaMm).toBe(1400)
    expect(w.slupek).not.toBeNull()
    expect(w.fundament?.zaglebienieKoncoweMm).toBeGreaterThanOrEqual(1000)
    bezBrakujacegoKlucza([...w.ostrzezenia, ...w.zalozenia])
  })

  it("bez wymaganych danych nie zgaduje (INCOMPLETE)", async () => {
    const w = await ogrodzeniePvTool.handler({ ...wejscie, dlugoscPanelaMm: 0 })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.fundament).toBeNull()
  })
})
