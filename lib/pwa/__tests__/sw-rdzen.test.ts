// @vitest-environment node
// lib/pwa/sw-rdzen.js runs in a node:vm context with stand-ins for the service worker globals
// (self, caches, fetch) — no browser needed (standard 10.8, docs/przyklady/pwa/README.md).
import { readFileSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'
import type { WpisPrecache } from '../precache'

const ZRODLO = readFileSync(path.join(__dirname, '..', 'sw-rdzen.js'), 'utf8')
const ORIGIN = 'https://app.test'

type Obsluga = (zdarzenie: Record<string, unknown>) => void

function odpowiedz(tresc: string, status = 200, przekierowanaNa?: string): Response {
  const odp = new Response(tresc, { status })
  if (przekierowanaNa) {
    Object.defineProperty(odp, 'redirected', { value: true })
    Object.defineProperty(odp, 'url', { value: ORIGIN + przekierowanaNa })
  }
  return odp
}

function srodowisko(opcje: {
  wersja: string
  wpisy: WpisPrecache[]
  siec?: (url: URL) => Response | Promise<Response>
  cache?: Map<string, Map<string, Response>>
}) {
  const magazyn = opcje.cache ?? new Map<string, Map<string, Response>>()
  const obslugi: Record<string, Obsluga> = {}
  const pobrane: string[] = []
  const stan = { skipWaiting: 0, claim: 0 }
  const siec =
    opcje.siec ??
    ((url: URL) => odpowiedz(`body ${url.pathname}`))

  const caches = {
    open: async (nazwa: string) => {
      if (!magazyn.has(nazwa)) magazyn.set(nazwa, new Map())
      const c = magazyn.get(nazwa)!
      return {
        match: async (k: string) => c.get(k)?.clone(),
        put: async (k: string, odp: Response) => {
          c.set(k, odp)
        },
      }
    },
    keys: async () => [...magazyn.keys()],
    delete: async (nazwa: string) => magazyn.delete(nazwa),
  }

  const self = {
    __SW_KONFIG: { wersja: opcje.wersja, wpisy: opcje.wpisy },
    location: { origin: ORIGIN },
    addEventListener: (typ: string, fn: Obsluga) => {
      obslugi[typ] = fn
    },
    clients: { claim: async () => void stan.claim++ },
    skipWaiting: () => void stan.skipWaiting++,
  }

  const fetch = async (zadanie: Request | { url: string }) => {
    const url = new URL(zadanie.url)
    pobrane.push(url.pathname)
    return siec(url)
  }

  vm.runInContext(ZRODLO, vm.createContext({ self, caches, fetch, URL, Request, Response, Map, Promise }))

  const czekaj = async (typ: string, dane: Record<string, unknown> = {}) => {
    let obietnica: Promise<unknown> = Promise.resolve()
    obslugi[typ]!({ ...dane, waitUntil: (p: Promise<unknown>) => (obietnica = p) })
    return obietnica
  }

  const pobierz = (sciezka: string, init: { mode?: string; method?: string; naglowki?: Record<string, string> } = {}) => {
    let odpowiedzSw: Promise<Response> | undefined
    const url = sciezka.startsWith('http') ? sciezka : ORIGIN + sciezka
    obslugi.fetch!({
      request: {
        url,
        method: init.method ?? 'GET',
        mode: init.mode ?? 'cors',
        headers: new Headers(init.naglowki ?? {}),
      },
      respondWith: (p: Promise<Response>) => (odpowiedzSw = p),
    })
    return odpowiedzSw
  }

  return { magazyn, pobrane, stan, czekaj, pobierz, obslugi }
}

const WPISY: WpisPrecache[] = [
  { url: '/', rev: 'B1', strona: true },
  { url: '/_not-found', rev: 'B1', strona: true },
  { url: '/kalkulatory/x', rev: 'B1', strona: true },
  { url: '/_next/static/chunks/a.js', rev: 'i' },
  { url: '/icon.svg', rev: 'h1' },
]

const klucz = (url: string, rev: string) => `${ORIGIN}${url}?__sw_rev=${rev}`

describe('sw-rdzen.js — install', () => {
  it('stores every entry in offgrid-precache-<version>, keyed with __sw_rev', async () => {
    const s = srodowisko({ wersja: 'v1', wpisy: WPISY })
    await s.czekaj('install')
    const cache = s.magazyn.get('offgrid-precache-v1')!
    expect([...cache.keys()].sort()).toEqual(WPISY.map((w) => klucz(w.url, w.rev)).sort())
  })

  it('reuses an unchanged entry from the previous version without a download', async () => {
    const stary = new Map([[klucz('/_next/static/chunks/a.js', 'i'), odpowiedz('old chunk')]])
    const s = srodowisko({ wersja: 'v2', wpisy: WPISY, cache: new Map([['offgrid-precache-v1', stary]]) })
    await s.czekaj('install')
    expect(s.pobrane).not.toContain('/_next/static/chunks/a.js')
    const odp = await s.magazyn.get('offgrid-precache-v2')!.get(klucz('/_next/static/chunks/a.js', 'i'))!.text()
    expect(odp).toBe('old chunk')
  })

  it('HTTP 500 for any entry fails the install; 404 for /_not-found is accepted', async () => {
    const blad = srodowisko({
      wersja: 'v1',
      wpisy: WPISY,
      siec: (url) => odpowiedz('x', url.pathname === '/icon.svg' ? 500 : 200),
    })
    await expect(blad.czekaj('install')).rejects.toThrow(/icon\.svg → HTTP 500/)
    const ok = srodowisko({
      wersja: 'v1',
      wpisy: WPISY,
      siec: (url) => odpowiedz('x', url.pathname === '/_not-found' ? 404 : 200),
    })
    await expect(ok.czekaj('install')).resolves.toBeDefined()
  })

  it('a redirect to the login page fails the install (logged-out browser with the login gate on)', async () => {
    const s = srodowisko({
      wersja: 'v1',
      wpisy: WPISY,
      siec: (url) => (url.pathname === '/kalkulatory/x' ? odpowiedz('login', 200, '/auth/login?next=/kalkulatory/x') : odpowiedz('x')),
    })
    await expect(s.czekaj('install')).rejects.toThrow(/redirected to login/)
  })
})

describe('sw-rdzen.js — activate', () => {
  it('deletes older precache versions and the legacy offgrid-v1 cache, keeps other caches, claims clients', async () => {
    const magazyn = new Map<string, Map<string, Response>>([
      ['offgrid-precache-v0', new Map()],
      ['offgrid-v1', new Map()],
      ['cudzy-cache', new Map()],
    ])
    const s = srodowisko({ wersja: 'v1', wpisy: WPISY, cache: magazyn })
    await s.czekaj('install')
    await s.czekaj('activate')
    expect([...s.magazyn.keys()].sort()).toEqual(['cudzy-cache', 'offgrid-precache-v1'])
    expect(s.stan.claim).toBe(1)
  })
})

describe('sw-rdzen.js — fetch', () => {
  async function zainstalowany(siec?: (url: URL) => Response | Promise<Response>) {
    const s = srodowisko({ wersja: 'v1', wpisy: WPISY })
    await s.czekaj('install')
    // From now on the network is whatever the test says (same caches, fresh worker).
    return siec ? srodowisko({ wersja: 'v1', wpisy: WPISY, cache: s.magazyn, siec }) : s
  }

  it('navigation to a precached page is served from the cache without the network, also with a trailing slash', async () => {
    const s = await zainstalowany(() => {
      throw new TypeError('offline')
    })
    expect(await (await s.pobierz('/kalkulatory/x', { mode: 'navigate' }))!.text()).toBe('body /kalkulatory/x')
    expect(await (await s.pobierz('/kalkulatory/x/', { mode: 'navigate' }))!.text()).toBe('body /kalkulatory/x')
    expect(s.pobrane).toEqual([])
  })

  it('unknown page with the network down → the precached /_not-found page', async () => {
    const s = await zainstalowany(() => {
      throw new TypeError('offline')
    })
    expect(await (await s.pobierz('/nie-ma', { mode: 'navigate' }))!.text()).toBe('body /_not-found')
  })

  it('precached asset is cache-first', async () => {
    const s = await zainstalowany(() => {
      throw new TypeError('offline')
    })
    expect(await (await s.pobierz('/_next/static/chunks/a.js'))!.text()).toBe('body /_next/static/chunks/a.js')
  })

  it('does not handle POST, other origins, /api/**, /auth/**, RSC requests', async () => {
    const s = await zainstalowany()
    expect(s.pobierz('/kalkulatory/x', { mode: 'navigate', method: 'POST' })).toBeUndefined()
    expect(s.pobierz('https://inny.test/', { mode: 'navigate' })).toBeUndefined()
    expect(s.pobierz('/api/pvgis/tmy?lat=50')).toBeUndefined()
    expect(s.pobierz('/auth/login', { mode: 'navigate' })).toBeUndefined()
    expect(s.pobierz('/kalkulatory/x', { naglowki: { rsc: '1' } })).toBeUndefined()
    expect(s.pobierz('/kalkulatory/x?_rsc=abc')).toBeUndefined()
  })
})

describe('sw-rdzen.js — message', () => {
  it('SKIP_WAITING activates the waiting worker; nothing happens on its own', async () => {
    const s = srodowisko({ wersja: 'v1', wpisy: WPISY })
    await s.czekaj('install')
    expect(s.stan.skipWaiting).toBe(0)
    s.obslugi.message!({ data: { typ: 'SKIP_WAITING' } })
    expect(s.stan.skipWaiting).toBe(1)
  })
})
