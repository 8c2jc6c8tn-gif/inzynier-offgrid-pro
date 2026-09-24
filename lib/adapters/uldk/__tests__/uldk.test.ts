import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it, vi } from "vitest"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import {
  budynekWPunkcie,
  dzialkaPoIdentyfikatorze,
  dzialkaWPunkcie,
  parsujOdpowiedzBudynkuUldk,
  parsujOdpowiedzUldk,
  ULDK_URL,
} from "../uldk"

/** Realna odpowiedź ULDK (GetParcelByXY 21.01, 52.23), pobrana 24.09.2026 — 84 wierzchołki z punktem zamykającym. */
const REALNA = readFileSync(join(__dirname, "fixtures", "dzialka-146510_8.0309.23-3.txt"), "utf8")
/** Realna odpowiedź GetBuildingByXY (Kraków, Sukiennice 19.9373, 50.0617), pobrana 24.09.2026. */
const BUDYNEK = readFileSync(join(__dirname, "fixtures", "budynek-126105_9.0001.311.1_BUD.txt"), "utf8")
/** Realna odpowiedź "nie znaleziono" (ten sam dzień). */
const BRAK = "-1 brak wyników\nbłędny format odpowiedzi XML, usługa zwróciła odpowiedźZbiorcza baza danych obsłużyła zapytanie.\n"

const tekst = (t: string, status = 200) => (async () => new Response(t, { status })) as unknown as typeof fetch

describe("parsujOdpowiedzUldk", () => {
  it("realna odpowiedź → TERYT, opis administracyjny, 83 punkty obrysu (bez punktu zamykającego)", () => {
    const w = parsujOdpowiedzUldk(REALNA)
    expect(w.ok).toBe(true)
    if (!w.ok) return
    expect(w.dzialka).toMatchObject({
      teryt: "146510_8.0309.23/3",
      numer: "23/3",
      obreb: "5-03-09",
      gmina: "Warszawa (miasto)",
      powiat: "powiat Warszawa",
      wojewodztwo: "mazowieckie",
      maOtwory: false,
    })
    expect(w.dzialka.punkty).toHaveLength(83)
    // Kolejność WKT: "lon lat" → dlugosc, szerokosc.
    expect(w.dzialka.punkty[0]).toEqual({ szerokosc: 52.2296345709506, dlugosc: 21.009601469996 })
  })

  it("obrys z ULDK daje się policzyć w Skanerze działki (ścieżka online → wspólne jądro)", () => {
    const w = parsujOdpowiedzUldk(REALNA)
    if (!w.ok) throw new Error(w.szczegoly)
    const r = calculateSkanerDzialki({ punktyDzialki: w.dzialka.punkty })
    expect(r.status).toBe("VALID")
    expect(r.value.dzialka!.powierzchniaM2).toBeGreaterThan(0)
  })

  it('"-1 brak wyników" → ULDK-NIE-ZNALEZIONO', () => {
    expect(parsujOdpowiedzUldk(BRAK)).toMatchObject({ ok: false, kod: "ULDK-NIE-ZNALEZIONO" })
  })

  it("więcej niż jedna działka → ULDK-WIELE-WYNIKOW (nie wybieramy po cichu)", () => {
    const linia = REALNA.split("\n")[1]!
    expect(parsujOdpowiedzUldk(`0\n${linia}\n${linia}\n`)).toMatchObject({ ok: false, kod: "ULDK-WIELE-WYNIKOW" })
  })

  it("MULTIPOLYGON → ULDK-GEOMETRIA-NIEOBSLUGIWANA (nie ucinamy części działki)", () => {
    const t = "0\n1|SRID=4326;MULTIPOLYGON(((0 0,1 0,1 1,0 0)),((2 2,3 2,3 3,2 2)))|w|p|g|o|1\n"
    expect(parsujOdpowiedzUldk(t)).toMatchObject({ ok: false, kod: "ULDK-GEOMETRIA-NIEOBSLUGIWANA" })
  })

  it("wielokąt z otworem → obrys zewnętrzny + maOtwory = true", () => {
    const t = "0\n1|SRID=4326;POLYGON((0 0,4 0,4 4,0 4,0 0),(1 1,2 1,2 2,1 1))|w|p|g|o|1\n"
    const w = parsujOdpowiedzUldk(t)
    expect(w).toMatchObject({ ok: true, dzialka: { maOtwory: true } })
    if (w.ok) expect(w.dzialka.punkty).toHaveLength(4)
  })

  it("nieznany status, zła liczba pól, zła geometria → ULDK-NIEOCZEKIWANY-FORMAT", () => {
    expect(parsujOdpowiedzUldk("<html>")).toMatchObject({ kod: "ULDK-NIEOCZEKIWANY-FORMAT" })
    expect(parsujOdpowiedzUldk("0\n1|2\n")).toMatchObject({ kod: "ULDK-NIEOCZEKIWANY-FORMAT" })
    expect(parsujOdpowiedzUldk("0\n1|POLYGON((0 0,1 1))|w|p|g|o|1\n")).toMatchObject({ kod: "ULDK-NIEOCZEKIWANY-FORMAT" })
    expect(parsujOdpowiedzUldk("0\n1|SRID=4326;POLYGON((0 0,x 1,1 1,0 0))|w|p|g|o|1\n")).toMatchObject({ kod: "ULDK-NIEOCZEKIWANY-FORMAT" })
  })
})

describe("parsujOdpowiedzBudynkuUldk", () => {
  it("realna odpowiedź → identyfikator budynku i obrys (70 punktów, bez zamykającego)", () => {
    const w = parsujOdpowiedzBudynkuUldk(BUDYNEK)
    expect(w).toMatchObject({ ok: true, budynek: { id: "126105_9.0001.311.1_BUD", maOtwory: false } })
    if (!w.ok) return
    expect(w.budynek.punkty).toHaveLength(70)
    expect(w.budynek.punkty[0]).toEqual({ szerokosc: 50.0613285526919, dlugosc: 19.9368436944146 })
  })

  it("odpowiedź w formacie działki (7 pól) nie przechodzi jako budynek", () => {
    expect(parsujOdpowiedzBudynkuUldk(REALNA)).toMatchObject({ ok: false, kod: "ULDK-NIEOCZEKIWANY-FORMAT" })
  })
})

describe("dzialkaWPunkcie / dzialkaPoIdentyfikatorze / budynekWPunkcie", () => {
  it("GetParcelByXY: xy = lon,lat,4326, stały adres ULDK, pola wyniku w ustalonej kolejności", async () => {
    const f = vi.fn(tekst(REALNA))
    await dzialkaWPunkcie(52.23, 21.01, f as unknown as typeof fetch)
    const url = (f.mock.calls[0] as unknown as [URL])[0]
    expect(`${url.origin}/`).toBe(ULDK_URL)
    expect(url.searchParams.get("request")).toBe("GetParcelByXY")
    expect(url.searchParams.get("xy")).toBe("21.01,52.23,4326")
    expect(url.searchParams.get("result")).toBe("teryt,geom_wkt,voivodeship,county,commune,region,parcel")
  })

  it("GetBuildingByXY: xy = lon,lat,4326, pola id,geom_wkt", async () => {
    const f = vi.fn(tekst(BUDYNEK))
    const w = await budynekWPunkcie(50.0617, 19.9373, f as unknown as typeof fetch)
    expect(w.ok).toBe(true)
    const url = (f.mock.calls[0] as unknown as [URL])[0]
    expect(url.searchParams.get("request")).toBe("GetBuildingByXY")
    expect(url.searchParams.get("xy")).toBe("19.9373,50.0617,4326")
    expect(url.searchParams.get("result")).toBe("id,geom_wkt")
    expect(await budynekWPunkcie(52, 21, tekst(BRAK))).toMatchObject({ kod: "ULDK-NIE-ZNALEZIONO" })
  })

  it("GetParcelById z poprawnym TERYT", async () => {
    const f = vi.fn(tekst(REALNA))
    const w = await dzialkaPoIdentyfikatorze(" 146510_8.0309.23/3 ", f as unknown as typeof fetch)
    expect(w.ok).toBe(true)
    expect((f.mock.calls[0] as unknown as [URL])[0].searchParams.get("id")).toBe("146510_8.0309.23/3")
  })

  it("niepoprawny TERYT / współrzędne → ULDK-PARAMETRY-NIEPOPRAWNE bez wywołania sieci", async () => {
    const f = vi.fn(tekst(REALNA))
    expect(await dzialkaPoIdentyfikatorze("Mokotów 23", f as unknown as typeof fetch)).toMatchObject({ kod: "ULDK-PARAMETRY-NIEPOPRAWNE" })
    expect(await dzialkaWPunkcie(95, 21, f as unknown as typeof fetch)).toMatchObject({ kod: "ULDK-PARAMETRY-NIEPOPRAWNE" })
    expect(f).not.toHaveBeenCalled()
  })

  it("brak sieci (offline) → ULDK-NIEDOSTEPNY; timeout → ULDK-TIMEOUT; HTTP 500 → ULDK-NIEDOSTEPNY", async () => {
    const offline = (async () => {
      throw new TypeError("Failed to fetch")
    }) as unknown as typeof fetch
    const wolno = (async () => {
      throw new DOMException("timeout", "TimeoutError")
    }) as unknown as typeof fetch
    expect(await dzialkaWPunkcie(52, 21, offline)).toMatchObject({ kod: "ULDK-NIEDOSTEPNY" })
    expect(await dzialkaWPunkcie(52, 21, wolno)).toMatchObject({ kod: "ULDK-TIMEOUT" })
    expect(await dzialkaWPunkcie(52, 21, tekst("", 500))).toMatchObject({ kod: "ULDK-NIEDOSTEPNY" })
  })
})
