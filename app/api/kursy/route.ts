/**
 * Server copy of the ECB exchange rates — GET /api/kursy.
 *
 * The server fetches Frankfurter at most once per `ODSWIEZ_S` (Next data cache) and hands the same
 * rates to every user; an online app downloads them here, stores them locally (`lib/waluta/storage`)
 * and shows the ECB date of the last update. The browser never needs the third-party host (CSP
 * `connect-src 'self'` suffices); if this route fails, the client falls back to Frankfurter directly.
 */
import { NextResponse } from "next/server"
import { parsujOdpowiedzKursow, urlKursowEbc } from "@/lib/waluta/kursy-zrodlo"

const ODSWIEZ_S = 12 * 60 * 60
const TIMEOUT_MS = 8000

export async function GET() {
  try {
    const odp = await fetch(urlKursowEbc(), { next: { revalidate: ODSWIEZ_S }, signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!odp.ok) throw new Error(`HTTP ${odp.status}`)
    const dane = parsujOdpowiedzKursow(await odp.json())
    if (!dane) throw new Error("unexpected response shape")
    return NextResponse.json(
      { ok: true, date: dane.date, rates: dane.rates },
      { headers: { "Cache-Control": `public, s-maxage=${ODSWIEZ_S}, stale-while-revalidate=${ODSWIEZ_S * 2}` } },
    )
  } catch {
    return NextResponse.json({ ok: false, kod: "KURSY-NIEDOSTEPNE" }, { status: 502 })
  }
}
