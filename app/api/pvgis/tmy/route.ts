/**
 * Proxy PVGIS TMY — rejestr-decyzji.md D22. GET /api/pvgis/tmy?lat=..&lon=..
 *
 * Przeglądarka nie woła PVGIS bezpośrednio: CSP `connect-src 'self'` (middleware.ts) zostaje
 * nienaruszone, a walidacja/timeout/sprawdzenie kształtu (06-api-i-siec.md, 6.1) są w jednym
 * miejscu — `lib/adapters/pvgis/tmy.ts`. Offline-first (05, 5.3): klient zapisuje wynik lokalnie
 * po pobraniu; ten endpoint jest dodatkiem, nie warunkiem działania Ekranu 4.
 */
import { NextResponse, type NextRequest } from "next/server"
import { parametrySchema, pobierzTmy, type KodBleduPvgis } from "@/lib/adapters/pvgis/tmy"

/** TMY dla danej lokalizacji jest stabilny (wieloletnia baza) — dzień cache w przeglądarce użytkownika. */
const CACHE_CONTROL = "private, max-age=86400"

const STATUS_BLEDU: Record<KodBleduPvgis, number> = {
  "PVGIS-PARAMETRY-NIEPOPRAWNE": 400,
  "PVGIS-ODRZUCIL-ZAPYTANIE": 422,
  "PVGIS-TIMEOUT": 504,
  "PVGIS-NIEDOSTEPNY": 502,
  "PVGIS-NIEOCZEKIWANY-FORMAT": 502,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const parametry = parametrySchema.safeParse({ lat: searchParams.get("lat"), lon: searchParams.get("lon") })
  if (!parametry.success) {
    return NextResponse.json(
      { ok: false, kod: "PVGIS-PARAMETRY-NIEPOPRAWNE", szczegoly: "lat ∈ [-90, 90], lon ∈ [-180, 180]" },
      { status: STATUS_BLEDU["PVGIS-PARAMETRY-NIEPOPRAWNE"] },
    )
  }

  const wynik = await pobierzTmy(parametry.data.lat, parametry.data.lon)
  if (!wynik.ok) return NextResponse.json(wynik, { status: STATUS_BLEDU[wynik.kod] })
  return NextResponse.json(wynik, { headers: { "Cache-Control": CACHE_CONTROL } })
}
