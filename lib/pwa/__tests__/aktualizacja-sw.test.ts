// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { sledzAktualizacjeSw, WIADOMOSC_SKIP_WAITING } from '../aktualizacja-sw'

// Stand-ins for ServiceWorkerContainer / ServiceWorkerRegistration built on EventTarget.
function atrapy(opcje: { kontroler: boolean; czekajacy?: boolean }) {
  const czekajacy = Object.assign(new EventTarget(), { postMessage: vi.fn(), state: 'installed' })
  const kontener = Object.assign(new EventTarget(), {
    controller: opcje.kontroler ? ({} as ServiceWorker) : null,
  })
  const rejestracja = Object.assign(new EventTarget(), {
    waiting: (opcje.czekajacy ? czekajacy : null) as ServiceWorker | null,
    installing: null as (EventTarget & { state: string }) | null,
  })
  const zdarzenia = { naNowaWersje: vi.fn(), naZmianeWInnejKarcie: vi.fn(), przeladuj: vi.fn() }
  const zakoncz = sledzAktualizacjeSw(
    kontener as unknown as ServiceWorkerContainer,
    rejestracja as unknown as ServiceWorkerRegistration,
    zdarzenia,
  )
  const zmianaKontrolera = () => kontener.dispatchEvent(new Event('controllerchange'))
  return { kontener, rejestracja, czekajacy, zdarzenia, zakoncz, zmianaKontrolera }
}

describe('sledzAktualizacjeSw', () => {
  it('first visit: the first controllerchange is clients.claim(), not an update — nothing happens', () => {
    const a = atrapy({ kontroler: false })
    a.zmianaKontrolera()
    expect(a.zdarzenia.naNowaWersje).not.toHaveBeenCalled()
    expect(a.zdarzenia.naZmianeWInnejKarcie).not.toHaveBeenCalled()
    expect(a.zdarzenia.przeladuj).not.toHaveBeenCalled()
  })

  it('a version waiting at start with a controller is offered; accepting posts SKIP_WAITING, then exactly one reload', () => {
    const a = atrapy({ kontroler: true, czekajacy: true })
    expect(a.zdarzenia.naNowaWersje).toHaveBeenCalledTimes(1)
    const zastosuj = a.zdarzenia.naNowaWersje.mock.calls[0]![0] as () => void
    zastosuj()
    expect(a.czekajacy.postMessage).toHaveBeenCalledWith(WIADOMOSC_SKIP_WAITING)
    a.zmianaKontrolera()
    a.zmianaKontrolera()
    expect(a.zdarzenia.przeladuj).toHaveBeenCalledTimes(1)
    expect(a.zdarzenia.naZmianeWInnejKarcie).not.toHaveBeenCalled()
  })

  it('a worker installed during the session is offered when it reaches "installed"', () => {
    const a = atrapy({ kontroler: true })
    expect(a.zdarzenia.naNowaWersje).not.toHaveBeenCalled()
    const instalowany = Object.assign(new EventTarget(), { state: 'installing' })
    a.rejestracja.installing = instalowany
    a.rejestracja.dispatchEvent(new Event('updatefound'))
    instalowany.state = 'installed'
    a.rejestracja.waiting = a.czekajacy as unknown as ServiceWorker
    instalowany.dispatchEvent(new Event('statechange'))
    expect(a.zdarzenia.naNowaWersje).toHaveBeenCalledTimes(1)
  })

  it('controller change this tab did not ask for → "updated in another tab", no reload', () => {
    const a = atrapy({ kontroler: true })
    a.zmianaKontrolera()
    expect(a.zdarzenia.naZmianeWInnejKarcie).toHaveBeenCalledTimes(1)
    expect(a.zdarzenia.przeladuj).not.toHaveBeenCalled()
  })

  it('no controller (page not running an older version) → a waiting worker is not offered', () => {
    const a = atrapy({ kontroler: false, czekajacy: true })
    expect(a.zdarzenia.naNowaWersje).not.toHaveBeenCalled()
  })

  it('cleanup removes the listeners', () => {
    const a = atrapy({ kontroler: true })
    a.zakoncz()
    a.zmianaKontrolera()
    expect(a.zdarzenia.naZmianeWInnejKarcie).not.toHaveBeenCalled()
  })
})
