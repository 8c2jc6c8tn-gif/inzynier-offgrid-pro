/**
 * docs/standards/18-logowanie.md, 18.1 — konto wymagane od pierwszego uruchomienia. Egzekwowane
 * tutaj, nie w layoutach: middleware biegnie przed renderowaniem, więc żadna trasa nie "mignie"
 * niezalogowanemu userowi przed przekierowaniem.
 *
 * Szkielet (15.09.2026, patrz docs/memory.md) — projekt jeszcze nie ma prawdziwego projektu
 * Supabase. Dopóki `.env.local` nie ma realnych wartości, ta bramka jest wyłączona i apka
 * działa dokładnie jak dotąd (bez wymogu konta) — jawnie, nie po cichu, żeby nikt nie pomyślał,
 * że logowanie już działa, tylko dlatego że middleware istnieje.
 */
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/adapters/supabase/config"

const PUBLIC_PATH_PREFIXES = ["/auth/"]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options)
      },
    },
  })

  // getUser() (nie getSession()) — weryfikuje token bezpośrednio z serwerem Supabase Auth,
  // nie tylko odczytuje niezweryfikowaną zawartość cookie.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
