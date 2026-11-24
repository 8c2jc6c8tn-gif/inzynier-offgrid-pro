import "server-only"

/**
 * Logic of GET /api/kursy: (1) the stored copy (`kursy_walut`, Supabase) when younger than
 * `ODSWIEZ_S`; (2) otherwise NBP table A (average rates), saved to the store for everyone; (3) when NBP
 * fails, the last stored copy (stale, but real data with its publication date). Without Supabase config the
 * store is skipped (Next data cache only).
 */
import { odczytajNajnowszeKursy, zapiszKursy } from "@/lib/adapters/supabase/kursy-store"
import { parsujTabeleNbp, URL_TABELI_NBP, type OdpowiedzKursow } from "@/lib/waluta/kursy-zrodlo"

export const ODSWIEZ_S = 12 * 60 * 60
const TIMEOUT_MS = 8000

export type WynikKursow =
  | { ok: true; date: string; rates: OdpowiedzKursow["rates"]; source: "zapis" | "nbp" | "zapis-nieaktualny" }
  | { ok: false; kod: "KURSY-NIEDOSTEPNE" }

async function pobierzZNbp(): Promise<OdpowiedzKursow> {
  const odp = await fetch(URL_TABELI_NBP, { next: { revalidate: ODSWIEZ_S }, signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!odp.ok) throw new Error(`HTTP ${odp.status}`)
  const dane = parsujTabeleNbp(await odp.json())
  if (!dane) throw new Error("unexpected response shape")
  return dane
}

export async function kursyDlaKlientow(): Promise<WynikKursow> {
  const zapis = await odczytajNajnowszeKursy().catch(() => null)
  if (zapis && Date.now() - zapis.pobranoMs < ODSWIEZ_S * 1000) return { ok: true, date: zapis.date, rates: zapis.rates, source: "zapis" }
  try {
    const dane = await pobierzZNbp()
    await zapiszKursy(dane).catch(() => false)
    return { ok: true, date: dane.date, rates: dane.rates, source: "nbp" }
  } catch {
    if (zapis) return { ok: true, date: zapis.date, rates: zapis.rates, source: "zapis-nieaktualny" }
    return { ok: false, kod: "KURSY-NIEDOSTEPNE" }
  }
}
