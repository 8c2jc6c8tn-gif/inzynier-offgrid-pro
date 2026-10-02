/**
 * Server copy of the ECB exchange rates — GET /api/kursy (logic: `lib/adapters/kursy/serwis.ts`).
 * An online app downloads the result, stores it locally (`lib/waluta/storage`) and shows the date
 * of the last update. The browser never needs the third-party host (CSP `connect-src 'self'`); if
 * this route fails, the client falls back to Frankfurter directly.
 */
import { NextResponse } from "next/server"
import { kursyDlaKlientow, ODSWIEZ_S } from "@/lib/adapters/kursy/serwis"

export async function GET() {
  const wynik = await kursyDlaKlientow()
  if (!wynik.ok) return NextResponse.json(wynik, { status: 502 })
  return NextResponse.json(wynik, {
    headers: { "Cache-Control": `public, s-maxage=${ODSWIEZ_S}, stale-while-revalidate=${ODSWIEZ_S * 2}` },
  })
}
