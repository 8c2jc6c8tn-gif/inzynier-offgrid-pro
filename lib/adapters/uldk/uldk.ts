/**
 * Adapter ULDK (Usługa Lokalizacji Działek Katastralnych, GUGiK) — tryb online Skanera działki
 * (Moduł 1, Ekran 2). rejestr-decyzji.md D23: wołany BEZPOŚREDNIO z przeglądarki, bez proxy —
 * ULDK wysyła `Access-Control-Allow-Origin: *` (sprawdzone 24.09.2026), CSP `connect-src`
 * dopuszcza wyłącznie `https://uldk.gugik.gov.pl` (middleware.ts).
 *
 * Te same zasady co proxy (06-api-i-siec.md, 6.1), tylko po stronie klienta: walidacja
 * parametrów, jawny timeout, sprawdzenie formatu odpowiedzi, jawny kod błędu, nigdy dane
 * zastępcze. Brak sieci → `ULDK-NIEDOSTEPNY`; UI przechodzi wtedy na spacer GPS (tryb offline
 * ze źródła), nie blokuje ekranu (05, 5.3).
 *
 * Format odpowiedzi (text/plain, sprawdzony na żywo 24.09.2026): linia statusu "0" = sukces,
 * potem jedna linia z polami rozdzielonymi "|" w kolejności parametru `result`; "-1 brak wyników"
 * = nie znaleziono (HTTP 200). Geometria: `SRID=4326;POLYGON((lon lat, ...))`.
 */
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"

export const ULDK_URL = "https://uldk.gugik.gov.pl/"
export const ULDK_TIMEOUT_MS = 15_000
/** Pola zwracane przez ULDK — kolejność ma znaczenie (tak samo w odpowiedzi). */
const POLA_WYNIKU = ["teryt", "geom_wkt", "voivodeship", "county", "commune", "region", "parcel"] as const
const SRID_WGS84 = "4326"
/** Identyfikator działki TERYT, np. "146510_8.0309.23/3" — sprawdzamy tylko znaki i kształt ogólny. */
const WZORZEC_TERYT = /^\d{6}_\d\.\d{4}\.[\w./-]+$/

export type DzialkaUldk = {
  teryt: string
  numer: string
  obreb: string
  gmina: string
  powiat: string
  wojewodztwo: string
  /** Obrys zewnętrzny, bez powtórzonego punktu zamykającego — wejście `punktyDzialki` Skanera. */
  punkty: PunktGps[]
  /** Geometria miała otwory (pierścienie wewnętrzne) — zwracany tylko obrys zewnętrzny. */
  maOtwory: boolean
}

export type KodBleduUldk =
  | "ULDK-PARAMETRY-NIEPOPRAWNE"
  | "ULDK-TIMEOUT"
  | "ULDK-NIEDOSTEPNY"
  | "ULDK-NIE-ZNALEZIONO"
  | "ULDK-WIELE-WYNIKOW"
  | "ULDK-GEOMETRIA-NIEOBSLUGIWANA"
  | "ULDK-NIEOCZEKIWANY-FORMAT"

export type WynikUldk = { ok: true; dzialka: DzialkaUldk } | { ok: false; kod: KodBleduUldk; szczegoly: string }

function blad(kod: KodBleduUldk, szczegoly: string): WynikUldk {
  return { ok: false, kod, szczegoly }
}

/** Pierścień WKT "lon lat, lon lat, ..." → punkty (bez punktu zamykającego). */
function parsujPierscien(tekst: string): PunktGps[] | null {
  const punkty: PunktGps[] = []
  for (const para of tekst.split(",")) {
    const [lon, lat] = para.trim().split(/\s+/).map(Number)
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null
    punkty.push({ szerokosc: lat!, dlugosc: lon! })
  }
  const a = punkty[0]
  const b = punkty[punkty.length - 1]
  if (a && b && punkty.length > 1 && a.szerokosc === b.szerokosc && a.dlugosc === b.dlugosc) punkty.pop()
  return punkty.length >= 3 ? punkty : null
}

/** Czysty parser odpowiedzi ULDK (text/plain) — bez sieci, testowalny. */
export function parsujOdpowiedzUldk(tekst: string): WynikUldk {
  const linie = tekst.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
  const status = linie[0] ?? ""
  if (status.startsWith("-1")) return blad("ULDK-NIE-ZNALEZIONO", status)
  if (status !== "0") return blad("ULDK-NIEOCZEKIWANY-FORMAT", `status: ${status.slice(0, 100)}`)
  const wyniki = linie.slice(1)
  if (wyniki.length === 0) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "status 0 bez wyniku")
  if (wyniki.length > 1) return blad("ULDK-WIELE-WYNIKOW", `${wyniki.length} działek w odpowiedzi`)

  const pola = wyniki[0]!.split("|")
  if (pola.length !== POLA_WYNIKU.length) {
    return blad("ULDK-NIEOCZEKIWANY-FORMAT", `oczekiwano ${POLA_WYNIKU.length} pól, jest ${pola.length}`)
  }
  const [teryt, wkt, wojewodztwo, powiat, gmina, obreb, numer] = pola as [string, string, string, string, string, string, string]

  const geom = /^SRID=4326;(\w+)\s*\((.*)\)$/.exec(wkt)
  if (!geom) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "geometria nie w postaci SRID=4326;TYP(...)")
  if (geom[1] !== "POLYGON") return blad("ULDK-GEOMETRIA-NIEOBSLUGIWANA", `typ geometrii: ${geom[1]}`)
  const pierscienie = geom[2]!.match(/\(([^()]*)\)/g)
  if (!pierscienie || pierscienie.length === 0) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "brak pierścieni wielokąta")
  const punkty = parsujPierscien(pierscienie[0]!.slice(1, -1))
  if (!punkty) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "niepoprawne współrzędne obrysu")

  return {
    ok: true,
    dzialka: { teryt, numer, obreb, gmina, powiat, wojewodztwo, punkty, maOtwory: pierscienie.length > 1 },
  }
}

async function zapytaj(parametry: Record<string, string>, fetchImpl: typeof fetch): Promise<WynikUldk> {
  const url = new URL(ULDK_URL)
  for (const [k, v] of Object.entries(parametry)) url.searchParams.set(k, v)
  url.searchParams.set("result", POLA_WYNIKU.join(","))
  url.searchParams.set("srid", SRID_WGS84)

  let odpowiedz: Response
  try {
    odpowiedz = await fetchImpl(url, { signal: AbortSignal.timeout(ULDK_TIMEOUT_MS) })
  } catch (e) {
    const timeout = e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError")
    return timeout
      ? blad("ULDK-TIMEOUT", `brak odpowiedzi w ${ULDK_TIMEOUT_MS} ms`)
      : blad("ULDK-NIEDOSTEPNY", e instanceof Error ? e.message : String(e))
  }
  if (!odpowiedz.ok) return blad("ULDK-NIEDOSTEPNY", `HTTP ${odpowiedz.status}`)
  const tekst = await odpowiedz.text().catch(() => null)
  if (tekst === null) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "nie udało się odczytać treści odpowiedzi")
  return parsujOdpowiedzUldk(tekst)
}

/** Działka po identyfikatorze TERYT (np. "146510_8.0309.23/3"). */
export function dzialkaPoIdentyfikatorze(teryt: string, fetchImpl: typeof fetch = fetch): Promise<WynikUldk> {
  const id = teryt.trim()
  if (!WZORZEC_TERYT.test(id)) return Promise.resolve(blad("ULDK-PARAMETRY-NIEPOPRAWNE", "identyfikator nie ma formatu TERYT"))
  return zapytaj({ request: "GetParcelById", id }, fetchImpl)
}

/** Działka zawierająca punkt (GPS urządzenia albo kliknięcie w mapę), WGS84. */
export function dzialkaWPunkcie(szerokosc: number, dlugosc: number, fetchImpl: typeof fetch = fetch): Promise<WynikUldk> {
  const poprawny =
    Number.isFinite(szerokosc) && Number.isFinite(dlugosc) && Math.abs(szerokosc) <= 90 && Math.abs(dlugosc) <= 180
  if (!poprawny) return Promise.resolve(blad("ULDK-PARAMETRY-NIEPOPRAWNE", "współrzędne poza zakresem"))
  return zapytaj({ request: "GetParcelByXY", xy: `${dlugosc},${szerokosc},${SRID_WGS84}` }, fetchImpl)
}
