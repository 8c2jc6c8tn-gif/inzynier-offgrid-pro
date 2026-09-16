import "server-only"

/**
 * Klient administracyjny (klucz service role) — WYŁĄCZNIE do operacji Admin API, które omijają
 * RLS (dziś jedyna: usuwanie konta, 18.8). Nigdy do zwykłych zapytań danych usera — te idą przez
 * `createSupabaseServerClient()`, który respektuje RLS. `import "server-only"` (pakiet Next.js)
 * powoduje błąd builda, gdyby ten plik trafił przypadkiem do bundla klienckiego — klucz service
 * role nigdy nie może dotrzeć do przeglądarki.
 */
import { createClient } from "@supabase/supabase-js"
import { supabaseServiceRoleKey, supabaseUrl } from "./config"

export function createSupabaseAdminClient() {
  return createClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
