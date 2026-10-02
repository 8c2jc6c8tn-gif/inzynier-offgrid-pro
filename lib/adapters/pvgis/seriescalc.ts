/**
 * Adapter PVGIS `seriescalc` — wieloletnia seria godzinowa promieniowania na płaszczyźnie
 * modułów, sprowadzona do sum dobowych dla historii Ekranu 2 Modułu 7 ("Deficyty miesięczne",
 * `lib/core/modules/stress-test/deficyty-miesieczne/`). Rejestr-decyzji.md D22 (proxy), TD15.
 *
 * Zasady proxy — docs/standards/06-api-i-siec.md, 6.1: walidacja parametrów przed wysłaniem,
 * jawny timeout, sprawdzenie kształtu odpowiedzi, przy błędzie jawny kod powodu, NIGDY dane
 * zmyślone/zastępcze. Adres docelowy stały (nie od użytkownika) — 6.6 (SSRF) nie dotyczy.
 *
 * Granice bazy (zweryfikowane na żywo 02.10.2026, v5_3): lata 2005–2023 (PVGIS-SARAH3 + ERA5),
 * ok. 0,75 MB na rok (19 lat ≈ 14 MB) — stąd dłuższy timeout niż dla TMY. `G(i)` [W/m²] to
 * średnia godzinowa; suma 24 takich wartości [Wh/m²]/1000 = dobowe napromieniowanie [kWh/m²].
 *
 * Doba = data UTC ze znacznika (`YYYYMMDD:HH10`). Dla Polski (UTC+1/+2) różnica względem doby
 * lokalnej dotyczy godzin nocnych, w których promieniowanie jest zerowe, więc suma się nie zmienia
 * w sposób istotny; przy szerokościach, gdzie to nieprawda, doby brzegowe byłyby przesunięte.
 * Doba bez kompletu 24 rekordów = brak (`null`) — nigdy nie dopełniana.
 */
import { z } from "zod"
import type { RokHistorii } from "@/lib/core/modules/stress-test/deficyty-miesieczne/input"
import type { KodBleduPvgis } from "./tmy"

export const PVGIS_SERIESCALC_URL = "https://re.jrc.ec.europa.eu/api/v5_3/seriescalc"
/** Timeout [ms] — do ~14 MB odpowiedzi i dłuższe generowanie po stronie JRC niż dla TMY. */
export const PVGIS_SERIESCALC_TIMEOUT_MS = 90_000
export const SERIESCALC_ROK_MIN = 2005
export const SERIESCALC_ROK_MAX = 2023
const GODZIN_W_DOBIE = 24

const rekordSchema = z.object({
  time: z.string().regex(/^\d{8}:\d{4}$/),
  "G(i)": z.number().nonnegative(),
})

const odpowiedzSchema = z.object({
  inputs: z.object({
    location: z.object({ latitude: z.number(), longitude: z.number(), elevation: z.number() }),
    meteo_data: z.object({ radiation_db: z.string(), meteo_db: z.string() }),
  }),
  outputs: z.object({ hourly: z.array(rekordSchema).min(1) }),
})

export type MetadaneSeriescalc = {
  szerokosc: number
  dlugosc: number
  wysokoscNpmM: number
  bazaPromieniowania: string
  bazaMeteo: string
}

export type DaneSeriescalc = {
  /** Dobowe napromieniowanie płaszczyzny modułów [kWh/m²/dobę], od 1 stycznia; `null` = doba niekompletna. */
  lata: RokHistorii[]
  meta: MetadaneSeriescalc
}

export type WynikSeriescalc = { ok: true; dane: DaneSeriescalc } | { ok: false; kod: KodBleduPvgis; szczegoly: string }

const dniWRoku = (rok: number) => ((rok % 4 === 0 && rok % 100 !== 0) || rok % 400 === 0 ? 366 : 365)

/** Czysty parser odpowiedzi `seriescalc` (JSON) — bez sieci, testowalny. */
export function parsujOdpowiedzSeriescalc(json: unknown): WynikSeriescalc {
  const wynik = odpowiedzSchema.safeParse(json)
  if (!wynik.success) {
    return { ok: false, kod: "PVGIS-NIEOCZEKIWANY-FORMAT", szczegoly: wynik.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }
  }
  const { inputs, outputs } = wynik.data
  // rok → numer doby (0-based) → { suma [Wh/m²], liczba rekordów }
  const doby = new Map<number, Map<number, { suma: number; n: number }>>()
  for (const r of outputs.hourly) {
    const rok = Number(r.time.slice(0, 4))
    const dzien = Math.round((Date.UTC(rok, Number(r.time.slice(4, 6)) - 1, Number(r.time.slice(6, 8))) - Date.UTC(rok, 0, 1)) / 86_400_000)
    const poRoku = doby.get(rok) ?? new Map<number, { suma: number; n: number }>()
    const d = poRoku.get(dzien) ?? { suma: 0, n: 0 }
    d.suma += r["G(i)"]
    d.n += 1
    poRoku.set(dzien, d)
    doby.set(rok, poRoku)
  }
  const lata: RokHistorii[] = [...doby.keys()]
    .sort((a, b) => a - b)
    .map((rok) => {
      const poRoku = doby.get(rok)!
      const dni = Array.from({ length: dniWRoku(rok) }, (_, i): number | null => {
        const d = poRoku.get(i)
        return d && d.n === GODZIN_W_DOBIE ? Math.round(d.suma) / 1000 : null // Wh → kWh, rounded: no float noise in the payload
      })
      return { rok, dni }
    })
  return {
    ok: true,
    dane: {
      lata,
      meta: {
        szerokosc: inputs.location.latitude,
        dlugosc: inputs.location.longitude,
        wysokoscNpmM: inputs.location.elevation,
        bazaPromieniowania: inputs.meteo_data.radiation_db,
        bazaMeteo: inputs.meteo_data.meteo_db,
      },
    },
  }
}

/** Parametry z URL — wymagany niepusty tekst (samo `coerce` zamieniłoby brak na 0). */
const liczbaZTekstu = (min: number, max: number) => z.string().trim().min(1).pipe(z.coerce.number<string>().min(min).max(max))

export const parametrySeriescalcSchema = z
  .object({
    lat: liczbaZTekstu(-90, 90),
    lon: liczbaZTekstu(-180, 180),
    od: liczbaZTekstu(SERIESCALC_ROK_MIN, SERIESCALC_ROK_MAX).pipe(z.number().int()),
    do: liczbaZTekstu(SERIESCALC_ROK_MIN, SERIESCALC_ROK_MAX).pipe(z.number().int()),
    nachylenie: liczbaZTekstu(0, 90),
    // PVGIS: 0 = południe, 90 = zachód, -90 = wschód, ±180 = północ.
    azymut: liczbaZTekstu(-180, 180),
  })
  .refine((p) => p.od <= p.do, { message: "od ≤ do" })

export type ParametrySeriescalc = z.infer<typeof parametrySeriescalcSchema>

/** Pobranie serii z PVGIS. `fetchImpl` wstrzykiwany w testach. */
export async function pobierzSeriescalc(p: ParametrySeriescalc, fetchImpl: typeof fetch = fetch): Promise<WynikSeriescalc> {
  const url = new URL(PVGIS_SERIESCALC_URL)
  url.searchParams.set("lat", String(p.lat))
  url.searchParams.set("lon", String(p.lon))
  url.searchParams.set("startyear", String(p.od))
  url.searchParams.set("endyear", String(p.do))
  url.searchParams.set("angle", String(p.nachylenie))
  url.searchParams.set("aspect", String(p.azymut))
  url.searchParams.set("outputformat", "json")

  let odpowiedz: Response
  try {
    odpowiedz = await fetchImpl(url, { signal: AbortSignal.timeout(PVGIS_SERIESCALC_TIMEOUT_MS) })
  } catch (e) {
    const timeout = e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError")
    return timeout
      ? { ok: false, kod: "PVGIS-TIMEOUT", szczegoly: `brak odpowiedzi w ${PVGIS_SERIESCALC_TIMEOUT_MS} ms` }
      : { ok: false, kod: "PVGIS-NIEDOSTEPNY", szczegoly: e instanceof Error ? e.message : String(e) }
  }

  if (!odpowiedz.ok) {
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
  return parsujOdpowiedzSeriescalc(json)
}
