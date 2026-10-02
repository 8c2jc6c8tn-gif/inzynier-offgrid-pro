import "server-only"

/**
 * Logic of GET /api/kursy: (1) the stored copy (`kursy_walut`, Supabase) when younger than
 * `ODSWIEZ_S`; (2) otherwise Frankfurter, saved to the store for everyone; (3) when Frankfurter
 * fails, the last stored copy (stale, but real data with its ECB date). Without Supabase config the
 * store is skipped (Next data cache only).
 */
import { odczytajNajnowszeKursy, zapiszKursy } from "@/lib/adapters/supabase/kursy-store"
import { parsujOdpowiedzKursow, urlKursowEbc, type OdpowiedzKursow } from "@/lib/waluta/kursy-zrodlo"

export const ODSWIEZ_S = 12 * 60 * 60
const TIMEOUT_MS = 8000

export type WynikKursow =
  | { ok: true; date: string; rates: OdpowiedzKursow["rates"]; source: "zapis" | "ecb" | "zapis-nieaktualny" }
  | { ok: false; kod: "KURSY-NIEDOSTEPNE" }

async function pobierzZFrankfurter(): Promise<OdpowiedzKursow> {
  const odp = await fetch(urlKursowEbc(), { next: { revalidate: ODSWIEZ_S }, signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!odp.ok) throw new Error(`HTTP ${odp.status}`)
  const dane = parsujOdpowiedzKursow(await odp.json())
  if (!dane) throw new Error("unexpected response shape")
  return dane
}

export async function kursyDlaKlientow(): Promise<WynikKursow> {
  const zapis = await odczytajNajnowszeKursy().catch(() => null)
  if (zapis && Date.now() - zapis.pobranoMs < ODSWIEZ_S * 1000) return { ok: true, date: zapis.date, rates: zapis.rates, source: "zapis" }
  try {
    const dane = await pobierzZFrankfurter()
    await zapiszKursy(dane).catch(() => false)
    return { ok: true, date: dane.date, rates: dane.rates, source: "ecb" }
  } catch {
    if (zapis) return { ok: true, date: zapis.date, rates: zapis.rates, source: "zapis-nieaktualny" }
    return { ok: false, kod: "KURSY-NIEDOSTEPNE" }
  }
}
