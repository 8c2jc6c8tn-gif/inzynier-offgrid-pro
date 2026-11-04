"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { Language } from "../language"
import type { GrupaPomocy, PomocWszystko } from "./index"
import { LADUJ_MODUL_POMOCY, MODUL_POMOCY_PO_EKRANIE, type ModulPomocy, type TresciModulu } from "./ladowanie"

/**
 * Lazy help content. The „?” / „i” texts of all screens in three languages used to sit in the common bundle of every
 * page (≈ 660 KB gzipped). Now a screen loads only the module file it needs (`ladowanie.ts`, generated), on mount, so
 * the field name is in the „?” button's accessible label within a few milliseconds. The chunks are part of the Service
 * Worker precache (the whole `.next/static` is), so the help works offline as before.
 *
 * `import` types from `./index` only: a value import would pull the whole help back into the common bundle.
 */

const zaladowane = new Map<ModulPomocy, TresciModulu>()
const wToku = new Map<ModulPomocy, Promise<void>>()
const sluchacze = new Set<() => void>()

function zaladuj(modul: ModulPomocy): Promise<void> {
  const trwa = wToku.get(modul)
  if (trwa) return trwa
  const obietnica = LADUJ_MODUL_POMOCY[modul]()
    .then((tresci) => {
      zaladowane.set(modul, tresci)
      sluchacze.forEach((s) => s())
    })
    .catch(() => {
      // A failed chunk request (offline without precache, a lost connection): forget it so the next mount retries.
      wToku.delete(modul)
    })
  wToku.set(modul, obietnica)
  return obietnica
}

function subskrybuj(cb: () => void): () => void {
  sluchacze.add(cb)
  return () => {
    sluchacze.delete(cb)
  }
}

/**
 * Help entry of one screen/group in the given language, or `null` until its module file has loaded.
 * Components render a neutral trigger meanwhile and the full content right after.
 */
export function usePomocEkranu<G extends GrupaPomocy>(language: Language, ekran: G): PomocWszystko[G] | null {
  const modul = MODUL_POMOCY_PO_EKRANIE[ekran]
  const tresci = useSyncExternalStore(
    subskrybuj,
    () => (modul ? (zaladowane.get(modul) ?? null) : null),
    () => null,
  )
  useEffect(() => {
    if (modul) void zaladuj(modul)
  }, [modul])
  if (!tresci) return null
  return ((tresci as unknown as Record<Language, Record<string, unknown>>)[language][ekran] ?? null) as PomocWszystko[G] | null
}
