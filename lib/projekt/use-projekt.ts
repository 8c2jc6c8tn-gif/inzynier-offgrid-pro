"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { getServerSnapshot, getSnapshot, subscribe, type Projekt, type StanProjektow } from "./projekty"
import { subskrybujWartosci, wartosciZPamieci, wczytajWartosci } from "./magazyn-wartosci"
import type { WartosciProjektu } from "./wielkosci"

/** The project list; `null` on the server and during hydration (storage keys are not known yet — read nothing). */
export function useListaProjektow(): StanProjektow | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Id of the active project, `null` until known on the client. */
export function useAktywnyProjektId(): string | null {
  return useListaProjektow()?.aktywnyId ?? null
}

export function useAktywnyProjekt(): Projekt | null {
  const lista = useListaProjektow()
  return lista?.projekty.find((p) => p.id === lista.aktywnyId) ?? null
}

/** Quantities of a project; `null` while not read yet (or while the project is not known). */
export function useWartosciProjektu(projektId: string | null): WartosciProjektu | null {
  useEffect(() => {
    if (projektId) void wczytajWartosci(projektId)
  }, [projektId])
  return useSyncExternalStore(
    subskrybujWartosci,
    () => (projektId ? (wartosciZPamieci(projektId) ?? null) : null),
    () => null,
  )
}

/** Quantities of several projects at once (the comparison table). A project not read yet is `null`. */
export function useWartosciWieluProjektow(ids: readonly string[]): Record<string, WartosciProjektu | null> {
  const klucz = ids.join(",")
  useEffect(() => {
    for (const id of klucz.split(",")) if (id) void wczytajWartosci(id)
  }, [klucz])
  const cache = useRef<{ klucz: string; czesci: (WartosciProjektu | undefined)[]; wynik: Record<string, WartosciProjektu | null> } | null>(null)
  return useSyncExternalStore(
    subskrybujWartosci,
    () => {
      const lista = klucz ? klucz.split(",") : []
      const czesci = lista.map((id) => wartosciZPamieci(id))
      const c = cache.current
      if (c && c.klucz === klucz && c.czesci.every((x, i) => x === czesci[i])) return c.wynik
      const wynik = Object.fromEntries(lista.map((id, i) => [id, czesci[i] ?? null]))
      cache.current = { klucz, czesci, wynik }
      return wynik
    },
    () => PUSTE,
  )
}
const PUSTE: Record<string, WartosciProjektu | null> = {}
