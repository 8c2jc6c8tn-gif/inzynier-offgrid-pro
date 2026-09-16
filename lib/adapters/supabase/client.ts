/**
 * Klient Supabase dla komponentów klienckich ("use client"). Sesja/tokeny w HttpOnly cookie
 * (docs/standards/18-logowanie.md, 18.5) — zarządzane przez @supabase/ssr, nigdy ręcznie.
 */
"use client"

import { createBrowserClient } from "@supabase/ssr"
import { supabaseAnonKey, supabaseUrl } from "./config"

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey())
}
