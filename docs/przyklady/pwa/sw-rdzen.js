// Service worker runtime (D109, P1 of docs/silnik/pwa-plan-v1_0.md).
// Plain JS on purpose: app/sw.js/route.ts serves this file verbatim, prefixed
// with `self.__SW_KONFIG = {wersja, wpisy}` (the precache list built by
// lib/pwa/precache.ts). No bundler, no imports — tested in node:vm
// (lib/pwa/__tests__/sw-rdzen.test.ts).
//
// Strategies (plan, section 3):
// - precached URLs (hashed /_next/static, public/, pre-paint dictionaries):
//   cache-first;
// - navigations: precached page (cache-first), then network, then the
//   precached /_not-found page;
// - RSC requests, /api/**, /_vercel/**, other origins, non-GET: not handled
//   (plain network). An RSC fetch failing offline makes the Next router fall
//   back to a full navigation, which is then served from the precache
//   (R3: `experimental.useOffline` stays off).
// No automatic skipWaiting — a new version waits until every tab is closed or
// the user accepts the update prompt (P2: components/pwa/sw-rejestracja.tsx
// posts SKIP_WAITING, see lib/pwa/aktualizacja-sw.ts).
;(function () {
  var KONFIG = self.__SW_KONFIG
  var PREFIKS = 'isp-precache-'
  var NAZWA = PREFIKS + KONFIG.wersja
  var NIE_ZNALEZIONO = '/_not-found'
  var ROWNOLEGLE = 6

  function klucz(wpis) {
    var url = new URL(wpis.url, self.location.origin)
    url.searchParams.set('__sw_rev', wpis.rev)
    return url.href
  }

  // path+search → cache key; pages separately (navigations ignore the query).
  var ZASOBY = new Map()
  var STRONY = new Map()
  KONFIG.wpisy.forEach(function (wpis) {
    ;(wpis.strona ? STRONY : ZASOBY).set(wpis.url, klucz(wpis))
  })

  // A redirected response cannot answer a navigation — store a plain copy.
  function bezPrzekierowania(odpowiedz) {
    if (!odpowiedz.redirected) return Promise.resolve(odpowiedz)
    return odpowiedz.blob().then(function (tresc) {
      return new Response(tresc, {
        status: odpowiedz.status,
        statusText: odpowiedz.statusText,
        headers: odpowiedz.headers,
      })
    })
  }

  function pobierzDoCache(cache, stare, wpis) {
    var k = klucz(wpis)
    return cache.match(k).then(function (jest) {
      if (jest) return // resumed install after a failed attempt
      // Unchanged entry (same url + rev) from the previous version: reuse, no download.
      return stare
        .reduce(function (znaleziona, nazwa) {
          return znaleziona.then(function (odp) {
            return (
              odp ||
              caches.open(nazwa).then(function (c) {
                return c.match(k)
              })
            )
          })
        }, Promise.resolve(undefined))
        .then(function (zPoprzedniej) {
          if (zPoprzedniej) return cache.put(k, zPoprzedniej)
          var adres = new URL(wpis.url, self.location.origin).href
          return fetch(new Request(adres, { cache: 'reload', credentials: 'same-origin' }))
            .then(function (odp) {
              if (!odp.ok && !(wpis.url === NIE_ZNALEZIONO && odp.status === 404)) {
                throw new Error('precache: ' + wpis.url + ' → HTTP ' + odp.status)
              }
              return bezPrzekierowania(odp)
            })
            .then(function (odp) {
              return cache.put(k, odp)
            })
        })
    })
  }

  function instaluj() {
    return Promise.all([caches.open(NAZWA), caches.keys()]).then(function (w) {
      var cache = w[0]
      var stare = w[1].filter(function (n) {
        return n.indexOf(PREFIKS) === 0 && n !== NAZWA
      })
      var kolejka = KONFIG.wpisy.slice()
      function pracownik() {
        var wpis = kolejka.shift()
        if (!wpis) return Promise.resolve()
        return pobierzDoCache(cache, stare, wpis).then(pracownik)
      }
      var pracownicy = []
      for (var i = 0; i < ROWNOLEGLE; i++) pracownicy.push(pracownik())
      // Any failure rejects → the install fails and the old version stays active.
      return Promise.all(pracownicy)
    })
  }

  function aktywuj() {
    return caches
      .keys()
      .then(function (nazwy) {
        return Promise.all(
          nazwy
            .filter(function (n) {
              return n.indexOf(PREFIKS) === 0 && n !== NAZWA
            })
            .map(function (n) {
              return caches.delete(n)
            }),
        )
      })
      .then(function () {
        return self.clients.claim()
      })
  }

  function zCache(k) {
    if (!k) return Promise.resolve(undefined)
    return caches.open(NAZWA).then(function (c) {
      return c.match(k)
    })
  }

  function nawigacja(url, zadanie) {
    var sciezka = url.pathname
    if (sciezka.length > 1 && sciezka.charAt(sciezka.length - 1) === '/') sciezka = sciezka.slice(0, -1)
    return zCache(STRONY.get(sciezka)).then(function (strona) {
      if (strona) return strona
      return fetch(zadanie).catch(function (blad) {
        return zCache(STRONY.get(NIE_ZNALEZIONO)).then(function (brak) {
          if (brak) return brak
          throw blad
        })
      })
    })
  }

  function czyPominac(zadanie, url) {
    if (zadanie.method !== 'GET' || url.origin !== self.location.origin) return true
    if (url.pathname === '/api' || url.pathname.indexOf('/api/') === 0) return true
    if (url.pathname.indexOf('/_vercel/') === 0) return true
    return zadanie.headers.get('rsc') === '1' || url.searchParams.has('_rsc')
  }

  self.addEventListener('install', function (zdarzenie) {
    zdarzenie.waitUntil(instaluj())
  })

  self.addEventListener('activate', function (zdarzenie) {
    zdarzenie.waitUntil(aktywuj())
  })

  self.addEventListener('message', function (zdarzenie) {
    if (zdarzenie.data && zdarzenie.data.typ === 'SKIP_WAITING') self.skipWaiting()
  })

  self.addEventListener('fetch', function (zdarzenie) {
    var zadanie = zdarzenie.request
    var url = new URL(zadanie.url)
    if (czyPominac(zadanie, url)) return
    if (zadanie.mode === 'navigate') {
      zdarzenie.respondWith(nawigacja(url, zadanie))
      return
    }
    var k = ZASOBY.get(url.pathname + url.search)
    if (!k) return
    zdarzenie.respondWith(
      zCache(k).then(function (odp) {
        return odp || fetch(zadanie)
      }),
    )
  })
})()
