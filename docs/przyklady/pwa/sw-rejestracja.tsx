'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { sledzAktualizacjeSw } from '@/lib/pwa/aktualizacja-sw'
import { useT } from '@/lib/i18n/use-t'

// Stable ids: repeated events update one toast instead of stacking copies.
const TOAST_NOWA_WERSJA_ID = 'sw-nowa-wersja'
const TOAST_INNA_KARTA_ID = 'sw-inna-karta'

// An installed app can stay open for days without a navigation (the only
// moment the browser checks for a new worker by itself) — check again when it
// comes back to the foreground, at most this often.
const SPRAWDZ_CO_MS = 60 * 60 * 1000

/**
 * Emergency kill-switch (plan, section 4.5; procedure in docs/memory.md):
 * a deploy built with NEXT_PUBLIC_SW_WYLACZ=1 serves a self-removing worker
 * from /sw.js (app/sw.js/route.ts) and makes the new client code unregister
 * instead of register.
 */
const SW_WYLACZONY = process.env.NEXT_PUBLIC_SW_WYLACZ === '1'

/**
 * PWA P1–P2 (docs/silnik/pwa-plan-v1_0.md): registers the service worker
 * (app/sw.js/route.ts) in production only — in dev there is no complete build
 * to precache. Registered after `load`, so the precache download does not
 * compete with the first page load. `updateViaCache: 'none'`: update checks
 * always reach the server, never the HTTP cache. A waiting new version is
 * offered as a persistent toast; it activates only when the user accepts
 * (lib/pwa/aktualizacja-sw.ts).
 */
export function SwRejestracja() {
  const { t } = useT()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    const kontener = navigator.serviceWorker

    if (SW_WYLACZONY) {
      kontener
        .getRegistrations()
        .then((rejestracje) => Promise.all(rejestracje.map((r) => r.unregister())))
        .catch(() => {})
      return
    }

    let aktywny = true
    let zakoncz: (() => void) | undefined
    let ostatnieSprawdzenie = Date.now()
    let rejestracja: ServiceWorkerRegistration | undefined

    const naWidocznosc = () => {
      if (document.visibilityState !== 'visible' || !rejestracja) return
      if (Date.now() - ostatnieSprawdzenie < SPRAWDZ_CO_MS) return
      ostatnieSprawdzenie = Date.now()
      rejestracja.update().catch(() => {
        // Offline or server unreachable — the next check will retry.
      })
    }

    const zarejestruj = () => {
      kontener
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((r) => {
          if (!aktywny) return
          rejestracja = r
          zakoncz = sledzAktualizacjeSw(kontener, r, {
            naNowaWersje: (zastosuj) => {
              toast.info(t('pwa.aktualizacja.nowaTytul'), {
                id: TOAST_NOWA_WERSJA_ID,
                description: t('pwa.aktualizacja.nowaOpis'),
                duration: Infinity,
                action: { label: t('pwa.aktualizacja.odswiezAkcja'), onClick: zastosuj },
              })
            },
            naZmianeWInnejKarcie: () => {
              toast.dismiss(TOAST_NOWA_WERSJA_ID)
              toast.warning(t('pwa.aktualizacja.innaKartaTytul'), {
                id: TOAST_INNA_KARTA_ID,
                description: t('pwa.aktualizacja.innaKartaOpis'),
                duration: Infinity,
                action: { label: t('pwa.aktualizacja.odswiezAkcja'), onClick: () => window.location.reload() },
              })
            },
            przeladuj: () => window.location.reload(),
          })
        })
        .catch(() => {
          // No worker = the app still works online; nothing to show the user.
        })
    }

    document.addEventListener('visibilitychange', naWidocznosc)
    if (document.readyState === 'complete') zarejestruj()
    else window.addEventListener('load', zarejestruj, { once: true })

    return () => {
      aktywny = false
      zakoncz?.()
      document.removeEventListener('visibilitychange', naWidocznosc)
      window.removeEventListener('load', zarejestruj)
    }
  }, [t])

  return null
}
