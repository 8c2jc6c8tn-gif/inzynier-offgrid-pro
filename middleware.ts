/**
 * docs/standards/18-logowanie.md, 18.1 — konto wymagane od pierwszego uruchomienia. Egzekwowane
 * tutaj, nie w layoutach: middleware biegnie przed renderowaniem, więc żadna trasa nie "mignie"
 * niezalogowanemu userowi przed przekierowaniem.
 *
 * Szkielet (15.09.2026, patrz docs/memory.md) — projekt jeszcze nie ma prawdziwego projektu
 * Supabase. Dopóki `.env.local` nie ma realnych wartości, ta bramka jest wyłączona i apka
 * działa dokładnie jak dotąd (bez wymogu konta) — jawnie, nie po cichu, żeby nikt nie pomyślał,
 * że logowanie już działa, tylko dlatego że middleware istnieje.
 *
 * Content-Security-Policy z nonce-per-request — docs/standards/07-bezpieczenstwo.md, 7.3
 * (korekta 16.09.2026: hash-based CSP jest architektonicznie niekompatybilny z Next.js App
 * Router — RSC streaming generuje własne inline-skrypty z treścią inną per żądanie, żaden
 * statyczny hash ich nie obejmie). Nonce generowany tutaj (jedyne miejsce z dostępem do
 * per-request kontekstu), przekazywany do Server Componentów przez nagłówek `x-nonce`
 * (odczytywany w `app/layout.tsx` przez `headers()`), i do samej przeglądarki przez nagłówek
 * `Content-Security-Policy` na odpowiedzi. Next.js automatycznie dokłada ten nonce do
 * generowanych przez siebie inline-skryptów (w tym RSC streaming), jeśli go wykryje w nagłówku
 * odpowiedzi — własne inline-skrypty projektu (`WYGLAD_INIT_SCRIPT`) dostają go jawnie przez
 * atrybut `nonce` w JSX.
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

const IS_DEV = process.env.NODE_ENV !== "production"

// docs/standards/18-logowanie.md — klient przeglądarkowy Supabase woła bezpośrednio URL projektu
// (auth/REST). Puste, dopóki .env.local nie ma realnych wartości (szkielet, 15.09.2026) — 'self'
// starczy do reszty apki, nic w kodzie nie łamie CSP samym faktem braku tego wpisu.
const SUPABASE_CONNECT_SRC = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

function buildCsp(nonce: string): string {
  // Next.js dev mode (React Refresh/HMR) wstrzykuje własne inline skrypty i wymaga
  // 'unsafe-eval' — osłabienie CSP tylko w dev, produkcja zostaje ściśle ograniczona do
  // 'self' + nonce.
  const scriptSrc = IS_DEV ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self' 'nonce-${nonce}'`
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self'${SUPABASE_CONNECT_SRC ? ` ${SUPABASE_CONNECT_SRC}` : ""}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ")
}

// Dokłada nonce (request header, dla Server Componentów przez headers()) i CSP (response
// header, dla przeglądarki) do już zbudowanej odpowiedzi — wywoływane na KAŻDEJ ścieżce
// zwrotu middleware, żeby żadna odpowiedź nie ominęła CSP.
function zastosujCsp(request: NextRequest, response: NextResponse, nonce: string): NextResponse {
  response.headers.set("x-nonce", nonce)
  response.headers.set("Content-Security-Policy", buildCsp(nonce))
  return response
}

export async function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  if (!isSupabaseConfigured()) {
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    ustawJezykJesliBrak(request, response)
    return zastosujCsp(request, response, nonce)
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookieOptions: sessionCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request: { headers: requestHeaders } })
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
    return zastosujCsp(request, redirectResponse, nonce)
  }

  ustawJezykJesliBrak(request, response)
  return zastosujCsp(request, response, nonce)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
