/**
 * PWA P2 (docs/silnik/pwa-plan-v1_0.md, section 4): update flow of the service
 * worker. A new worker installs in the background and waits (no automatic
 * skipWaiting — switching under a running tab would drop the lazily loaded
 * chunks it still needs). This module reports the waiting version, switches
 * to it only on request and tells what happened when the active worker
 * changes. No React — the toasts live in components/pwa/sw-rejestracja.tsx.
 */

/** Message understood by lib/pwa/sw-rdzen.js (`message` listener). */
export const WIADOMOSC_SKIP_WAITING = { typ: 'SKIP_WAITING' } as const

export interface ZdarzeniaAktualizacjiSw {
  /** A new version is installed and waiting; `zastosuj` activates it (then `przeladuj` follows). */
  naNowaWersje: (zastosuj: () => void) => void
  /** Another tab (or a kill-switch deploy) activated a new worker under this tab. */
  naZmianeWInnejKarcie: () => void
  /** This tab asked for the switch and the new worker took over. */
  przeladuj: () => void
}

type Kontener = Pick<ServiceWorkerContainer, 'controller' | 'addEventListener' | 'removeEventListener'>
type Rejestracja = Pick<ServiceWorkerRegistration, 'waiting' | 'installing' | 'addEventListener' | 'removeEventListener'>

/** Starts watching `rejestracja`; returns the cleanup. */
export function sledzAktualizacjeSw(
  kontener: Kontener,
  rejestracja: Rejestracja,
  zdarzenia: ZdarzeniaAktualizacjiSw,
): () => void {
  // No controller yet = first visit: the first `controllerchange` is the
  // initial clients.claim(), not an update.
  let bylKontroler = kontener.controller !== null
  let zadanoPrzelaczenia = false
  let przeladowano = false

  const zglosCzekajacy = () => {
    // Without a controller the page is not running an older version — nothing to offer.
    if (!rejestracja.waiting || kontener.controller === null) return
    zdarzenia.naNowaWersje(() => {
      const czekajacy = rejestracja.waiting
      if (!czekajacy) return
      zadanoPrzelaczenia = true
      czekajacy.postMessage(WIADOMOSC_SKIP_WAITING)
    })
  }

  const naZnalezionaAktualizacje = () => {
    const instalowany = rejestracja.installing
    if (!instalowany) return
    instalowany.addEventListener('statechange', () => {
      if (instalowany.state === 'installed') zglosCzekajacy()
    })
  }

  const naZmianeKontrolera = () => {
    if (!bylKontroler) {
      bylKontroler = true
      return
    }
    if (zadanoPrzelaczenia) {
      if (przeladowano) return
      przeladowano = true
      zdarzenia.przeladuj()
      return
    }
    zdarzenia.naZmianeWInnejKarcie()
  }

  rejestracja.addEventListener('updatefound', naZnalezionaAktualizacje)
  kontener.addEventListener('controllerchange', naZmianeKontrolera)
  // The update may have started before this listener existed.
  naZnalezionaAktualizacje()
  zglosCzekajacy()

  return () => {
    rejestracja.removeEventListener('updatefound', naZnalezionaAktualizacje)
    kontener.removeEventListener('controllerchange', naZmianeKontrolera)
  }
}
