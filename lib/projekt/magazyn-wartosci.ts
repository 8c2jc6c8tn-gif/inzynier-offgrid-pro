/**
 * Project quantities in storage (`wielkosci.ts`): one IndexedDB record per project, read once and kept in memory, every change
 * pushed to all subscribers at once — so the field on a screen and the quiet save bar see a saved value immediately (audit
 * section 3.7: reads were one-shot). Other tabs learn about a save through a BroadcastChannel and re-read the record.
 */
import { indexedDbStorageAdapter } from "@/lib/adapters/indexeddb-storage-adapter"
import { consoleReporter } from "@/lib/core/reporter"
import { kluczProjektu } from "./projekty"
import { parsujWartosci, type WartosciProjektu, type WielkoscId } from "./wielkosci"

const BAZA = "wielkosci-projektu.v1"
const KANAL = "offgrid-wielkosci-projektu"

const pamiec = new Map<string, WartosciProjektu>()
const wToku = new Map<string, Promise<void>>()
const sluchacze = new Set<() => void>()
let kanal: BroadcastChannel | null = null

function powiadom() {
  for (const s of sluchacze) s()
}

function otworzKanal() {
  if (kanal || typeof BroadcastChannel === "undefined") return
  kanal = new BroadcastChannel(KANAL)
  kanal.onmessage = (e: MessageEvent<{ projektId?: string }>) => {
    const id = e.data?.projektId
    if (typeof id !== "string") return
    pamiec.delete(id)
    wczytajWartosci(id)
  }
}

export function subskrybujWartosci(callback: () => void): () => void {
  otworzKanal()
  sluchacze.add(callback)
  return () => {
    sluchacze.delete(callback)
  }
}

/** Values of the project, or `undefined` while not read yet (call `wczytajWartosci` to start reading). */
export function wartosciZPamieci(projektId: string): WartosciProjektu | undefined {
  return pamiec.get(projektId)
}

export function wczytajWartosci(projektId: string): Promise<void> {
  if (pamiec.has(projektId)) return Promise.resolve()
  const biezace = wToku.get(projektId)
  if (biezace) return biezace
  const p = indexedDbStorageAdapter
    .getItem<unknown>(kluczProjektu(projektId, BAZA))
    .then((zapis) => {
      pamiec.set(projektId, parsujWartosci(zapis))
    })
    .catch((err) => {
      consoleReporter.reportError({
        userMessage: "Nie udało się wczytać danych projektu — pola trzeba wpisać ręcznie.",
        technicalDetails: `getItem(${kluczProjektu(projektId, BAZA)}) nie powiódł się`,
        source: "lib/projekt/magazyn-wartosci.wczytajWartosci",
        cause: err,
      })
      pamiec.set(projektId, {})
    })
    .finally(() => {
      wToku.delete(projektId)
      powiadom()
    })
  wToku.set(projektId, p)
  return p
}

/**
 * Writes the given quantities into the project (`zrodlo` = the screen they come from). `null` removes a quantity.
 * Memory and subscribers are updated at once; storage follows.
 */
export async function zapiszWartosci(projektId: string, zmiany: Partial<Record<WielkoscId, string | null>>, zrodlo: string): Promise<void> {
  await wczytajWartosci(projektId)
  const iso = new Date().toISOString()
  const nowe: WartosciProjektu = { ...pamiec.get(projektId) }
  for (const [id, v] of Object.entries(zmiany) as [WielkoscId, string | null][]) {
    if (v === null) delete nowe[id]
    else nowe[id] = { v, zrodlo, iso }
  }
  pamiec.set(projektId, nowe)
  powiadom()
  try {
    await indexedDbStorageAdapter.setItem(kluczProjektu(projektId, BAZA), nowe)
    kanal?.postMessage({ projektId })
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać danych projektu — zmiana obowiązuje tylko do przeładowania strony.",
      technicalDetails: `setItem(${kluczProjektu(projektId, BAZA)}) nie powiódł się`,
      source: "lib/projekt/magazyn-wartosci.zapiszWartosci",
      cause: err,
    })
  }
}

/** Forget a project's values (after it was removed or overwritten by a copy). */
export function zapomnijWartosci(projektId: string): void {
  pamiec.delete(projektId)
  kanal?.postMessage({ projektId })
  powiadom()
}

/** Test-only. */
export function _resetMagazynuWartosci() {
  pamiec.clear()
  wToku.clear()
  sluchacze.clear()
}
