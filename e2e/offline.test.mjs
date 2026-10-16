// Offline e2e on a production build (D59, plan 1.6.2; standard 10.8): after the first visit every
// precached screen opens with the server DOWN — not only `context.setOffline(true)`, which does not
// cover fetch() made by the service worker itself (docs/memory.md, 29.09.2026). Without a killed
// server an unvisited page would "work offline" because the worker fetched it from the network.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import {
  ADRES,
  czekajNaSw,
  konfiguracjaSw,
  przegladarka,
  uruchomSerwer,
  zatrzymaj,
  zbuduj,
} from './pomocnicze.mjs'

let serwer
let browser
let context
let page
let wpisy

before(async () => {
  if (process.env.E2E_BEZ_BUILDU !== '1') zbuduj()
  serwer = await uruchomSerwer()
  ;({ browser, context } = await przegladarka())
  page = await context.newPage()
  await page.goto(ADRES + '/')
  await czekajNaSw(page)
  wpisy = (await konfiguracjaSw()).wpisy
  await zatrzymaj(serwer)
  await context.setOffline(true)
})

after(async () => {
  await browser?.close()
  await zatrzymaj(serwer)
})

test('guard: a request the worker does not handle really fails (the network is gone)', async () => {
  const doszlo = await page.evaluate(() =>
    fetch('/api/pvgis/tmy?lat=50&lon=20', { cache: 'no-store' }).then(
      () => true,
      () => false,
    ),
  )
  assert.equal(doszlo, false)
})

test('every precached page opens offline from the service worker, without an earlier visit', async () => {
  const strony = wpisy.filter((w) => w.strona && w.url !== '/_not-found').map((w) => w.url)
  assert.ok(strony.length > 200, `only ${strony.length} pages in the precache`)
  const bledy = []
  // Uncaught errors too (30.09.2026): status 200 + <h1> did not catch a server action that threw offline on
  // every screen (components/asystent-ai.tsx).
  let url = ''
  const naBlad = (e) => bledy.push(`${url}: pageerror ${String(e).slice(0, 200)}`)
  page.on('pageerror', naBlad)
  for (url of strony) {
    const odp = await page.goto(ADRES + url, { waitUntil: 'domcontentloaded' })
    const tytul = (await page.locator('h1').first().textContent({ timeout: 10_000 }).catch(() => '')) ?? ''
    if (!odp?.fromServiceWorker() || odp.status() !== 200 || tytul.trim() === '') {
      bledy.push(`${url}: sw=${odp?.fromServiceWorker()} status=${odp?.status()} h1="${tytul.trim()}"`)
    }
  }
  page.off('pageerror', naBlad)
  assert.deepEqual(bledy, [])
})

test('unknown URL offline shows our not-found page', async () => {
  const odp = await page.goto(ADRES + '/tego-ekranu-nie-ma')
  assert.equal(odp?.fromServiceWorker(), true)
  await page.getByText('Nie ma takiego ekranu').waitFor({ timeout: 10_000 })
})

test('dashboard images and the manifest work offline', async () => {
  await page.goto(ADRES + '/', { waitUntil: 'load' })
  const obrazy = await page.evaluate(() =>
    [...document.images].map((img) => ({ src: img.currentSrc, ok: img.complete && img.naturalWidth > 0 })),
  )
  assert.ok(obrazy.length > 0, 'no images on the dashboard')
  assert.deepEqual(obrazy.filter((o) => !o.ok), [])
  const status = await page.evaluate(() => fetch('/manifest.webmanifest').then((r) => r.status))
  assert.equal(status, 200)
})

// SW stage 2 (30.09.2026): the GPS walk map must draw offline (D22, 5.3) — MapLibre parses the
// geometry in its worker (public/maplibre/), so without it only the point markers appear. The 3D view
// (three.js) is online only by the owner's decision; offline the screen shows a notice instead.
test('map worker is served offline; 3D view falls back to a notice, not an error screen', async () => {
  const worker = await page.evaluate(() => fetch('/maplibre/maplibre-gl-worker.mjs').then((r) => r.status, () => 0))
  assert.equal(worker, 200)
  const bledy = []
  const naBlad = (e) => bledy.push(String(e))
  page.on('pageerror', naBlad)
  await page.evaluate(
    () =>
      new Promise((res, rej) => {
        const P = (a, b) => ({ szerokosc: 52.2 + a * 1e-4, dlugosc: 21 + b * 1e-4 })
        const model = {
          tryb: 'offline',
          dzialka: [P(0, 0), P(0, 4), P(4, 4), P(4, 0)],
          opisDzialki: null,
          budynek: [P(1, 1), P(1, 2), P(2, 2), P(2, 1)],
          idBudynku: null,
          polacie: [],
          przeszkody: [],
          kalibracja: { zbior: 'budynek', punktA: '', punktB: '', znanaDlugoscM: '' },
        }
        const r = indexedDB.open('offgrid-storage')
        // No version: the app owns the schema (it is at 2), so open whatever exists; create the store only in a fresh database.
        r.onupgradeneeded = () => r.result.createObjectStore('kv')
        r.onsuccess = () => {
          const tx = r.result.transaction('kv', 'readwrite')
          tx.objectStore('kv').put(model, 'offgrid.draft.skaner-dzialki')
          tx.oncomplete = () => (r.result.close(), res())
        }
        r.onerror = () => rej(r.error)
      }),
  )
  await page.goto(ADRES + '/kalkulatory/analiza-zacienienia')
  await page.getByText('Widok 3D wymaga internetu').waitFor({ timeout: 15_000 })
  page.off('pageerror', naBlad)
  assert.deepEqual(bledy, [])
})

test('precache size (reported, standard 5.8 — stage 2 budget)', async () => {
  const bajty = await page.evaluate(async () => {
    const nazwa = (await caches.keys()).find((k) => k.startsWith('offgrid-precache-'))
    const cache = await caches.open(nazwa)
    let suma = 0
    for (const zadanie of await cache.keys()) suma += (await (await cache.match(zadanie)).blob()).size
    return suma
  })
  console.log(`precache: ${wpisy.length} entries, ${(bajty / 1024 / 1024).toFixed(1)} MB`)
  assert.ok(bajty > 0)
})
