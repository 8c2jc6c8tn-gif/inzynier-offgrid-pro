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
  // The map needs the network anyway (D22/D23: Geoportal WMS base layer).
  // Includes the `-dev` builds of MapLibre that end up in the production
  // output (~2.5 MB) — why they are there at all: stage 2.
  return /^media\/maplibre-gl/.test(sciezka)
}

export function czyWykluczonyPubliczny(sciezka: string): boolean {
  // Map worker files — online only, see above.
  if (sciezka.startsWith('maplibre/')) return true
  // Template leftovers, referenced nowhere in app/, components/, lib/ (29.09.2026).
  if (/^placeholder/.test(sciezka)) return true
  return false
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
  const plikiStatyczne = plikiRekurencyjnie(path.join(next, 'static')).filter((p) => !czyWykluczonyStatyczny(p))
  const plikiPubliczne = plikiRekurencyjnie(publiczny)
    .filter((p) => !czyWykluczonyPubliczny(p))
    .map((sciezka) => ({
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
