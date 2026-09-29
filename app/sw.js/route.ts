import { createHash } from 'node:crypto'
import { wczytajRdzenSw, wczytajWpisyPrecache } from '@/lib/pwa/precache-build'

// Service worker script, generated once at build time (D59, SW variant C stage 1 —
// docs/plan-migracji-sw-wariant-c.md, section 1.3; copied from the standard pattern
// docs/przyklady/pwa/sw-route.ts, local change: cache prefixes in SW_USUN). A static route handler instead of a
// post-build script: it is part of Next's own output, so it deploys the same
// way on any host. Served with `Cache-Control: no-cache` (next.config.mjs) and
// registered with `updateViaCache: 'none'`, so every update check hits the
// server. Registration happens only in production (components/pwa/sw-rejestracja.tsx).
export const dynamic = 'force-static'

// Self-removing worker: activates at once, deletes the precache and
// unregisters. Served (1) in `next dev`, where there is no complete build
// output to precache — a browser that still has the production worker for this
// origin (e.g. after `next start` on the same port) drops it, so dev always
// talks to the dev server; (2) as the emergency kill-switch: a production
// build with NEXT_PUBLIC_SW_WYLACZ=1 (procedure in docs/memory.md, "SW wariant C
// — etap 1"). Also removes `offgrid-v1`, the cache of the pre-D59 worker. The byte change makes every installed worker update to it;
// open tabs then go to the network (this worker has no fetch handler).
const SW_USUN = `self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(n){return Promise.all(n.filter(function(k){return k.indexOf('offgrid-precache-')===0||k==='offgrid-v1'}).map(function(k){return caches.delete(k)}))}).then(function(){return self.registration.unregister()}))});`

function zrodloSw(): string {
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SW_WYLACZ === '1') return SW_USUN
  const wpisy = wczytajWpisyPrecache()
  const wersja = createHash('sha256').update(JSON.stringify(wpisy)).digest('hex').slice(0, 12)
  return `self.__SW_KONFIG=${JSON.stringify({ wersja, wpisy })};\n${wczytajRdzenSw()}`
}

export function GET() {
  return new Response(zrodloSw(), {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  })
}
