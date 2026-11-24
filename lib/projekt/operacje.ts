/**
 * Operations on whole projects (the `/projekty` page): new empty project, copy of a project, rename, remove, make active.
 * A copy duplicates every per-project key (`BAZY_PROJEKTU`), so the new project starts with all screens filled exactly as the
 * source — the usual way to try a variant („the same house with a bigger battery”) and compare it afterwards.
 */
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { BAZY_PROJEKTU, getSnapshot, kluczProjektu, noweId, zapiszListe, zListaPoDodaniu, zListaPoUsunieciu } from "./projekty"
import { zapomnijWartosci } from "./magazyn-wartosci"

/** Every storage key of the project, paired with its "base" (the part that is the same in every project). */
async function kluczeProjektu(projektId: string): Promise<{ klucz: string; baza: string }[]> {
  const wynik: { klucz: string; baza: string }[] = []
  for (const baza of BAZY_PROJEKTU) {
    const pelny = kluczProjektu(projektId, baza)
    if (baza.endsWith(".")) {
      for (const klucz of await indexedDbStorageAdapter.listKeys(pelny)) wynik.push({ klucz, baza: baza + klucz.slice(pelny.length) })
    } else if ((await indexedDbStorageAdapter.getItem(pelny)) !== null) wynik.push({ klucz: pelny, baza })
  }
  return wynik
}

/** Creates a project (a copy of `kopiaZ` when given, else empty), makes it active and returns its id. */
export async function utworzProjekt(nazwa: string, kopiaZ: string | null): Promise<string> {
  const stan = getSnapshot()
  const id = noweId(stan)
  if (kopiaZ) {
    for (const { klucz, baza } of await kluczeProjektu(kopiaZ)) {
      const wartosc = await indexedDbStorageAdapter.getItem(klucz)
      if (wartosc !== null) await indexedDbStorageAdapter.setItem(kluczProjektu(id, baza), wartosc)
    }
  }
  zapiszListe(zListaPoDodaniu(stan, { id, nazwa: nazwa.trim(), utworzonoIso: new Date().toISOString() }, true))
  return id
}

export function zmienNazwe(id: string, nazwa: string): void {
  const stan = getSnapshot()
  zapiszListe({ ...stan, projekty: stan.projekty.map((p) => (p.id === id ? { ...p, nazwa: nazwa.trim() } : p)) })
}

export function ustawAktywny(id: string): void {
  const stan = getSnapshot()
  if (stan.projekty.some((p) => p.id === id)) zapiszListe({ ...stan, aktywnyId: id })
}

/** Removes the project with all its data. The last project cannot be removed (returns false). */
export async function usunProjekt(id: string): Promise<boolean> {
  const nowa = zListaPoUsunieciu(getSnapshot(), id)
  if (!nowa) return false
  zapiszListe(nowa)
  for (const { klucz } of await kluczeProjektu(id)) await indexedDbStorageAdapter.removeItem(klucz)
  zapomnijWartosci(id)
  return true
}
