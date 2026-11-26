/**
 * Project list (owner decision 23.11.2026, D-1…D-4 of `docs/audyt-powiazan-ekranow-2026-11-09.md`): several installation
 * projects, one active. A project owns EVERYTHING the user typed: every screen's draft, its currency marker, the equipment
 * profile and the project quantities (`wielkosci.ts`). Switching the project switches all screens.
 *
 * The list itself is small metadata kept in localStorage (synchronous, so a screen knows its storage namespace on the first
 * client render — the same `useSyncExternalStore` pattern as `lib/waluta/storage.ts`). The data of a project lives in
 * IndexedDB under the project's key namespace (`kluczProjektu`). The first project keeps the keys used before projects
 * existed (`offgrid.draft.<screen>` …), so nothing has to be migrated: what the user typed so far simply becomes project 1.
 */
import { consoleReporter } from "@/lib/core/reporter"
import { czyKodKraju, KRAJ_DOMYSLNY } from "./kraje"

export const KLUCZ_LISTY_PROJEKTOW = "offgrid.projekty.v1"
const CHANGE_EVENT = "offgrid-projekty-change"

/** Id of the project that owns the pre-project keys (no prefix). */
export const ID_PIERWSZEGO = "p1"

export type Projekt = {
  id: string
  /** Empty = the default name („Projekt 1”) is shown in the UI language. */
  nazwa: string
  utworzonoIso: string
  /** ISO 3166 code of the project's country (`kraje.ts`); sets the currency of official amounts. Default Poland. */
  kraj: string
}

export type StanProjektow = {
  aktywnyId: string
  projekty: Projekt[]
}

const DOMYSLNY: StanProjektow = { aktywnyId: ID_PIERWSZEGO, projekty: [{ id: ID_PIERWSZEGO, nazwa: "", utworzonoIso: "", kraj: KRAJ_DOMYSLNY }] }

/**
 * Storage key of a per-project item. `baza` is the part after `offgrid.` used before projects existed, e.g. `draft.bojler-cwu`.
 * Project 1 → `offgrid.draft.bojler-cwu`; any other → `offgrid.p.<id>.draft.bojler-cwu`.
 */
export function kluczProjektu(projektId: string, baza: string): string {
  return projektId === ID_PIERWSZEGO ? `offgrid.${baza}` : `offgrid.p.${projektId}.${baza}`
}

/**
 * Key prefixes that belong to a project (everything else — TMY cache, telemetry samples, layout, language — is shared).
 * Prefixes ending with "." are families (one key per screen); the others are single keys.
 */
export const BAZY_PROJEKTU = ["draft.", "draftwaluta.", "draftwaluty.", "draftprojekt.", "profil-sprzetu.v1", "wielkosci-projektu.v1"] as const

/** True when `klucz` (a full storage key) belongs to the project `projektId`. */
export function nalezyDoProjektu(klucz: string, projektId: string): boolean {
  return BAZY_PROJEKTU.some((baza) => {
    const pelny = kluczProjektu(projektId, baza)
    return baza.endsWith(".") ? klucz.startsWith(pelny) : klucz === pelny
  })
}

export function parsujListe(raw: string | null): StanProjektow {
  if (!raw) return DOMYSLNY
  try {
    const o = JSON.parse(raw) as Partial<StanProjektow>
    const projekty = Array.isArray(o.projekty)
      ? o.projekty.filter(
          (p): p is Projekt => typeof p === "object" && p !== null && typeof p.id === "string" && /^[a-z0-9]{1,24}$/.test(p.id),
        )
      : []
    const unikalne = projekty.filter((p, i) => projekty.findIndex((q) => q.id === p.id) === i)
    if (unikalne.length === 0) return DOMYSLNY
    const lista = unikalne.map((p) => ({
      id: p.id,
      nazwa: typeof p.nazwa === "string" ? p.nazwa : "",
      utworzonoIso: typeof p.utworzonoIso === "string" ? p.utworzonoIso : "",
      kraj: czyKodKraju(p.kraj) ? p.kraj : KRAJ_DOMYSLNY,
    }))
    const aktywnyId = lista.some((p) => p.id === o.aktywnyId) ? (o.aktywnyId as string) : lista[0]!.id
    return { aktywnyId, projekty: lista }
  } catch {
    return DOMYSLNY
  }
}

function czytaj(): string | null {
  try {
    return window.localStorage.getItem(KLUCZ_LISTY_PROJEKTOW)
  } catch {
    return null
  }
}

let cache: { raw: string | null; stan: StanProjektow } | null = null

export function getSnapshot(): StanProjektow {
  const raw = czytaj()
  if (cache && cache.raw === raw) return cache.stan
  const stan = parsujListe(raw)
  cache = { raw, stan }
  return stan
}

/** On the server nothing is known — `null` keeps every storage read waiting for the client. */
export function getServerSnapshot(): StanProjektow | null {
  return null
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zapiszListe(stan: StanProjektow): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KLUCZ_LISTY_PROJEKTOW, JSON.stringify(stan))
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać listy projektów — zmiana obowiązuje tylko do przeładowania strony.",
      technicalDetails: `localStorage.setItem(${KLUCZ_LISTY_PROJEKTOW}) nie powiódł się`,
      source: "lib/projekt/projekty.zapiszListe",
      cause: err,
    })
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** A new id not used by the list: `p2`, `p3`… (short, so keys stay readable in the browser's storage view). */
export function noweId(stan: StanProjektow): string {
  for (let n = stan.projekty.length + 1; ; n++) {
    const id = `p${n}`
    if (!stan.projekty.some((p) => p.id === id)) return id
  }
}

export function zListaPoDodaniu(stan: StanProjektow, projekt: Projekt, aktywuj: boolean): StanProjektow {
  return { aktywnyId: aktywuj ? projekt.id : stan.aktywnyId, projekty: [...stan.projekty, projekt] }
}

/** The list after removing `id`; the last project cannot be removed (`null`). */
export function zListaPoUsunieciu(stan: StanProjektow, id: string): StanProjektow | null {
  const projekty = stan.projekty.filter((p) => p.id !== id)
  if (projekty.length === 0 || projekty.length === stan.projekty.length) return null
  return { aktywnyId: stan.aktywnyId === id ? projekty[0]!.id : stan.aktywnyId, projekty }
}
