/**
 * Nagłówki bezpieczeństwa — docs/standards/07-bezpieczenstwo.md, 7.3.
 *
 * Content-Security-Policy NIE jest tu ustawiana — statyczna funkcja `headers()` nie ma dostępu
 * do per-request nonce'u, a hash-based CSP dla inline scriptów jest architektonicznie
 * niekompatybilny z Next.js App Router (RSC streaming generuje własne inline-skrypty z treścią
 * inną per żądanie — żaden statyczny hash ich nie obejmie, potwierdzony błąd produkcyjny
 * 16.09.2026, patrz docs/memory.md). CSP z nonce-per-request jest ustawiana w `middleware.ts`.
 */
const securityHeaders = [
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
