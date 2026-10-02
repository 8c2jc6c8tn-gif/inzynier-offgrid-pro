/**
 * docs/standards/18-logowanie.md, 18.1 — konto wymagane od pierwszego uruchomienia. Egzekwowane
 * tutaj, nie w layoutach: proxy (dawniej middleware, Next 16) biegnie przed renderowaniem, więc żadna trasa nie "mignie"
 * niezalogowanemu userowi przed przekierowaniem.
 *
 * Szkielet (15.09.2026, patrz docs/memory.md) — projekt jeszcze nie ma prawdziwego projektu
 * Supabase. Dopóki `.env.local` nie ma realnych wartości, ta bramka jest wyłączona i apka
 * działa dokładnie jak dotąd (bez wymogu konta) — jawnie, nie po cichu, żeby nikt nie pomyślał,
 * że logowanie już działa, tylko dlatego że proxy istnieje.
 *
 * Nazwa pliku i funkcji: `proxy` (Next 16 — konwencja `middleware` przestarzała, działanie to samo;
 * proxy zawsze biegnie w runtime Node.js, nie Edge — kod niżej używa tylko API dostępnych w obu).
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

const PUBLIC_PATH_PREFIXES = ["/auth/"]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

const IS_DEV = process.env.NODE_ENV !== "production"

// docs/standards/18-logowanie.md — klient przeglądarkowy Supabase woła bezpośrednio URL projektu
// (auth/REST). Puste, dopóki .env.local nie ma realnych wartości (szkielet, 15.09.2026) — 'self'
// starczy do reszty apki, nic w kodzie nie łamie CSP samym faktem braku tego wpisu.
const SUPABASE_CONNECT_SRC = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

// rejestr-decyzji.md D23 — ULDK (GUGiK) wołany bezpośrednio z przeglądarki (ma CORS `*`), bez
// proxy: jedyny zewnętrzny origin danych dopuszczony tu z nazwy. PVGIS NIE — zakazuje wywołań
// z przeglądarki, idzie przez /api/pvgis/tmy (D22).
const ULDK_CONNECT_SRC = "https://uldk.gugik.gov.pl"

// D22/D23 — podkład mapy Skanera działki: ortofotomapa WMS Geoportalu (GUGiK). MapLibre pobiera
// kafle przez fetch (connect-src) i rysuje je jako obrazy (img-src). Tylko w trybie online.
const GEOPORTAL_SRC = "https://mapy.geoportal.gov.pl"

// Kursy walut (ECB przez Frankfurter) — wołane z przeglądarki, tylko gdy użytkownik wybrał walutę
// inną niż PLN; bufor w localStorage działa offline (lib/waluta/storage.ts).
const KURSY_SRC = "https://api.frankfurter.dev"

function buildCsp(nonce: string): string {
  // Next.js dev mode (React Refresh/HMR) wstrzykuje własne inline skrypty i wymaga
  // 'unsafe-eval' — osłabienie CSP tylko w dev, produkcja zostaje ściśle ograniczona do
  // 'self' + nonce.
  const scriptSrc = IS_DEV ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self' 'nonce-${nonce}'`
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: ${GEOPORTAL_SRC}`,
    `font-src 'self'`,
    `connect-src 'self' ${ULDK_CONNECT_SRC} ${GEOPORTAL_SRC} ${KURSY_SRC}${SUPABASE_CONNECT_SRC ? ` ${SUPABASE_CONNECT_SRC}` : ""}`,
    // MapLibre GL uruchamia swój worker z blob: URL; Web Worker obliczeń Modułu 1 — z 'self'.
    `worker-src 'self' blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ")
}

// Dokłada nonce (request header, dla Server Componentów przez headers()) i CSP (response
// header, dla przeglądarki) do już zbudowanej odpowiedzi — wywoływane na KAŻDEJ ścieżce
// zwrotu proxy, żeby żadna odpowiedź nie ominęła CSP.
function zastosujCsp(request: NextRequest, response: NextResponse, nonce: string): NextResponse {
  response.headers.set("x-nonce", nonce)
  response.headers.set("Content-Security-Policy", buildCsp(nonce))
  return response
}

export async function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  if (!isSupabaseConfigured()) {
    const response = NextResponse.next({ request: { headers: requestHeaders } })
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
    return zastosujCsp(request, redirectResponse, nonce)
  }

  return zastosujCsp(request, response, nonce)
}

// PWA files (`/sw.js`, `/manifest.webmanifest`) bypass the proxy: with
// Supabase configured, a logged-out browser would otherwise get a redirect to /auth/login instead
// of the worker script, so registration and every SW update check would fail
// (docs/audyt-sw-vs-wzorzec-pwa.md, item 12). Consequence: the SW script response carries no CSP
// header (the worker only talks to its own origin).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw\\.js$|manifest\\.webmanifest$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
