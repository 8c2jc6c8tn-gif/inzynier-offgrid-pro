/**
 * Wymiana kodu (magic link/OAuth) na sesję — docs/standards/18-logowanie.md, 18.2/18.5.
 * `next` walidowany przez `safeNextPath` (18.2, dopisek 15.09.2026: open redirect) — nigdy
 * przekierowanie na surowy, niewalidowany parametr z URL.
 */
import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/adapters/supabase/server"
import { safeNextPath } from "@/lib/adapters/supabase/safe-redirect"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"))

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=logowanie-nie-powiodlo-sie`)
}
