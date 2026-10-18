/** Draft of the screen "Terminarz przeglądów i serwisu" (form strings) and its mapping to the engine input. UI layer, not domain. */
import type { PozycjaPrzegladu } from "@/lib/core/modules/bezpieczenstwo/terminarz-przegladow/input"
import { calculateTerminarzPrzegladow } from "@/lib/core/modules/bezpieczenstwo/terminarz-przegladow/calculator"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

export const KLUCZ_DRAFTU_TERMINARZ = "terminarz-przegladow"

export type PozycjaSeed = { id: string; nazwa: string; ostatni: string; interwal: string }
export type SeedTerminarza = { pozycje: PozycjaSeed[] }

export const PUSTY_SEED_TERMINARZA: SeedTerminarza = { pozycje: [] }

export function pozycjeDoSilnika(seed: SeedTerminarza): PozycjaPrzegladu[] {
  return seed.pozycje.map((p) => ({
    id: p.id,
    nazwa: p.nazwa.trim() || "—",
    ostatniPrzegladData: p.ostatni.trim() === "" ? null : p.ostatni.trim(),
    interwalMiesiecy: liczba(p.interwal) ?? null,
  }))
}

/** Local calendar day as `RRRR-MM-DD` (the engine does not read the clock). */
export function dzisiajLokalnie(teraz: Date = new Date()): string {
  const d = (n: number) => String(n).padStart(2, "0")
  return `${String(teraz.getFullYear()).padStart(4, "0")}-${d(teraz.getMonth() + 1)}-${d(teraz.getDate())}`
}

/**
 * How many inspections of the saved schedule are overdue on the given day (for the bell on the dashboard). 0 without a saved schedule or without
 * overdue items; the schedule itself is user data, nothing is added or guessed.
 */
export function liczbaPrzegladowPoTerminie(seed: SeedTerminarza | null | undefined, dzisiaj: string): number {
  if (!seed || seed.pozycje.length === 0) return 0
  const wynik = calculateTerminarzPrzegladow({ pozycje: pozycjeDoSilnika(seed), dzisiaj }).value
  return wynik?.poTerminie ?? 0
}
