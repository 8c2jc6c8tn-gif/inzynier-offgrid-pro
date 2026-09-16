/**
 * docs/standards/18-logowanie.md (18.4, Supabase Auth jako wymóg) i 06-api-i-siec.md (6.3,
 * łagodna degradacja gdy klucza brak). Szkielet logowania (15.09.2026, patrz docs/memory.md) —
 * projekt jeszcze nie ma prawdziwego projektu Supabase, więc reszta kodu musi umieć bezpiecznie
 * wykryć ten stan i NIE wymuszać logowania, dopóki `.env.local` nie ma realnych wartości.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes("TWOJ-PROJEKT"))
}

export function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
}

export function supabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
}

/**
 * 18.8 (usuwanie konta) wymaga Admin API (`auth.admin.deleteUser`), które działa wyłącznie z
 * kluczem service role — osobnym od anon key, NIGDY `NEXT_PUBLIC_*` (pełny dostęp administracyjny,
 * omija RLS). Brak tego klucza nie blokuje reszty logowania — tylko funkcję usuwania konta,
 * bezpiecznie zdegradowaną (patrz `lib/adapters/supabase/delete-account.ts`).
 */
export function isServiceRoleConfigured(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(key && !key.includes("twoj-service-role-key"))
}

export function supabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
}

/**
 * 18.5 (sesja/tokeny) — `@supabase/ssr` domyślnie ustawia `httpOnly: false` na cookie sesji
 * (`DEFAULT_COOKIE_OPTIONS` w bibliotece — sprawdzone wprost w `node_modules`, nie zgadywane):
 * pakiet zakłada, że `createBrowserClient` też będzie zapisywał tę samą cookie z poziomu JS, co
 * z definicji wymaga `httpOnly: false` (JS w przeglądarce nie może ustawić `HttpOnly` — to
 * ograniczenie platformy, nie wybór biblioteki). Ten projekt świadomie NIE używa
 * `createBrowserClient` nigdzie (usunięty — patrz `docs/memory.md`), więc może bezpiecznie
 * nadpisać domyślne opcje na w pełni zgodne z 18.5 bez utraty żadnej funkcji.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  }
}
