/**
 * Display-currency preference + cached exchange rates. Same pattern as lib/i18n/storage.ts
 * (`useSyncExternalStore` + localStorage, no cookie — 17.4, offline-first). Rates are fetched from
 * the ECB reference feed (Frankfurter) when online and cached, so the last known rate keeps
 * working offline. A rate can also be entered by hand (`reczne`) or widened with `narzutProc`.
 */
import { consoleReporter } from "@/lib/core/reporter"
import { czyKodWaluty, WALUTA_BAZOWA, type KodWaluty } from "./waluty"
import { liczbyDodatnie, parsujOdpowiedzKursow, URL_KURSOW_SERWER, urlKursowEbc, type OdpowiedzKursow } from "./kursy-zrodlo"
import type { Kursy } from "./przelicz"

export const KLUCZ_PREFERENCJI = "offgrid.waluta.v1"
export const KLUCZ_KURSOW = "offgrid.kursy.v1"
const CHANGE_EVENT = "offgrid-waluta-change"
export const WAZNOSC_KURSOW_MS = 12 * 60 * 60 * 1000

export interface PreferencjaWaluty {
  kod: KodWaluty
  narzutProc: number
  reczne: Kursy
}
export interface KursyZapisane {
  pobranoMs: number
  dataEcb: string
  kursy: Kursy
}
export interface StanWaluty {
  preferencja: PreferencjaWaluty
  kursy: KursyZapisane | null
}

const DOMYSLNA: StanWaluty = { preferencja: { kod: WALUTA_BAZOWA, narzutProc: 0, reczne: {} }, kursy: null }

function czytaj(klucz: string): string | null {
  try {
    return window.localStorage.getItem(klucz)
  } catch {
    return null
  }
}

function zapisz(klucz: string, wartosc: string): void {
  try {
    window.localStorage.setItem(klucz, wartosc)
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać ustawień waluty — zmiana obowiązuje tylko w tej sesji.",
      technicalDetails: `localStorage.setItem(${klucz}) nie powiódł się`,
      source: "lib/waluta/storage.zapisz",
      cause: err,
    })
  }
}

export function parsujPreferencje(raw: string | null): PreferencjaWaluty {
  if (!raw) return DOMYSLNA.preferencja
  try {
    const o = JSON.parse(raw) as Partial<PreferencjaWaluty>
    const narzut = typeof o.narzutProc === "number" && Number.isFinite(o.narzutProc) ? Math.min(20, Math.max(0, o.narzutProc)) : 0
    return { kod: czyKodWaluty(o.kod) ? o.kod : WALUTA_BAZOWA, narzutProc: narzut, reczne: liczbyDodatnie(o.reczne) }
  } catch {
    return DOMYSLNA.preferencja
  }
}

export function parsujKursy(raw: string | null): KursyZapisane | null {
  if (!raw) return null
  try {
    const o = JSON.parse(raw) as Partial<KursyZapisane>
    if (typeof o.pobranoMs !== "number") return null
    return { pobranoMs: o.pobranoMs, dataEcb: typeof o.dataEcb === "string" ? o.dataEcb : "", kursy: liczbyDodatnie(o.kursy) }
  } catch {
    return null
  }
}

let cache: { rawP: string | null; rawK: string | null; stan: StanWaluty } | null = null

export function getSnapshot(): StanWaluty {
  const rawP = czytaj(KLUCZ_PREFERENCJI)
  const rawK = czytaj(KLUCZ_KURSOW)
  if (cache && cache.rawP === rawP && cache.rawK === rawK) return cache.stan
  const stan = { preferencja: parsujPreferencje(rawP), kursy: parsujKursy(rawK) }
  cache = { rawP, rawK, stan }
  return stan
}

export function getServerSnapshot(): StanWaluty {
  return DOMYSLNA
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zapiszPreferencje(p: PreferencjaWaluty): void {
  if (typeof window === "undefined") return
  zapisz(KLUCZ_PREFERENCJI, JSON.stringify(p))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

let wToku: Promise<boolean> | null = null

async function pobierzJson(url: string): Promise<OdpowiedzKursow> {
  const odp = await fetch(url)
  if (!odp.ok) throw new Error(`HTTP ${odp.status}`)
  const dane = parsujOdpowiedzKursow(await odp.json())
  if (!dane) throw new Error("pusta odpowiedź")
  return dane
}

/**
 * Fetch ECB rates (base PLN) and cache them locally. Order: our server copy (`/api/kursy`), then
 * Frankfurter directly. Resolves false on any failure (offline → the last saved rate stays, with its date).
 */
export function odswiezKursy(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)
  if (wToku) return wToku
  wToku = pobierzJson(URL_KURSOW_SERWER)
    .catch(() => pobierzJson(urlKursowEbc()))
    .then((dane) => {
      const zapis: KursyZapisane = { pobranoMs: Date.now(), dataEcb: dane.date, kursy: dane.rates }
      zapisz(KLUCZ_KURSOW, JSON.stringify(zapis))
      window.dispatchEvent(new Event(CHANGE_EVENT))
      return true
    })
    .catch((err) => {
      consoleReporter.reportError({
        userMessage: "Nie udało się pobrać kursów walut — używam ostatnich zapisanych.",
        technicalDetails: "pobranie kursów (serwer aplikacji i Frankfurter/ECB) nie powiodło się",
        source: "lib/waluta/storage.odswiezKursy",
        cause: err,
      })
      return false
    })
    .finally(() => {
      wToku = null
    })
  return wToku
}

export function kursyPrzeterminowane(k: KursyZapisane | null, teraz = Date.now()): boolean {
  return !k || teraz - k.pobranoMs > WAZNOSC_KURSOW_MS
}
