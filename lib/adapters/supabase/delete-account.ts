"use server"

/**
 * Usuwanie konta — docs/standards/18-logowanie.md, 18.8: prawdziwy DELETE (nie tombstone),
 * `ON DELETE CASCADE` na `public.profiles` (supabase/migrations/0001_profiles.sql) usuwa profil
 * automatycznie razem z wierszem `auth.users`. Wymaga Admin API (klucz service role) — bez niego
 * bezpiecznie zdegradowane (komunikat, nie awaria), tak samo jak reszta szkieletu logowania bez
 * realnych kluczy Supabase.
 *
 * 18.8 też zastrzega: konto-administrator grupy z innymi członkami nie może się usunąć, dopóki nie
 * przekaże roli dalej — nie dotyczy dziś, projekt nie ma jeszcze modelu grupy (18.7, świadomie
 * nie zbudowany, patrz docs/memory.md).
 */
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "./server"
import { createSupabaseAdminClient } from "./admin"
import { isServiceRoleConfigured } from "./config"

export async function deleteAccount(): Promise<{ error?: string; errorKey?: string } | void> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { errorKey: "UI-BLAD-KONTO-NIEZALOGOWANY" }

  if (!isServiceRoleConfigured()) {
    return { errorKey: "UI-BLAD-KONTO-USUWANIE-NIESKONFIGUROWANE" }
  }

  const admin = createSupabaseAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return { error: error.message }

  await supabase.auth.signOut()
  redirect("/auth/login")
}
