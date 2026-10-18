// Build-time reader for the service worker precache (D59, SW variant C stage 1 —
// docs/plan-migracji-sw-wariant-c.md, section 1.1.2). The standard pattern
// (docs/przyklady/pwa/README.md) describes this file but does not ship it.
// Runs only while `next build` prerenders app/sw.js/route.ts (force-static):
// at that moment `.next/BUILD_ID`, `.next/app-path-routes-manifest.json` and
// the complete `.next/static` already exist (checked on Next 16.3 + Turbopack,
// 29.09.2026). All decisions about what goes in live in the pure
// lib/pwa/precache.ts; this module only collects the inputs.
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { KAFLE } from '@/lib/pulpit/registry'
import { zbudujWpisyPrecache, type WpisPrecache } from '@/lib/pwa/precache'

/**
 * Paths left out of the precache (relative to `.next/static` or `public/`,
 * `/` separated). Each exclusion = that file does not work offline.
 */
export function czyWykluczonyStatyczny(sciezka: string): boolean {
  // MapLibre's own copies of its worker (incl. `-dev` builds, ~3.7 MB), emitted
  // by the bundler from the library's `new URL(..., import.meta.url)`. Never
  // loaded: the map uses the copy in public/maplibre/ (setWorkerUrl in
  // components/lokalizacja/mapa-dzialki.tsx), which IS precached — the map
  // works offline for the GPS walk (D22, 5.3; stage 2, 30.09.2026).
  return /^media\/maplibre-gl/.test(sciezka)
}

/**
 * Chunks left out by content, not by name (the hash changes every build).
 * three.js (3D view on the shading screen, components/lokalizacja/widok-3d.tsx,
 * ~0.9 MB): online only — owner's decision 30.09.2026 (SW stage 2). three.js
 * always defines `__THREE__` in its core; the app code never mentions it.
 */
export function czyChunkTylkoOnline(sciezka: string, tresc: string): boolean {
  return sciezka.endsWith('.js') && tresc.includes('__THREE__')
}

function plikiRekurencyjnie(katalog: string, prefiks = ''): string[] {
  if (!fs.existsSync(katalog)) return []
  return fs.readdirSync(katalog, { withFileTypes: true }).flatMap((wpis) => {
    const wzgledna = prefiks ? `${prefiks}/${wpis.name}` : wpis.name
    if (wpis.isDirectory()) return plikiRekurencyjnie(path.join(katalog, wpis.name), wzgledna)
    return wpis.isFile() ? [wzgledna] : []
  })
}

export function wczytajWpisyPrecache(korzen: string = process.cwd()): WpisPrecache[] {
  const next = path.join(korzen, '.next')
  const publiczny = path.join(korzen, 'public')

  const buildId = fs.readFileSync(path.join(next, 'BUILD_ID'), 'utf8').trim()
  const trasy = JSON.parse(fs.readFileSync(path.join(next, 'app-path-routes-manifest.json'), 'utf8')) as Record<
    string,
    string
  >
  const plikiStatyczne = plikiRekurencyjnie(path.join(next, 'static')).filter(
    (p) =>
      !czyWykluczonyStatyczny(p) &&
      !(p.endsWith('.js') && czyChunkTylkoOnline(p, fs.readFileSync(path.join(next, 'static', p), 'utf8'))),
  )
  const plikiPubliczne = plikiRekurencyjnie(publiczny).map((sciezka) => ({
      sciezka,
      hash: createHash('sha256')
        .update(fs.readFileSync(path.join(publiczny, sciezka)))
        .digest('hex')
        .slice(0, 12),
    }))
  // Same list as generateStaticParams in app/moduly/[id]/page.tsx.
  const trasyDynamiczne = KAFLE.map((k) => `/moduly/${k.id}`)

  return zbudujWpisyPrecache({ buildId, trasy, plikiStatyczne, plikiPubliczne, trasyDynamiczne })
}

export function wczytajRdzenSw(korzen: string = process.cwd()): string {
  return fs.readFileSync(path.join(korzen, 'lib', 'pwa', 'sw-rdzen.js'), 'utf8')
}
