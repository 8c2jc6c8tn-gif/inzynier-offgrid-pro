/**
 * What the quiet save bar (`components/projekt/pasek-projektu.tsx`) shows: values on the open screen(s) that differ from the
 * project. Screens register them here (`use-persisted-draft.ts` for fields, `useWynikiDoProjektu` for results); the bar is
 * mounted once in the layout, so no screen renders its own bar.
 */
import type { Kandydat } from "./powiazania"

export type WpisPaska = {
  /** Screen key (the `app/kalkulatory/<key>` folder) — shown as the screen name and stored as the value's source. */
  ekran: string
  kandydaci: Kandydat[]
  /** Saves these candidates into the active project. */
  zapisz: () => Promise<void>
}

const wpisy = new Map<string, WpisPaska>()
const sluchacze = new Set<() => void>()
let migawka: WpisPaska[] = []

function powiadom() {
  migawka = [...wpisy.values()].filter((w) => w.kandydaci.length > 0)
  for (const s of sluchacze) s()
}

export function ustawWpisPaska(id: string, wpis: WpisPaska | null): void {
  if (wpis === null) {
    if (!wpisy.delete(id)) return
  } else {
    const stary = wpisy.get(id)
    if (stary && stary.zapisz === wpis.zapisz && JSON.stringify(stary.kandydaci) === JSON.stringify(wpis.kandydaci)) return
    wpisy.set(id, wpis)
  }
  powiadom()
}

export function subskrybujPasek(callback: () => void): () => void {
  sluchacze.add(callback)
  return () => {
    sluchacze.delete(callback)
  }
}

export function wpisyPaska(): WpisPaska[] {
  return migawka
}

const PUSTE: WpisPaska[] = []
export function wpisyPaskaSerwer(): WpisPaska[] {
  return PUSTE
}
