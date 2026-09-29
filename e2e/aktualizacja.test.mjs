// Update e2e on two real production builds (D59, plan 1.6.3–1.6.4; standard 5.9, 10.8): the random
// BUILD_ID changes every page `rev`, so build 2 is a new worker version without any code change.
// A new version waits and is offered as a toast; "Odśwież" switches with exactly one reload. Then the
// kill-switch build (NEXT_PUBLIC_SW_WYLACZ=1) removes the worker and its caches.
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { ADRES, czekajNaSw, nazwyCache, przegladarka, uruchomSerwer, zatrzymaj, zbuduj } from './pomocnicze.mjs'

let serwer
let browser
let context
let page
const bledyKonsoli = []

before(async () => {
  ;({ browser, context } = await przegladarka())
  page = await context.newPage()
  page.on('console', (m) => {
    // /_vercel/** exists only on Vercel (analytics script) — its 404/MIME errors locally are expected.
    const zVercel = m.location().url.includes('/_vercel/') || m.text().includes('/_vercel/')
    if (m.type() === 'error' && !zVercel) bledyKonsoli.push(m.text())
  })
  page.on('pageerror', (e) => bledyKonsoli.push(String(e)))
})

after(async () => {
  await browser?.close()
  await zatrzymaj(serwer)
})

test('build 1: worker installed, React hydrates without errors (no #412)', async () => {
  if (process.env.E2E_BEZ_BUILDU !== '1') zbuduj()
  serwer = await uruchomSerwer()
  await page.goto(ADRES + '/')
  await czekajNaSw(page)
  assert.equal((await nazwyCache(page)).length, 1)
  assert.deepEqual(bledyKonsoli, [])
})

test('build 2: new version is offered as a toast; the old worker keeps control until "Odśwież"', async () => {
  const [stary] = await nazwyCache(page)
  await zatrzymaj(serwer)
  zbuduj()
  serwer = await uruchomSerwer()
  await page.goto(ADRES + '/')
  await page.getByText('Jest nowa wersja aplikacji').waitFor({ timeout: 180_000 })
  assert.ok((await nazwyCache(page)).includes(stary), 'old precache gone before the switch')

  let przeladowania = 0
  page.on('request', (r) => {
    if (r.isNavigationRequest() && r.frame() === page.mainFrame()) przeladowania++
  })
  const przeladowano = page.waitForEvent('load')
  await page.getByRole('button', { name: 'Odśwież' }).click()
  await przeladowano
  await czekajNaSw(page)
  await page.waitForTimeout(3000)
  assert.equal(przeladowania, 1)
  const cache = await nazwyCache(page)
  assert.equal(cache.length, 1)
  assert.notEqual(cache[0], stary)
})

test('kill-switch build: the worker unregisters and deletes its caches', async () => {
  await zatrzymaj(serwer)
  zbuduj({ NEXT_PUBLIC_SW_WYLACZ: '1' })
  serwer = await uruchomSerwer()
  await page.goto(ADRES + '/')
  const koniec = Date.now() + 60_000
  let stan
  while (Date.now() < koniec) {
    stan = await page.evaluate(async () => ({
      rejestracje: (await navigator.serviceWorker.getRegistrations()).length,
      cache: (await caches.keys()).filter((k) => k.startsWith('offgrid')),
    }))
    if (stan.rejestracje === 0 && stan.cache.length === 0) break
    await page.reload()
    await page.waitForTimeout(1000)
  }
  assert.deepEqual(stan, { rejestracje: 0, cache: [] })
})
