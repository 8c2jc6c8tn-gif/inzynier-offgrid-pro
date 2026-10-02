import type { ProbkaTelemetrii } from "@/lib/core/telemetria/probka"
import { openDb, STORE_PROBEK } from "../indexeddb-storage-adapter"

/** Port for persisting raw samples (the Seed, standard 5.1); results are always recomputed. */
export interface MagazynProbek {
  dodaj(probki: ProbkaTelemetrii[]): Promise<void>
  /** Samples of a source in [odCzasu, doCzasu] (inclusive), ordered by time. */
  zakres(zrodloId: string, odCzasu: number, doCzasu: number): Promise<ProbkaTelemetrii[]>
  usunZrodlo(zrodloId: string): Promise<void>
}

const porownaj = (a: ProbkaTelemetrii, b: ProbkaTelemetrii) => a.czas - b.czas

export class PamiecMagazynProbek implements MagazynProbek {
  private mapa = new Map<string, ProbkaTelemetrii>()
  private klucz = (p: ProbkaTelemetrii) => `${p.zrodloId}|${p.kanal}|${p.wielkosc}|${p.czas}`

  async dodaj(probki: ProbkaTelemetrii[]) {
    for (const p of probki) this.mapa.set(this.klucz(p), p)
  }
  async zakres(zrodloId: string, od: number, do_: number) {
    return [...this.mapa.values()].filter((p) => p.zrodloId === zrodloId && p.czas >= od && p.czas <= do_).sort(porownaj)
  }
  async usunZrodlo(zrodloId: string) {
    for (const [k, p] of this.mapa) if (p.zrodloId === zrodloId) this.mapa.delete(k)
  }
}

export class IndexedDbMagazynProbek implements MagazynProbek {
  async dodaj(probki: ProbkaTelemetrii[]) {
    if (probki.length === 0) return
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBEK, "readwrite")
      const st = tx.objectStore(STORE_PROBEK)
      for (const p of probki) st.put(p)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  }
  async zakres(zrodloId: string, od: number, do_: number) {
    const db = await openDb()
    return new Promise<ProbkaTelemetrii[]>((resolve, reject) => {
      const req = db
        .transaction(STORE_PROBEK, "readonly")
        .objectStore(STORE_PROBEK)
        .index("po-zrodle-i-czasie")
        .getAll(IDBKeyRange.bound([zrodloId, od], [zrodloId, do_]))
      req.onsuccess = () => resolve((req.result as ProbkaTelemetrii[]).sort(porownaj))
      req.onerror = () => reject(req.error)
    })
  }
  async usunZrodlo(zrodloId: string) {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBEK, "readwrite")
      const idx = tx.objectStore(STORE_PROBEK).index("po-zrodle-i-czasie")
      const req = idx.openKeyCursor(IDBKeyRange.bound([zrodloId, -Infinity], [zrodloId, Infinity]))
      req.onsuccess = () => {
        const c = req.result
        if (c) {
          tx.objectStore(STORE_PROBEK).delete(c.primaryKey)
          c.continue()
        }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}
