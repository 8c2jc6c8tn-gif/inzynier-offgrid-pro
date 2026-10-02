/**
 * Translation keys for the registry texts (`registry.ts`) — the registry keeps the Polish text as the
 * source of truth, the screens look the text up under a key derived from the tile id / screen href.
 * Keys are deterministic, so a new tile or screen needs only its entries in
 * `lib/i18n/ui/pulpit-rejestr.ts` (a test generated from the registry fails when one is missing).
 * A screen key is scoped by the tile: the same href appears in several tiles under different labels.
 */
import { dictionaries } from "@/lib/i18n/dictionaries"
import type { Language } from "@/lib/i18n/language"

export function kluczKafelNazwa(kafelId: number): string {
  return `UI-KAFEL-${kafelId}-NAZWA`
}

export function kluczKafelOpis(kafelId: number): string {
  return `UI-KAFEL-${kafelId}-OPIS`
}

export function kluczEkranu(kafelId: number, href: string): string {
  const slug = href.split("/").filter(Boolean).pop() ?? ""
  return `UI-EKRAN-${kafelId}-${slug.toUpperCase()}`
}

/** Text under `klucz` in the language; the Polish registry text when the key is not defined (never empty). */
export function tekstRejestru(language: Language, klucz: string, fallbackPl: string): string {
  return dictionaries[language][klucz] ?? fallbackPl
}
