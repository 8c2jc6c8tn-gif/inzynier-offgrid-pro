/**
 * Standard 5.10 (copied from the standard pattern docs/przyklady/pwa/trwaly-magazyn.ts; local
 * change: module path and this header): asks the browser to mark this origin's storage as
 * persistent, so the IndexedDB drafts (autosave 5.7, equipment profile, TMY data) are not evicted
 * under storage pressure or by iOS Safari's 7-day ITP cleanup. The browser decides
 * (Chromium/Safari by engagement heuristics without a prompt, Firefox with a permission prompt —
 * per MDN); a refusal changes nothing, the data stays "best-effort" as before.
 *
 * Called on writes (lib/adapters/indexeddb-storage-adapter.ts, setItem), requested at most once per
 * page load. A refusal is remembered in localStorage and the browser is not asked again on later
 * visits — Firefox shows a permission prompt, which would otherwise return on every app start.
 * A later grant from the browser settings is still picked up through `persisted()`.
 */

/** `true` granted, `false` refused, `null` API unavailable or failed. */
export type WynikTrwalegoMagazynu = boolean | null

export const KLUCZ_ODMOWY = "trwaly-magazyn-odmowa"

let zadanie: Promise<WynikTrwalegoMagazynu> | null = null

export function poprosOTrwalyMagazyn(): Promise<WynikTrwalegoMagazynu> {
  zadanie ??= (async () => {
    const magazyn = typeof navigator !== "undefined" ? navigator.storage : undefined
    if (!magazyn?.persist || !magazyn.persisted) return null
    try {
      if (await magazyn.persisted()) return true
      if (czyOdmowaZapamietana()) return false
      const zgoda = await magazyn.persist()
      if (!zgoda) zapamietajOdmowe()
      return zgoda
    } catch {
      return null
    }
  })()
  return zadanie
}

function czyOdmowaZapamietana(): boolean {
  try {
    return localStorage.getItem(KLUCZ_ODMOWY) === "1"
  } catch {
    return false
  }
}

function zapamietajOdmowe() {
  try {
    localStorage.setItem(KLUCZ_ODMOWY, "1")
  } catch {
    // storage unavailable — the browser will simply be asked again next visit
  }
}

/** Test-only: the once-per-page guard is module state. */
export function _resetTrwalyMagazyn() {
  zadanie = null
}
