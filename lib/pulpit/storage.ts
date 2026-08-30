/**
 * Preferencje pulpitu (widoczność/kolejność kafli) — "drobna preferencja UI", nie dana projektu
 * (ZASADY_APLIKACJI.md, Zasada 6 — offline-first). Stąd `localStorage`, nie `StorageAdapter`.
 * Zasady interakcji: docs/pulpit-i-nawigacja.md, sekcja 4.
 *
 * Ekspozycja przez `useSyncExternalStore` (nie `useState`+`useEffect`) — localStorage to
 * zewnętrzne źródło danych względem Reacta, więc to jest właściwy hook do jego odczytu
 * w sposób bezpieczny dla SSR/hydracji (bez ostrzeżenia react-hooks/set-state-in-effect).
 */

import { KAFLE } from "./registry"

const STORAGE_KEY = "offgrid.pulpit.v1"
const CHANGE_EVENT = "offgrid-pulpit-change"

export type PulpitState = {
  /** Id kafli ukrytych przez użytkownika — nie usunięte, tylko schowane z pulpitu. */
  hiddenIds: number[]
  /** Kolejność wszystkich kafli (id), niezależnie od widoczności. */
  order: number[]
}

export function domyslnaKolejnosc(): number[] {
  return KAFLE.map((k) => k.id)
}

const DOMYSLNY_STAN: PulpitState = { hiddenIds: [], order: KAFLE.map((k) => k.id) }

export function domyslnyStan(): PulpitState {
  return DOMYSLNY_STAN
}

function parsujStan(raw: string | null): PulpitState {
  if (!raw) return DOMYSLNY_STAN

  try {
    const parsed = JSON.parse(raw) as Partial<PulpitState>
    const validIds = new Set(domyslnaKolejnosc())

    const hiddenIds = Array.isArray(parsed.hiddenIds)
      ? parsed.hiddenIds.filter((id): id is number => validIds.has(id))
      : []

    const zapisaneWKolejnosci = Array.isArray(parsed.order)
      ? parsed.order.filter((id): id is number => validIds.has(id))
      : []
    // Kafle nieobecne w zapisanej kolejności (np. dodane później do rejestru) trafiają na koniec.
    const brakujace = domyslnaKolejnosc().filter((id) => !zapisaneWKolejnosci.includes(id))

    return { hiddenIds, order: [...zapisaneWKolejnosci, ...brakujace] }
  } catch {
    return DOMYSLNY_STAN
  }
}

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

let cache: { raw: string | null; stan: PulpitState } | null = null

export function getSnapshot(): PulpitState {
  const raw = odczytajRaw()
  if (cache && cache.raw === raw) return cache.stan
  const stan = parsujStan(raw)
  cache = { raw, stan }
  return stan
}

export function getServerSnapshot(): PulpitState {
  return DOMYSLNY_STAN
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zapiszStanPulpitu(state: PulpitState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    // localStorage niedostępny (tryb prywatny itp.) — preferencja nie zostanie zapamiętana,
    // ale to nie jest błąd krytyczny (drobna preferencja UI, nie dana projektu).
  }
}
