/**
 * Nagłówki bezpieczeństwa — docs/standards/07-bezpieczenstwo.md, 7.3.
 *
 * Content-Security-Policy NIE jest tu ustawiana — statyczna funkcja `headers()` nie ma dostępu
 * do per-request nonce'u, a hash-based CSP dla inline scriptów jest architektonicznie
 * niekompatybilny z Next.js App Router (RSC streaming generuje własne inline-skrypty z treścią
 * inną per żądanie — żaden statyczny hash ich nie obejmie, potwierdzony błąd produkcyjny
 * 16.09.2026, patrz docs/memory.md). CSP z nonce-per-request jest ustawiana w `proxy.ts`.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // geolocation=(self) — spacer GPS Skanera działki (Moduł 1, Ekran 2) potrzebuje położenia
  // urządzenia; tylko własny origin, żadna osadzona ramka.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
]

import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"

/**
 * Version stamp shown on printouts (offer sheet of the panel comparison), so a result can later be traced to the build that computed it.
 * The build id is the short commit hash: from the host's variable when it gives one, otherwise from git; empty when neither is available.
 */
function oznaczenieKompilacji() {
  const zHosta = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA
  if (zHosta) return zHosta.slice(0, 7)
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()
  } catch {
    return ""
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version,
    NEXT_PUBLIC_BUILD_ID: oznaczenieKompilacji(),
  },
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
      // Service worker (app/sw.js/route.ts): every update check must reach the server — a cached
      // /sw.js would hide a new version. Next.js applies the headers of every matching rule, so
      // the security headers above stay on this response too.
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ]
  },
}

export default nextConfig
