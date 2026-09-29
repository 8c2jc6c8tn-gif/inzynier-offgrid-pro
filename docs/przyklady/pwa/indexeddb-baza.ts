/**
 * lib/store/indexeddb-baza.ts
 *
 * Jedna wspólna baza IndexedDB ("inzynier-szkieletowy-pro") dla dwóch
 * niezależnych magazynów: "zustand-kv" (Seed projektu, Etap D2) i
 * "zalaczniki" (zdjęcia paragonów, Etap E) — jedno miejsce otwierania
 * połączenia, żeby dwa niezależne moduły nie rywalizowały o wersję tej
 * samej bazy (IndexedDB blokuje upgrade, dopóki wszystkie inne otwarte
 * połączenia do tej samej bazy się nie zamkną).
 */

export const NAZWA_BAZY = "inzynier-szkieletowy-pro"
export const WERSJA_BAZY = 2
export const MAGAZYN_ZUSTAND_KV = "zustand-kv"
export const MAGAZYN_ZALACZNIKI = "zalaczniki"

export function czyDostepneIndexedDB(): boolean {
  return typeof indexedDB !== "undefined"
}

/**
 * Schema version conflicts between tabs (D109, P0.3 of docs/silnik/pwa-plan-v1_0.md):
 * - `nowsza-wersja-w-innej-karcie` — another tab (newer app version) is upgrading
 *   the database; this connection is closed so the upgrade is not blocked,
 *   and this tab runs outdated code;
 * - `baza-nowsza-niz-kod` — the database is already at a higher version than
 *   this code (`VersionError`), every open in this tab would fail;
 * - `upgrade-zablokowany` — this tab is upgrading and waits for other tabs to
 *   close their connections (the open request continues on its own afterwards).
 * The first two mean "reload the page"; the UI listens via `naZdarzenieWersjiBazy`.
 */
export type ZdarzenieWersjiBazy =
  | "nowsza-wersja-w-innej-karcie"
  | "baza-nowsza-niz-kod"
  | "upgrade-zablokowany"

const sluchaczeWersjiBazy = new Set<(zdarzenie: ZdarzenieWersjiBazy) => void>()

// "Reload needed" is permanent for this page's lifetime and usually happens
// before any UI subscribes (the persisted store rehydrates at module import),
// so it is remembered and replayed to late subscribers.
let wymagaOdswiezenia: ZdarzenieWersjiBazy | null = null

export function naZdarzenieWersjiBazy(sluchacz: (zdarzenie: ZdarzenieWersjiBazy) => void): () => void {
  sluchaczeWersjiBazy.add(sluchacz)
  if (wymagaOdswiezenia) sluchacz(wymagaOdswiezenia)
  return () => {
    sluchaczeWersjiBazy.delete(sluchacz)
  }
}

function powiadom(zdarzenie: ZdarzenieWersjiBazy) {
  if (zdarzenie !== "upgrade-zablokowany") wymagaOdswiezenia = zdarzenie
  for (const sluchacz of sluchaczeWersjiBazy) sluchacz(zdarzenie)
}

/** Test-only: module state survives between tests in one file. */
export function _resetZdarzenWersjiBazy() {
  wymagaOdswiezenia = null
  sluchaczeWersjiBazy.clear()
}

export function otworzBazeIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const zadanie = indexedDB.open(NAZWA_BAZY, WERSJA_BAZY)
    zadanie.onupgradeneeded = () => {
      const baza = zadanie.result
      if (!baza.objectStoreNames.contains(MAGAZYN_ZUSTAND_KV)) {
        baza.createObjectStore(MAGAZYN_ZUSTAND_KV)
      }
      if (!baza.objectStoreNames.contains(MAGAZYN_ZALACZNIKI)) {
        baza.createObjectStore(MAGAZYN_ZALACZNIKI)
      }
    }
    zadanie.onblocked = () => powiadom("upgrade-zablokowany")
    zadanie.onsuccess = () => {
      const baza = zadanie.result
      // close() lets running transactions finish, so an in-flight write is not lost
      baza.onversionchange = () => {
        baza.close()
        powiadom("nowsza-wersja-w-innej-karcie")
      }
      resolve(baza)
    }
    zadanie.onerror = () => {
      if (zadanie.error?.name === "VersionError") powiadom("baza-nowsza-niz-kod")
      reject(zadanie.error)
    }
  })
}
