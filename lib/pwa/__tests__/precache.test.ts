// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { REV_NIEZMIENNY, zbudujWpisyPrecache, type WejsciePrecache } from '../precache'
import { czyWykluczonyPubliczny, czyWykluczonyStatyczny } from '../precache-build'

const wejscie = (zmiany: Partial<WejsciePrecache> = {}): WejsciePrecache => ({
  buildId: 'B1',
  plikiStatyczne: ['chunks/a.js', 'chunks/b.css', 'media/font.woff2'],
  trasy: {
    '/_global-error/page': '/_global-error',
    '/_not-found/page': '/_not-found',
    '/api/pvgis/tmy/route': '/api/pvgis/tmy',
    '/auth/callback/route': '/auth/callback',
    '/auth/login/page': '/auth/login',
    '/page': '/',
    '/kalkulatory/x/page': '/kalkulatory/x',
    '/moduly/[id]/page': '/moduly/[id]',
  },
  plikiPubliczne: [{ sciezka: 'maskotki-bob/m.webp', hash: 'h1' }],
  trasyDynamiczne: ['/moduly/1', '/moduly/2'],
  ...zmiany,
})

describe('zbudujWpisyPrecache', () => {
  it('pages: static and expanded dynamic routes; no route handlers, no [id], no /auth/login, no /_global-error', () => {
    const strony = zbudujWpisyPrecache(wejscie())
      .filter((w) => w.strona)
      .map((w) => w.url)
    expect(strony).toEqual(['/', '/_not-found', '/kalkulatory/x', '/moduly/1', '/moduly/2'])
    expect(zbudujWpisyPrecache(wejscie()).every((w) => !w.strona || w.rev === 'B1')).toBe(true)
  })

  it('/_next/static entries are immutable, public/ files carry their content hash, manifest the build id', () => {
    const wpisy = zbudujWpisyPrecache(wejscie())
    expect(wpisy.find((w) => w.url === '/_next/static/chunks/a.js')?.rev).toBe(REV_NIEZMIENNY)
    expect(wpisy.find((w) => w.url === '/maskotki-bob/m.webp')?.rev).toBe('h1')
    expect(wpisy.find((w) => w.url === '/manifest.webmanifest')?.rev).toBe('B1')
  })

  it('throws on a build layout it does not understand instead of caching nothing', () => {
    expect(() => zbudujWpisyPrecache(wejscie({ trasy: {}, trasyDynamiczne: [] }))).toThrow(/no pages/)
    expect(() => zbudujWpisyPrecache(wejscie({ trasy: { '/page': '/' } }))).toThrow(/_not-found/)
    expect(() => zbudujWpisyPrecache(wejscie({ plikiStatyczne: ['chunks/b.css'] }))).toThrow(/no JS/)
    expect(() => zbudujWpisyPrecache(wejscie({ trasyDynamiczne: ['/'] }))).toThrow(/duplicate URL \//)
  })
})

describe('exclusions (lib/pwa/precache-build.ts)', () => {
  it('map files (online only) and template placeholders stay out; everything else goes in', () => {
    expect(czyWykluczonyStatyczny('media/maplibre-gl-dev.abc.js')).toBe(true)
    expect(czyWykluczonyStatyczny('media/font.woff2')).toBe(false)
    expect(czyWykluczonyStatyczny('chunks/a.js')).toBe(false)
    expect(czyWykluczonyPubliczny('maplibre/maplibre-gl-worker.mjs')).toBe(true)
    expect(czyWykluczonyPubliczny('placeholder-logo.svg')).toBe(true)
    expect(czyWykluczonyPubliczny('icon.svg')).toBe(false)
    expect(czyWykluczonyPubliczny('maskotki-bob/modul-03.webp')).toBe(false)
  })
})
