/**
 * Preferencja motywu (jasny/ciemny/systemowy) — "drobna preferencja UI", nie dana projektu
 * (ZASADY_APLIKACJI.md, Zasada 6 — offline-first), ten sam wzorzec co `lib/pulpit/storage.ts`.
 * Ekspozycja przez `useSyncExternalStore` z tego samego powodu (bez react-hooks/set-state-in-effect).
 *
 * Mechanizm CSS już istnieje (`app/globals.css`): klasa `.dark`/`.light` na `<html>` wymusza
 * motyw, brak klasy = `prefers-color-scheme` systemu. Ten moduł tylko zarządza, która klasa jest
 * ustawiona, i pamięta wybór. Zastosowanie przy pierwszym renderze (bez migotania) — patrz inline
 * skrypt w `app/layout.tsx`, który czyta ten sam klucz synchronicznie przed pierwszym malowaniem.
 */

export type ThemeMode = "system" | "light" | "dark"

export const STORAGE_KEY = "offgrid.theme.v1"
const CHANGE_EVENT = "offgrid-theme-change"

function jestTrybem(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark"
}

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function zastosujTryb(mode: ThemeMode): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.remove("light", "dark")
  if (mode !== "system") root.classList.add(mode)
}

let cache: { raw: string | null; tryb: ThemeMode } | null = null

export function getSnapshot(): ThemeMode {
  const raw = odczytajRaw()
  if (cache && cache.raw === raw) return cache.tryb
  const tryb = jestTrybem(raw) ? raw : "system"
  cache = { raw, tryb }
  return tryb
}

export function getServerSnapshot(): ThemeMode {
  return "system"
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function zapiszTryb(mode: ThemeMode): void {
  if (typeof window === "undefined") return
  zastosujTryb(mode)
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // localStorage niedostępny (tryb prywatny itp.) — wybór nie zostanie zapamiętany,
    // ale motyw i tak jest zastosowany na tę sesję (drobna preferencja UI, nie błąd krytyczny).
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
