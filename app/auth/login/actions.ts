"use server"

/**
 * Server Actions logowania — docs/standards/18-logowanie.md, 18.2 (trzej dostawcy: magic link
 * e-mail, Google, Apple). Cała logika sesji żyje w @supabase/ssr, nic tutaj nie dotyka cookie
 * ręcznie (18.5).
 */
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/adapters/supabase/server"
import { safeNextPath } from "@/lib/adapters/supabase/safe-redirect"

function callbackUrl(origin: string, next: string): string {
  return `${origin}/auth/callback?next=${encodeURIComponent(safeNextPath(next))}`
}

export async function signInWithMagicLink(origin: string, next: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { error: "Podaj adres e-mail." }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl(origin, next) },
  })

  if (error) return { error: error.message }
  return { sent: true }
}

export async function signInWithGoogle(origin: string, next: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(origin, next) },
  })

  if (error || !data.url) return { error: error?.message ?? "Logowanie Google nieskonfigurowane." }
  redirect(data.url)
}

export async function signInWithApple(origin: string, next: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: callbackUrl(origin, next) },
  })

  if (error || !data.url) return { error: error?.message ?? "Logowanie Apple nieskonfigurowane." }
  redirect(data.url)
}
