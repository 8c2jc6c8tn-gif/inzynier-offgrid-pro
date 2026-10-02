/**
 * Proxy PVGIS seriescalc — rejestr-decyzji.md D22. GET
 * /api/pvgis/seriescalc?lat=..&lon=..&od=..&do=..&nachylenie=..&azymut=..
 *
 * Jak `/api/pvgis/tmy`: przeglądarka nie woła PVGIS bezpośrednio (CSP `connect-src 'self'`);
 * walidacja/timeout/kształt odpowiedzi w `lib/adapters/pvgis/seriescalc.ts`. Odpowiedź PVGIS
 * (do ~14 MB) jest sprowadzana tu do sum dobowych (kilkadziesiąt KB), więc do klienta idzie mało.
 */
import { NextResponse, type NextRequest } from "next/server"
import { parametrySeriescalcSchema, pobierzSeriescalc } from "@/lib/adapters/pvgis/seriescalc"
import type { KodBleduPvgis } from "@/lib/adapters/pvgis/tmy"

/** Wieloletnia historia archiwalna nie zmienia się w ciągu dnia. */
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
  const parametry = parametrySeriescalcSchema.safeParse({
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
    od: searchParams.get("od"),
    do: searchParams.get("do"),
    nachylenie: searchParams.get("nachylenie"),
    azymut: searchParams.get("azymut"),
  })
  if (!parametry.success) {
    return NextResponse.json(
      {
        ok: false,
        kod: "PVGIS-PARAMETRY-NIEPOPRAWNE",
        szczegoly: "lat ∈ [-90, 90], lon ∈ [-180, 180], od ≤ do ∈ [2005, 2023], nachylenie ∈ [0, 90], azymut ∈ [-180, 180]",
      },
      { status: STATUS_BLEDU["PVGIS-PARAMETRY-NIEPOPRAWNE"] },
    )
  }

  const wynik = await pobierzSeriescalc(parametry.data)
  if (!wynik.ok) return NextResponse.json(wynik, { status: STATUS_BLEDU[wynik.kod] })
  return NextResponse.json(wynik, { headers: { "Cache-Control": CACHE_CONTROL } })
}
