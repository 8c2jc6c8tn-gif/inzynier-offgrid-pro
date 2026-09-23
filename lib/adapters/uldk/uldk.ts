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
 *
 * Obrysy budynków (GetBuildingByXY) — ta sama usługa, ten sam format; pokrycie niepełne (np. Warszawa
 * 24.09.2026: "-1 brak wyników", Kraków: jest). Źródło: "nie wszędzie dane są dokładne" — dlatego
 * brak budynku w ULDK jest zwykłym wynikiem, nie błędem aplikacji, a spacer GPS zostaje zawsze dostępny.
 */
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"

export const ULDK_URL = "https://uldk.gugik.gov.pl/"
export const ULDK_TIMEOUT_MS = 15_000
/** Pola zwracane przez ULDK — kolejność ma znaczenie (tak samo w odpowiedzi). */
const POLA_WYNIKU = ["teryt", "geom_wkt", "voivodeship", "county", "commune", "region", "parcel"] as const
const POLA_WYNIKU_BUDYNKU = ["id", "geom_wkt"] as const
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

/** Obrys budynku z ULDK (Zbiorcza baza budynków) — pokrycie niepełne: brak wyniku nie znaczy, że budynku nie ma. */
export type BudynekUldk = {
  id: string
  /** Obrys zewnętrzny, bez powtórzonego punktu zamykającego — wejście `punktyBudynku` Skanera. */
  punkty: PunktGps[]
  maOtwory: boolean
}

type BladUldk = { ok: false; kod: KodBleduUldk; szczegoly: string }
export type WynikUldk = { ok: true; dzialka: DzialkaUldk } | BladUldk
export type WynikBudynkuUldk = { ok: true; budynek: BudynekUldk } | BladUldk

function blad(kod: KodBleduUldk, szczegoly: string): BladUldk {
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

type Obrys = { punkty: PunktGps[]; maOtwory: boolean }

/** Wspólna część odpowiedzi działki i budynku: status, jedna linia wyniku, pola, geometria. */
function parsujLinieWyniku(tekst: string, liczbaPol: number): { ok: true; pola: string[]; obrys: Obrys } | BladUldk {
  const linie = tekst.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
  const status = linie[0] ?? ""
  if (status.startsWith("-1")) return blad("ULDK-NIE-ZNALEZIONO", status)
  if (status !== "0") return blad("ULDK-NIEOCZEKIWANY-FORMAT", `status: ${status.slice(0, 100)}`)
  const wyniki = linie.slice(1)
  if (wyniki.length === 0) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "status 0 bez wyniku")
  if (wyniki.length > 1) return blad("ULDK-WIELE-WYNIKOW", `${wyniki.length} obiektów w odpowiedzi`)

  const pola = wyniki[0]!.split("|")
  if (pola.length !== liczbaPol) {
    return blad("ULDK-NIEOCZEKIWANY-FORMAT", `oczekiwano ${liczbaPol} pól, jest ${pola.length}`)
  }
  // Geometria zawsze drugim polem (POLA_WYNIKU, POLA_WYNIKU_BUDYNKU).
  const geom = /^SRID=4326;(\w+)\s*\((.*)\)$/.exec(pola[1]!)
  if (!geom) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "geometria nie w postaci SRID=4326;TYP(...)")
  if (geom[1] !== "POLYGON") return blad("ULDK-GEOMETRIA-NIEOBSLUGIWANA", `typ geometrii: ${geom[1]}`)
  const pierscienie = geom[2]!.match(/\(([^()]*)\)/g)
  if (!pierscienie || pierscienie.length === 0) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "brak pierścieni wielokąta")
  const punkty = parsujPierscien(pierscienie[0]!.slice(1, -1))
  if (!punkty) return blad("ULDK-NIEOCZEKIWANY-FORMAT", "niepoprawne współrzędne obrysu")
  return { ok: true, pola, obrys: { punkty, maOtwory: pierscienie.length > 1 } }
}

/** Czysty parser odpowiedzi ULDK dla działki (text/plain) — bez sieci, testowalny. */
export function parsujOdpowiedzUldk(tekst: string): WynikUldk {
  const w = parsujLinieWyniku(tekst, POLA_WYNIKU.length)
  if (!w.ok) return w
  const [teryt, , wojewodztwo, powiat, gmina, obreb, numer] = w.pola as [string, string, string, string, string, string, string]
  return { ok: true, dzialka: { teryt, numer, obreb, gmina, powiat, wojewodztwo, ...w.obrys } }
}

/** Czysty parser odpowiedzi ULDK dla budynku (GetBuildingByXY). */
export function parsujOdpowiedzBudynkuUldk(tekst: string): WynikBudynkuUldk {
  const w = parsujLinieWyniku(tekst, POLA_WYNIKU_BUDYNKU.length)
  if (!w.ok) return w
  return { ok: true, budynek: { id: w.pola[0]!, ...w.obrys } }
}

async function zapytaj<W>(
  parametry: Record<string, string>,
  pola: readonly string[],
  parser: (tekst: string) => W | BladUldk,
  fetchImpl: typeof fetch,
): Promise<W | BladUldk> {
  const url = new URL(ULDK_URL)
  for (const [k, v] of Object.entries(parametry)) url.searchParams.set(k, v)
  url.searchParams.set("result", pola.join(","))
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
  return parser(tekst)
}

function poprawnyPunkt(szerokosc: number, dlugosc: number): boolean {
  return Number.isFinite(szerokosc) && Number.isFinite(dlugosc) && Math.abs(szerokosc) <= 90 && Math.abs(dlugosc) <= 180
}

/** Działka po identyfikatorze TERYT (np. "146510_8.0309.23/3"). */
export function dzialkaPoIdentyfikatorze(teryt: string, fetchImpl: typeof fetch = fetch): Promise<WynikUldk> {
  const id = teryt.trim()
  if (!WZORZEC_TERYT.test(id)) return Promise.resolve(blad("ULDK-PARAMETRY-NIEPOPRAWNE", "identyfikator nie ma formatu TERYT"))
  return zapytaj({ request: "GetParcelById", id }, POLA_WYNIKU, parsujOdpowiedzUldk, fetchImpl)
}

/** Działka zawierająca punkt (GPS urządzenia albo kliknięcie w mapę), WGS84. */
export function dzialkaWPunkcie(szerokosc: number, dlugosc: number, fetchImpl: typeof fetch = fetch): Promise<WynikUldk> {
  if (!poprawnyPunkt(szerokosc, dlugosc)) return Promise.resolve(blad("ULDK-PARAMETRY-NIEPOPRAWNE", "współrzędne poza zakresem"))
  const xy = `${dlugosc},${szerokosc},${SRID_WGS84}`
  return zapytaj({ request: "GetParcelByXY", xy }, POLA_WYNIKU, parsujOdpowiedzUldk, fetchImpl)
}

/** Budynek zawierający punkt, WGS84 (GetBuildingByXY — sprawdzone na żywo 24.09.2026). */
export function budynekWPunkcie(
  szerokosc: number,
  dlugosc: number,
  fetchImpl: typeof fetch = fetch,
): Promise<WynikBudynkuUldk> {
  if (!poprawnyPunkt(szerokosc, dlugosc)) return Promise.resolve(blad("ULDK-PARAMETRY-NIEPOPRAWNE", "współrzędne poza zakresem"))
  const xy = `${dlugosc},${szerokosc},${SRID_WGS84}`
  return zapytaj({ request: "GetBuildingByXY", xy }, POLA_WYNIKU_BUDYNKU, parsujOdpowiedzBudynkuUldk, fetchImpl)
}
