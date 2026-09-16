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
import {
  isSupabaseConfigured,
  sessionCookieOptions,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/adapters/supabase/config"
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE_SECONDS, negocjujJezyk } from "@/lib/i18n/language"

const PUBLIC_PATH_PREFIXES = ["/auth/"]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

// Pierwsza wizyta, zanim cookie `jezyk` w ogóle istnieje — docs/standards/17-i18n.md, 17.4a:
// middleware (serwer) czyta `Accept-Language` i ustawia cookie od razu, żeby pierwsza odpowiedź
// HTML poszła w dopasowanym języku. Nigdy nie nadpisuje już istniejącej cookie — świadomy wybór
// usera w Ustawieniach ma pierwszeństwo nad nagłówkiem przeglądarki na każdej kolejnej wizycie.
function ustawJezykJesliBrak(request: NextRequest, response: NextResponse): void {
  if (request.cookies.has(LANGUAGE_COOKIE)) return
  const jezyk = negocjujJezyk(request.headers.get("accept-language"))
  response.cookies.set(LANGUAGE_COOKIE, jezyk, { path: "/", maxAge: LANGUAGE_COOKIE_MAX_AGE_SECONDS })
}

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const response = NextResponse.next()
    ustawJezykJesliBrak(request, response)
    return response
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookieOptions: sessionCookieOptions(),
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
    const redirectResponse = NextResponse.redirect(redirectUrl)
    ustawJezykJesliBrak(request, redirectResponse)
    return redirectResponse
  }

  ustawJezykJesliBrak(request, response)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
