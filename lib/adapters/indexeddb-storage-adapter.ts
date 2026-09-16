/**
 * Implementacja StorageAdapter (docs/standards/05-baza-danych-offline.md, 5.2) na IndexedDB.
 * Jedna, scentralizowana baza (5.3) z jednym key-value object store — kolejne klasy danych
 * (np. załączniki binarne) dostają osobny store w tym samym `onupgradeneeded`, nie osobną bazę.
 *
 * Pierwsze realne użycie: `use-persisted-draft.ts` (Seed formularza kalkulatora — 5.1, nigdy Wynik).
 */
import type { StorageAdapter } from "./storage-adapter"

const DB_NAME = "offgrid-storage"
const DB_VERSION = 1
const STORE_NAME = "kv"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
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
