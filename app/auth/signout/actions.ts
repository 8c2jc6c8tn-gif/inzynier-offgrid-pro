"use server"

/**
 * Server Action, nie Route Handler — docs/standards/18-logowanie.md, 18.5 (obrona w głąb przeciw
 * CSRF). Next.js weryfikuje nagłówek Origin/Host przy każdym wywołaniu Server Action, czego zwykły
 * POST na Route Handler (poprzednia wersja tego pliku) nie miał wbudowanego.
 */
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/adapters/supabase/server"

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
