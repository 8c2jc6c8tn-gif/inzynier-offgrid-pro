/**
 * Service worker cache'ujący assety i strony — docs/standards/05-baza-danych-offline.md, 5.3.
 * Ręcznie pisany (bez biblioteki, np. Workbox/next-pwa) — zakres 5.3 dla tego projektu jest wąski
 * (cache assetów + stron po pierwszym pobraniu), a projekt trzyma jeden lockfile i minimalizuje
 * zależności (docs/standards/11-ci-deployment.md, 11.1) tam, gdzie własny kod jest w pełni
 * wystarczający i łatwiejszy do audytu niż wygenerowany bundle biblioteki.
 *
 * Strategia:
 * - `/_next/static/*` i inne assety o niezmiennych, haszowanych URL-ach → cache-first (bezpieczne
 *   bezterminowe cache'owanie, URL zmienia się przy każdej zmianie treści).
 * - Nawigacje (strony HTML) → network-first z fallbackiem do cache — świeża treść gdy online,
 *   ale strona odwiedzona wcześniej działa offline (5.3: "buforowane na stałe po pierwszym
 *   pobraniu", nie prewencyjne cache'owanie wszystkich ~100 tras z góry).
 *
 * Podbij CACHE_VERSION przy każdej zmianie tego pliku — stare cache są czyszczone w `activate`.
 */
const CACHE_VERSION = "v1"
const CACHE_NAME = `offgrid-${CACHE_VERSION}`

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nazwy = await caches.keys()
      await Promise.all(nazwy.filter((nazwa) => nazwa !== CACHE_NAME).map((nazwa) => caches.delete(nazwa)))
      await self.clients.claim()
    })(),
  )
})

function jestAssetemStatycznym(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/_next/image")
}

self.addEventListener("fetch", (event) => {
  const request = event.request
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (jestAssetemStatycznym(url)) {
    event.respondWith(
      (async () => {
        const wCache = await caches.match(request)
        if (wCache) return wCache
        const odpowiedz = await fetch(request)
        if (odpowiedz.ok) {
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, odpowiedz.clone())
        }
        return odpowiedz
      })(),
    )
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const odpowiedz = await fetch(request)
          if (odpowiedz.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, odpowiedz.clone())
          }
          return odpowiedz
        } catch (err) {
          const wCache = await caches.match(request)
          if (wCache) return wCache
          throw err
        }
      })(),
    )
  }
})
