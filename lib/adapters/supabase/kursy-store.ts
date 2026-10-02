import "server-only"

/**
 * Persistent server copy of the ECB rates (table `kursy_walut`, migration 0002). One row per ECB
 * publication date. Server-only, service role: the browser never reads this table directly — it gets
 * the rates from `/api/kursy`. Without Supabase/service-role config both functions degrade quietly
 * (no persistence, `/api/kursy` then serves Frankfurter through the Next data cache only).
 */
import { liczbyDodatnie, type OdpowiedzKursow } from "@/lib/waluta/kursy-zrodlo"
import { createSupabaseAdminClient } from "./admin"
import { isServiceRoleConfigured, isSupabaseConfigured } from "./config"

export interface KursyZSerwera extends OdpowiedzKursow {
  pobranoMs: number
}

export function kursyStoreSkonfigurowany(): boolean {
  return isSupabaseConfigured() && isServiceRoleConfigured()
}

export async function zapiszKursy(dane: OdpowiedzKursow): Promise<boolean> {
  if (!kursyStoreSkonfigurowany()) return false
  const { error } = await createSupabaseAdminClient()
    .from("kursy_walut")
    .upsert({ data_ecb: dane.date, kursy: dane.rates, pobrano: new Date().toISOString() })
  return !error
}

export async function odczytajNajnowszeKursy(): Promise<KursyZSerwera | null> {
  if (!kursyStoreSkonfigurowany()) return null
  const { data, error } = await createSupabaseAdminClient()
    .from("kursy_walut")
    .select("data_ecb, kursy, pobrano")
    .order("data_ecb", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  const rates = liczbyDodatnie(data.kursy)
  const pobranoMs = Date.parse(data.pobrano)
  if (Object.keys(rates).length === 0 || Number.isNaN(pobranoMs)) return null
  return { date: String(data.data_ecb), rates, pobranoMs }
}
