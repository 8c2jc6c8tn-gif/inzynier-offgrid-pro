// Pure precache-list builder for the service worker (D109, P1 of
// docs/silnik/pwa-plan-v1_0.md). No fs/Node APIs — the build-time reader
// (lib/pwa/precache-build.ts) collects the inputs, this module decides what
// goes into the precache and with which revision, so the rules are unit-tested.

/** One precached URL. `rev` changes whenever the content may have changed. */
export interface WpisPrecache {
  url: string
  rev: string
  /** HTML page served for navigations (cache-first, D-PWA-2 = A). */
  strona?: true
}

/** Revision for URLs whose content is already addressed by a hash in the URL. */
export const REV_NIEZMIENNY = 'i'

/** Path of the precached "not found" page, served for unknown URLs offline. */
export const STRONA_NIE_ZNALEZIONO = '/_not-found'

// App-router entries that are not navigable pages (framework internals).
const POMIJANE_STRONY = new Set(['/_global-error'])

export interface WejsciePrecache {
  buildId: string
  /** Paths relative to `.next/static`, `/` separated. */
  plikiStatyczne: string[]
  /** `.next/app-path-routes-manifest.json`: entry → route path. */
  trasy: Record<string, string>
  /** Files in `public/` (relative, `/` separated) with a content hash each. */
  plikiPubliczne: { sciezka: string; hash: string }[]
  /** Pre-paint dictionary URLs exactly as requested by the HTML (with `?v=`). */
  slownikiPrepaint: string[]
}

/** Static route handlers precached together with the pages (same build). */
const TRASY_STATYCZNE_Z_BUILDU = ['/manifest.webmanifest', '/icon.svg', '/apple-icon.png']

/**
 * Builds the precache list. Throws on an input that suggests the `.next`
 * layout changed (no pages, no JS) — a loud build failure instead of a
 * service worker that silently caches nothing.
 */
export function zbudujWpisyPrecache(wejscie: WejsciePrecache): WpisPrecache[] {
  const strony = Object.entries(wejscie.trasy)
    .filter(([wpis]) => wpis.endsWith('/page'))
    .map(([, trasa]) => trasa)
    .filter((trasa) => !POMIJANE_STRONY.has(trasa) && !trasa.includes('['))
    .sort()

  if (strony.length === 0) throw new Error('precache: no pages found in app-path-routes-manifest.json')
  if (!strony.includes(STRONA_NIE_ZNALEZIONO)) throw new Error('precache: missing /_not-found page')
  if (!wejscie.plikiStatyczne.some((p) => p.endsWith('.js'))) {
    throw new Error('precache: no JS files found in .next/static')
  }

  const wpisy: WpisPrecache[] = [
    ...strony.map((url) => ({ url, rev: wejscie.buildId, strona: true as const })),
    ...wejscie.plikiStatyczne.slice().sort().map((p) => ({ url: `/_next/static/${p}`, rev: REV_NIEZMIENNY })),
    ...wejscie.plikiPubliczne
      .slice()
      .sort((a, b) => a.sciezka.localeCompare(b.sciezka))
      .map((p) => ({ url: `/${p.sciezka}`, rev: p.hash })),
    ...TRASY_STATYCZNE_Z_BUILDU.map((url) => ({ url, rev: wejscie.buildId })),
    ...wejscie.slownikiPrepaint.map((url) => ({ url, rev: REV_NIEZMIENNY })),
  ]

  const duplikat = wpisy.find((w, i) => wpisy.findIndex((x) => x.url === w.url) !== i)
  if (duplikat) throw new Error(`precache: duplicate URL ${duplikat.url}`)
  return wpisy
}
