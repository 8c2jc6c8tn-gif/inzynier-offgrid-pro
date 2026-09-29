// Shared helpers for the service worker e2e tests (D59; standard 10.8–10.9, pattern in
// docs/przyklady/pwa/README.md). Real production builds (`next build` + `next start`), no dev
// server. Run: `pnpm test:e2e` (node --test, library `playwright`, not `@playwright/test`).
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export const KORZEN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const PORT = Number(process.env.E2E_PORT ?? 3947)
export const ADRES = `http://localhost:${PORT}`
const NEXT = path.join(KORZEN, 'node_modules', '.bin', 'next')

/** `next build` in the repo (or `katalog`); extra env e.g. NEXT_PUBLIC_SW_WYLACZ=1. */
export function zbuduj(env = {}, katalog = KORZEN) {
  const wynik = spawnSync('pnpm', ['build'], { cwd: katalog, env: { ...process.env, ...env }, stdio: 'inherit' })
  if (wynik.status !== 0) throw new Error(`next build failed (${wynik.status})`)
}

/**
 * `next start` in its own process group, so `zatrzymaj` can kill the whole group
 * (process.kill(-pid)). Never `pkill -f "next start"` — it matched and killed the calling shell
 * (exit 144, docs/memory.md 29.09.2026).
 */
export async function uruchomSerwer(katalog = KORZEN) {
  const proces = spawn(NEXT, ['start', '-p', String(PORT)], { cwd: katalog, detached: true, stdio: 'ignore' })
  const koniec = Date.now() + 60_000
  while (Date.now() < koniec) {
    try {
      const odp = await fetch(ADRES + '/manifest.webmanifest')
      if (odp.ok) return proces
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  await zatrzymaj(proces)
  throw new Error('next start did not answer within 60 s')
}

export async function zatrzymaj(proces) {
  if (!proces || proces.exitCode !== null) return
  const wyszedl = new Promise((r) => proces.once('exit', r))
  try {
    process.kill(-proces.pid, 'SIGTERM')
  } catch {
    return
  }
  await wyszedl
}

/**
 * Chromium from the `playwright` package. PW_CHROMIUM_PATH points to an already installed browser
 * when the package version and the local browser build differ (CI: `playwright install chromium`).
 * Polish locale: the app picks its language from navigator.languages (app/layout.tsx).
 */
export async function przegladarka() {
  const browser = await chromium.launch(
    process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  )
  const context = await browser.newContext({ locale: 'pl-PL', serviceWorkers: 'allow' })
  return { browser, context }
}

/**
 * Waits until this page is controlled by an activated worker whose precache is complete. Polled
 * with evaluate: waitForFunction takes the Promise of an async predicate as "truthy" at once.
 */
export async function czekajNaSw(page, timeout = 180_000) {
  const koniec = Date.now() + timeout
  while (Date.now() < koniec) {
    // A reload in progress destroys the evaluation context — treat it as "not yet".
    const gotowy = await page
      .evaluate(async () => {
        const r = await navigator.serviceWorker.getRegistration()
        if (!r || !r.active || r.active.state !== 'activated' || r.installing || r.waiting) return false
        if (!navigator.serviceWorker.controller) return false
        return (await caches.keys()).some((k) => k.startsWith('offgrid-precache-'))
      })
      .catch(() => false)
    if (gotowy) return
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('service worker not ready')
}

/** Precache list exactly as the deployed worker has it (`self.__SW_KONFIG` in /sw.js). */
export async function konfiguracjaSw() {
  const zrodlo = await (await fetch(ADRES + '/sw.js')).text()
  return JSON.parse(zrodlo.slice(zrodlo.indexOf('=') + 1, zrodlo.indexOf(';\n')))
}

/** Names of the app's caches in the browser. */
export async function nazwyCache(page) {
  return page.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('offgrid')))
}
