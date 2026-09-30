/**
 * Implementacja StorageAdapter (docs/standards/05-baza-danych-offline.md, 5.2) na IndexedDB.
 * Jedna, scentralizowana baza (5.3) z jednym key-value object store — kolejne klasy danych
 * (np. załączniki binarne) dostają osobny store w tym samym `onupgradeneeded`, nie osobną bazę.
 *
 * Pierwsze realne użycie: `use-persisted-draft.ts` (Seed formularza kalkulatora — 5.1, nigdy Wynik).
 *
 * Standard 5.10: każdy zapis prosi (raz na załadowanie strony) o trwały magazyn — `trwaly-magazyn.ts`.
 * Standard 5.11: kolizje wersji schematu między kartami zgłaszane przez `naZdarzenieWersjiBazy`
 * (wzorzec `docs/przyklady/pwa/indexeddb-baza.ts`), toast: `components/pwa/baza-wersja-listener.tsx`.
 * Musi działać, zanim ktokolwiek pierwszy raz podbije `DB_VERSION`.
 */
import type { StorageAdapter } from "./storage-adapter"
import { poprosOTrwalyMagazyn } from "./trwaly-magazyn"

const DB_NAME = "offgrid-storage"
const DB_VERSION = 1
const STORE_NAME = "kv"

/**
 * Schema version conflicts between tabs (standard 5.11):
 * - `nowsza-wersja-w-innej-karcie` — another tab (newer app version) is upgrading the database;
 *   this connection is closed so the upgrade is not blocked, and this tab runs outdated code;
 * - `baza-nowsza-niz-kod` — the database is already at a higher version than this code
 *   (`VersionError`), every open in this tab would fail, so autosave would fail silently;
 * - `upgrade-zablokowany` — this tab is upgrading and waits for other tabs to close their
 *   connections (the open request continues on its own afterwards).
 * The first two mean "reload the page".
 */
export type ZdarzenieWersjiBazy = "nowsza-wersja-w-innej-karcie" | "baza-nowsza-niz-kod" | "upgrade-zablokowany"

const sluchaczeWersjiBazy = new Set<(zdarzenie: ZdarzenieWersjiBazy) => void>()

// "Reload needed" is permanent for this page's lifetime and can happen before any UI subscribes
// (a draft is read on the first effect), so it is remembered and replayed to late subscribers.
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

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onblocked = () => powiadom("upgrade-zablokowany")
    req.onsuccess = () => {
      const db = req.result
      // close() lets running transactions finish, so an in-flight write is not lost
      db.onversionchange = () => {
        db.close()
        powiadom("nowsza-wersja-w-innej-karcie")
      }
      resolve(db)
    }
    req.onerror = () => {
      if (req.error?.name === "VersionError") powiadom("baza-nowsza-niz-kod")
      reject(req.error)
    }
  })
}

export class IndexedDbStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly")
      const req = tx.objectStore(STORE_NAME).get(key)
      req.onsuccess = () => resolve((req.result ?? null) as T | null)
      req.onerror = () => reject(req.error)
    })
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    void poprosOTrwalyMagazyn()
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).put(value, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async removeItem(key: string): Promise<void> {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).delete(key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}

export const indexedDbStorageAdapter = new IndexedDbStorageAdapter()
