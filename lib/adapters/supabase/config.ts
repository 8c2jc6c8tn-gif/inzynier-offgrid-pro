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
