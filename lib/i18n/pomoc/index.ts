/**
 * All help content („?” per field + „i” Migawka per screen), merged from one file per module.
 * Standard 8.4, decisions D34/D51. A new screen adds its entry to its module file in the same
 * change that adds the screen — `pnpm check:pomoc-guard` blocks a screen without it.
 *
 * Every module file exports `pl` (the source shape) and `en`/`ru` typed `Tlumaczenie<typeof pl>`,
 * so a missing translation is a compile error, not a silent fallback (17.1).
 */
import type { Language } from "../language"
import type { MigawkaTresc, PomocEkranu, PomocGrupy } from "./typy"
import * as m12 from "./m12-kalkulator-mobilny"

const pomocPl = {
  ...m12.pl,
} satisfies Record<string, PomocEkranu | PomocGrupy>

export type PomocWszystko = typeof pomocPl
/** Any entry with fields — a screen or a shared group. */
export type GrupaPomocy = keyof PomocWszystko
export type PolePomocy<G extends GrupaPomocy> = keyof PomocWszystko[G]["pola"] & string
/** Only screens — entries that carry a Migawka („i”). */
export type EkranPomocy = {
  [K in GrupaPomocy]: PomocWszystko[K] extends { migawka: MigawkaTresc } ? K : never
}[GrupaPomocy]

export const pomoc: Record<Language, PomocWszystko> = {
  pl: pomocPl,
  en: { ...m12.en },
  ru: { ...m12.ru },
}

/** Module parts, exposed for the duplicate-key test (a spread silently overwrites a repeated screen id). */
export const czesciPomocy: Record<string, object>[] = [m12.pl]
