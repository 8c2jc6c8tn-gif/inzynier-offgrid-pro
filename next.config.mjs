/**
 * Nagłówki bezpieczeństwa — docs/standards/07-bezpieczenstwo.md, 7.3.
 *
 * CSP `script-src` dopuszcza dokładnie jeden inline `<script>` przez hash (nie
 * `'unsafe-inline'`) — `WYGLAD_INIT_SCRIPT` w `app/layout.tsx` (ustawia motyw przed pierwszym
 * malowaniem). Jeśli zmienisz treść tego skryptu, przelicz hash i zaktualizuj go tutaj —
 * inaczej CSP zablokuje skrypt po cichu (błysk domyślnego wyglądu przy każdym ładowaniu),
 * bez błędu w konsoli widocznego zwykłemu użytkownikowi. Przeliczenie:
 * `node -e "console.log('sha256-' + require('crypto').createHash('sha256').update(SKRYPT, 'utf8').digest('base64'))"`
 */
const WYGLAD_INIT_SCRIPT_HASH = "sha256-+/C91khub/JBkArKcNvM0bLh3IjvzPutrWc2hmWbp6o="

const isDev = process.env.NODE_ENV !== "production"

// Next.js dev mode (React Refresh/HMR) wstrzykuje własne inline skrypty i wymaga 'unsafe-eval' —
// osłabienie CSP tylko w dev, produkcja zostaje ściśle ograniczona do 'self' + hash powyżej.
const scriptSrc = isDev ? `'self' 'unsafe-inline' 'unsafe-eval'` : `'self' '${WYGLAD_INIT_SCRIPT_HASH}'`

const csp = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'`,
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
