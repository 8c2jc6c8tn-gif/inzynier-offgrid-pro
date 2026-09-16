/**
 * Klient Supabase dla Server Components/Route Handlers/Server Actions. Odczyt/zapis cookie sesji
 * wyłącznie przez @supabase/ssr (docs/standards/18-logowanie.md, 18.5) — nigdy StorageAdapter
 * (5.2 abstrahuje Seed projektu, nie sekrety sesji).
 */
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { sessionCookieOptions, supabaseAnonKey, supabaseUrl } from "./config"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookieOptions: sessionCookieOptions(),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Wywołane z Server Component (nie z Server Action/Route Handler) — zapis cookie
          // jest tam zabroniony przez Next.js. Middleware odświeża sesję na każdym żądaniu,
          // więc to bezpieczne do zignorowania (wzorzec z dokumentacji @supabase/ssr).
        }
      },
    },
  })
}
