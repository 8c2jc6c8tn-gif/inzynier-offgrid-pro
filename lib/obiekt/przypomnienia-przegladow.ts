/**
 * Browser reminder about overdue inspections (screen "Terminarz przeglądów i serwisu"). A per-device preference, not project data, so it lives in
 * `localStorage` like the other appearance and dashboard choices (`lib/pulpit/storage.ts`, `lib/wyglad/storage.ts`).
 *
 * What it does and does not do: the notification is shown when the app is OPENED (dashboard) on a day it has not been shown yet. An offline-first PWA has
 * no reliable background schedule (no push server, no periodic background sync everywhere), so nothing is sent while the app is closed. The permission
 * is asked only on the user's click on the checkbox, never on load.
 */
import { useSyncExternalStore } from "react"

export type PrzypomnieniaPrzegladow = {
  /** The user chose to get the reminder. */
  wlaczone: boolean
  /** Local calendar day `RRRR-MM-DD` of the last shown notification (one per day). */
  ostatnioDzien: string
}

export type UprawnienieNotyfikacji = "granted" | "denied" | "default" | "brak-obslugi"

const KLUCZ = "offgrid.przypomnienia-przegladow.v1"
const ZDARZENIE = "offgrid-przypomnienia-przegladow-change"
const DOMYSLNE: PrzypomnieniaPrzegladow = { wlaczone: false, ostatnioDzien: "" }

export function parsujPrzypomnienia(raw: string | null): PrzypomnieniaPrzegladow {
  if (!raw) return DOMYSLNE
  try {
    const p = JSON.parse(raw) as Partial<PrzypomnieniaPrzegladow>
    return { wlaczone: p.wlaczone === true, ostatnioDzien: typeof p.ostatnioDzien === "string" ? p.ostatnioDzien : "" }
  } catch {
    return DOMYSLNE
  }
}

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(KLUCZ)
  } catch {
    return null
  }
}

let cache: { raw: string | null; stan: PrzypomnieniaPrzegladow } | null = null
function getSnapshot(): PrzypomnieniaPrzegladow {
  const raw = odczytajRaw()
  if (cache && cache.raw === raw) return cache.stan
  cache = { raw, stan: parsujPrzypomnienia(raw) }
  return cache.stan
}
const getServerSnapshot = () => DOMYSLNE
function subscribe(cb: () => void): () => void {
  window.addEventListener(ZDARZENIE, cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener(ZDARZENIE, cb)
    window.removeEventListener("storage", cb)
  }
}

export function zapiszPrzypomnienia(stan: PrzypomnieniaPrzegladow): void {
  try {
    window.localStorage.setItem(KLUCZ, JSON.stringify(stan))
  } catch {
    // localStorage unavailable: the choice holds only for this session through the event below, it is not remembered.
  }
  window.dispatchEvent(new Event(ZDARZENIE))
}

export function usePrzypomnieniaPrzegladow(): PrzypomnieniaPrzegladow {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function uprawnienieNotyfikacji(): UprawnienieNotyfikacji {
  return typeof window !== "undefined" && "Notification" in window ? Notification.permission : "brak-obslugi"
}

/** Pure decision: show at most one notification a day, only when the user asked for it, the browser allowed it and something is overdue. */
export function czyPokazacPrzypomnienie(a: { stan: PrzypomnieniaPrzegladow; uprawnienie: UprawnienieNotyfikacji; poTerminie: number; dzisiaj: string }): boolean {
  return a.stan.wlaczone && a.uprawnienie === "granted" && a.poTerminie > 0 && a.stan.ostatnioDzien !== a.dzisiaj
}
