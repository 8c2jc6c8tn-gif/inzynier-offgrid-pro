"use server"

/**
 * Server Action, nie klient przeglądarkowy — docs/standards/18-logowanie.md, 18.5. Projekt
 * świadomie nie ma `createBrowserClient` (usunięty razem z tą zmianą): sesja żyje wyłącznie w
 * `HttpOnly` cookie ustawianej server-side (`lib/adapters/supabase/config.ts`,
 * `sessionCookieOptions()`) — kod klienta nigdy nie tworzy własnego klienta Supabase zdolnego
 * odczytać/zapisać tę cookie z poziomu JS.
 */
import { createSupabaseServerClient } from "./server"
import { isSupabaseConfigured } from "./config"

export async function getAccountStatus(): Promise<{ email: string | null }> {
  if (!isSupabaseConfigured()) return { email: null }

  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return { email: data.user?.email ?? null }
}
