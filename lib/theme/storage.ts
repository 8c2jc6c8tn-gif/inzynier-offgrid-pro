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

import { consoleReporter } from "@/lib/core/reporter"

export type ThemeMode = "system" | "light" | "dark"

export const STORAGE_KEY = "offgrid.theme.v1"
const CHANGE_EVENT = "offgrid-theme-change"

function jestTrybem(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark"
}

function odczytajRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    consoleReporter.reportError({
      userMessage: "Nie udało się odczytać zapisanego motywu — pokazany systemowy.",
      technicalDetails: `localStorage.getItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/theme/storage.odczytajRaw",
      cause: err,
    })
    return null
  }
}

/**
 * An appearance style (`lib/wyglad/style.ts`) has a fixed scheme, written by `lib/wyglad/storage.ts`
 * as `data-schemat-stylu` on `<html>` — it wins over the user's mode so the `dark:` variants match
 * the style's colours. The saved mode is kept and comes back with the default look.
 */
export function zastosujTryb(mode: ThemeMode): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const schematStylu = root.dataset.schematStylu
  const efektywny = schematStylu === "light" || schematStylu === "dark" ? schematStylu : mode
  root.classList.remove("light", "dark")
  if (efektywny !== "system") root.classList.add(efektywny)
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
  } catch (err) {
    // localStorage niedostępny (tryb prywatny itp.) — wybór nie zostanie zapamiętany,
    // ale motyw i tak jest zastosowany na tę sesję (drobna preferencja UI, nie błąd krytyczny).
    consoleReporter.reportError({
      userMessage: "Nie udało się zapisać motywu — zmiana obowiązuje tylko w tej sesji.",
      technicalDetails: `localStorage.setItem(${STORAGE_KEY}) nie powiódł się`,
      source: "lib/theme/storage.zapiszTryb",
      cause: err,
    })
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
