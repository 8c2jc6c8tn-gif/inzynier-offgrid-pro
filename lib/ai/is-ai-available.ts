"use server"

/**
 * 9.0 — `isAiAvailable()` (albo równoważnik): komponent kliencki pyta to, żeby bezpiecznie
 * zdegradować się w milczeniu, gdy AI nie jest skonfigurowane — ten sam wzorzec co
 * `getAccountStatus()` dla logowania (18.5: żaden klucz/sekret nie trafia do klienta).
 */
import { isAiConfigured } from "@/lib/adapters/ai/config"

export async function isAiAvailable(): Promise<boolean> {
  return isAiConfigured()
}
