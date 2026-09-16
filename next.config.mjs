/**
 * Nagłówki bezpieczeństwa — docs/standards/07-bezpieczenstwo.md, 7.3.
 *
 * CSP `script-src` dopuszcza dokładnie jeden inline `<script>` przez hash (nie
 * `'unsafe-inline'`) — `WYGLAD_INIT_SCRIPT` w `app/layout.tsx` (ustawia motyw przed pierwszym
 * malowaniem). Zmiana treści tego skryptu bez przeliczenia hasha po cichu blokuje go w
 * produkcyjnej CSP (błysk domyślnego wyglądu, bez błędu w konsoli widocznego zwykłemu
 * użytkownikowi) — `pnpm check:csp-hash` (scripts/check-csp-hash.mjs, w CI) liczy hash
 * automatycznie z treści skryptu i porównuje z wartością niżej, więc rozjazd jest wykrywany
 * w CI, nie ręcznie (7.3: "hash liczony automatycznie, nigdy ręcznie").
 */
const WYGLAD_INIT_SCRIPT_HASH = "sha256-+/C91khub/JBkArKcNvM0bLh3IjvzPutrWc2hmWbp6o="

const isDev = process.env.NODE_ENV !== "production"

// docs/standards/18-logowanie.md — klient przeglądarkowy Supabase woła bezpośrednio URL projektu
// (auth/REST). Puste, dopóki .env.local nie ma realnych wartości (szkielet, 15.09.2026) — 'self'
// starczy do reszty apki, nic w kodzie nie łamie CSP samym faktem braku tego wpisu.
const supabaseConnectSrc = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

// Next.js dev mode (React Refresh/HMR) wstrzykuje własne inline skrypty i wymaga 'unsafe-eval' —
// osłabienie CSP tylko w dev, produkcja zostaje ściśle ograniczona do 'self' + hash powyżej.
const scriptSrc = isDev ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self' '${WYGLAD_INIT_SCRIPT_HASH}'`

const csp = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'${supabaseConnectSrc ? ` ${supabaseConnectSrc}` : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
