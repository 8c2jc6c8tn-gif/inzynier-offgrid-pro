/**
 * Adapter PVGIS TMY (Typical Meteorological Year) — rejestr-decyzji.md D22, dane wejściowe
 * Ekranu 4 Modułu 1 (`lib/core/modules/lokalizacja/orientacja-powierzchni/`).
 *
 * Zasady proxy — docs/standards/06-api-i-siec.md, 6.1: walidacja parametrów przed wysłaniem,
 * jawny timeout, sprawdzenie kształtu odpowiedzi, przy błędzie jawny kod powodu, NIGDY dane
 * zmyślone/zastępcze. Adres docelowy stały (nie od użytkownika) — 6.6 (SSRF) nie dotyczy.
 *
 * Czas rekordu: PVGIS zapisuje znacznik jako HH:00, ale wartości promieniowania odpowiadają
 * chwili HH:00 + `inputs.location.irradiance_time_offset` [h] (SARAH — zależnie od szerokości
 * geograficznej; ERA5 — stałe 0,5 h). Źródło: JRC, "PVGIS typical meteorological year (TMY)
 * generator" (strona narzędzia, sekcja o znacznikach czasu). Adapter dodaje offset, więc
 * `RekordGodzinowy.czasUtcMs` to rzeczywista chwila wartości — rozwiązuje TD15 (1).
 */
import { z } from "zod"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

export const PVGIS_TMY_URL = "https://re.jrc.ec.europa.eu/api/v5_3/tmy"
/** Timeout żądania do PVGIS [ms] — odpowiedź ma ~1,3 MB, generowanie po stronie JRC trwa kilka sekund. */
export const PVGIS_TIMEOUT_MS = 30_000
const MS_NA_GODZINE = 3_600_000
const GODZIN_TMY = 8760

const rekordSchema = z.object({
  "time(UTC)": z.string().regex(/^\d{8}:\d{4}$/),
  "G(h)": z.number().nonnegative(),
  "Gb(n)": z.number().nonnegative(),
  "Gd(h)": z.number().nonnegative(),
})

const odpowiedzSchema = z.object({
  inputs: z.object({
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      elevation: z.number(),
      irradiance_time_offset: z.number().min(0).max(1),
    }),
    meteo_data: z.object({
      radiation_db: z.string(),
      meteo_db: z.string(),
      year_min: z.number(),
      year_max: z.number(),
      use_horizon: z.boolean(),
      horizon_db: z.string(),
    }),
  }),
  outputs: z.object({
    tmy_hourly: z.array(rekordSchema).length(GODZIN_TMY),
  }),
})

export type MetadaneTmy = {
  szerokosc: number
  dlugosc: number
  wysokoscNpmM: number
  przesuniecieCzasuH: number
  bazaPromieniowania: string
  bazaMeteo: string
  rokOd: number
  rokDo: number
  horyzontTerenu: boolean
  zrodloHoryzontu: string
}

export type DaneTmy = { rekordy: RekordGodzinowy[]; meta: MetadaneTmy }

export type KodBleduPvgis =
  | "PVGIS-PARAMETRY-NIEPOPRAWNE"
  | "PVGIS-TIMEOUT"
  | "PVGIS-NIEDOSTEPNY"
  | "PVGIS-ODRZUCIL-ZAPYTANIE"
  | "PVGIS-NIEOCZEKIWANY-FORMAT"

export type WynikTmy = { ok: true; dane: DaneTmy } | { ok: false; kod: KodBleduPvgis; szczegoly: string }

/** "20180101:1200" → ms UTC dla HH:00 (bez offsetu). */
function znacznikNaMs(znacznik: string): number {
  const r = Number(znacznik.slice(0, 4))
  const m = Number(znacznik.slice(4, 6))
  const d = Number(znacznik.slice(6, 8))
  const hh = Number(znacznik.slice(9, 11))
  const mm = Number(znacznik.slice(11, 13))
  return Date.UTC(r, m - 1, d, hh, mm)
}

/** Czysty parser odpowiedzi PVGIS TMY (JSON) — bez sieci, testowalny. */
export function parsujOdpowiedzTmy(json: unknown): WynikTmy {
  const wynik = odpowiedzSchema.safeParse(json)
  if (!wynik.success) {
    return { ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT", szczegoly: wynik.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }
  }
  const { inputs, outputs } = wynik.data
  const offsetMs = inputs.location.irradiance_time_offset * MS_NA_GODZINE
  return {
    ok: true,
    dane: {
      rekordy: outputs.tmy_hourly.map((r) => ({
        czasUtcMs: znacznikNaMs(r["time(UTC)"]) + offsetMs,
        ghi: r["G(h)"],
        dni: r["Gb(n)"],
        dhi: r["Gd(h)"],
      })),
      meta: {
        szerokosc: inputs.location.latitude,
        dlugosc: inputs.location.longitude,
        wysokoscNpmM: inputs.location.elevation,
        przesuniecieCzasuH: inputs.location.irradiance_time_offset,
        bazaPromieniowania: inputs.meteo_data.radiation_db,
        bazaMeteo: inputs.meteo_data.meteo_db,
        rokOd: inputs.meteo_data.year_min,
        rokDo: inputs.meteo_data.year_max,
        horyzontTerenu: inputs.meteo_data.use_horizon,
        zrodloHoryzontu: inputs.meteo_data.horizon_db,
      },
    },
  }
}

/** Parametry z URL — wymagany niepusty tekst: samo `z.coerce.number()` zamieniłoby brak (null) na 0°. */
export const parametrySchema = z.object({
  lat: z.string().trim().min(1).pipe(z.coerce.number<string>().min(-90).max(90)),
  lon: z.string().trim().min(1).pipe(z.coerce.number<string>().min(-180).max(180)),
})

/** Pobranie TMY z PVGIS. `fetchImpl` wstrzykiwany w testach. */
export async function pobierzTmy(lat: number, lon: number, fetchImpl: typeof fetch = fetch): Promise<WynikTmy> {
  const url = new URL(PVGIS_TMY_URL)
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lon", String(lon))
  url.searchParams.set("outputformat", "json")

  let odpowiedz: Response
  try {
    odpowiedz = await fetchImpl(url, { signal: AbortSignal.timeout(PVGIS_TIMEOUT_MS) })
  } catch (e) {
    const timeout = e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError")
    return timeout
      ? { ok: false, kod: "PVGIS-TIMEOUT", szczegoly: `brak odpowiedzi w ${PVGIS_TIMEOUT_MS} ms` }
      : { ok: false, kod: "PVGIS-NIEDOSTEPNY", szczegoly: e instanceof Error ? e.message : String(e) }
  }

  if (!odpowiedz.ok) {
    // PVGIS zwraca 400 z komunikatem np. dla punktu na morzu / poza zasięgiem bazy danych.
    const tresc = await odpowiedz.text().catch(() => "")
    return {
      ok: false,
      kod: odpowiedz.status >= 400 && odpowiedz.status < 500 ? "PVGIS-ODRZUCIL-ZAPYTANIE" : "PVGIS-NIEDOSTEPNY",
      szczegoly: `HTTP ${odpowiedz.status}: ${tresc.slice(0, 300)}`,
    }
  }

  let json: unknown
  try {
    json = await odpowiedz.json()
  } catch {
    return { ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT", szczegoly: "odpowiedź nie jest poprawnym JSON" }
  }
  return parsujOdpowiedzTmy(json)
}
