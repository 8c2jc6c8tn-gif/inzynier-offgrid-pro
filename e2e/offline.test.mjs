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
  for (const url of strony) {
    const odp = await page.goto(ADRES + url, { waitUntil: 'domcontentloaded' })
    const tytul = (await page.locator('h1').first().textContent({ timeout: 10_000 }).catch(() => '')) ?? ''
    if (!odp?.fromServiceWorker() || odp.status() !== 200 || tytul.trim() === '') {
      bledy.push(`${url}: sw=${odp?.fromServiceWorker()} status=${odp?.status()} h1="${tytul.trim()}"`)
    }
  }
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
