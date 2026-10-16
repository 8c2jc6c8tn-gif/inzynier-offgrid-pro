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
import * as m12b from "./m12b-kalkulator-mobilny"
import * as m14 from "./m14-siec"
import * as m08 from "./m08-bezpieczenstwo"
import * as m05 from "./m05-okablowanie"
import * as m04 from "./m04-baterie"
import * as m11 from "./m11-montaz-baterii"
import * as m03 from "./m03-pv"
import * as m02 from "./m02-zapotrzebowanie"
import * as m07 from "./m07-stress-test"
import * as m06 from "./m06-ogrzewanie"
import * as m01 from "./m01-lokalizacja"
import * as m09 from "./m09-esp32"
import * as m10 from "./m10-prognozy"
import * as m13 from "./m13-live"
import * as ustawienia from "./ustawienia"
import * as m06b from "./m06b-ogrzewanie"
import * as m07b from "./m07b-stress-test"
import * as m07c from "./m07c-stress-test"
import * as m03b from "./m03b-porownywarka"
import * as m03c from "./m03c-odstep-rzedow"
import * as m06c from "./m06c-ogrzewanie"
import * as m06d from "./m06d-ogrzewanie"
import * as m06e from "./m06e-ogrzewanie"
import * as m13b from "./m13b-live"

const pomocPl = {
  ...m12.pl,
  ...m12b.pl,
  ...m14.pl,
  ...m08.pl,
  ...m05.pl,
  ...m04.pl,
  ...m11.pl,
  ...m03.pl,
  ...m02.pl,
  ...m07.pl,
  ...m06.pl,
  ...m01.pl,
  ...m09.pl,
  ...m10.pl,
  ...m13.pl,
  ...ustawienia.pl,
  ...m06b.pl,
  ...m07b.pl,
  ...m07c.pl,
  ...m03b.pl,
  ...m03c.pl,
  ...m06c.pl,
  ...m06d.pl,
  ...m06e.pl,
  ...m13b.pl,
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
  en: { ...m12.en, ...m12b.en, ...m14.en, ...m08.en, ...m05.en, ...m04.en, ...m11.en, ...m03.en, ...m02.en, ...m07.en, ...m06.en, ...m01.en, ...m09.en, ...m10.en, ...m13.en, ...ustawienia.en, ...m06b.en, ...m07b.en, ...m07c.en, ...m03b.en, ...m03c.en, ...m06c.en, ...m06d.en, ...m06e.en, ...m13b.en },
  ru: { ...m12.ru, ...m12b.ru, ...m14.ru, ...m08.ru, ...m05.ru, ...m04.ru, ...m11.ru, ...m03.ru, ...m02.ru, ...m07.ru, ...m06.ru, ...m01.ru, ...m09.ru, ...m10.ru, ...m13.ru, ...ustawienia.ru, ...m06b.ru, ...m07b.ru, ...m07c.ru, ...m03b.ru, ...m03c.ru, ...m06c.ru, ...m06d.ru, ...m06e.ru, ...m13b.ru },
}

/** Module parts, exposed for the duplicate-key test (a spread silently overwrites a repeated screen id). */
export const czesciPomocy: Record<string, object>[] = [m12.pl, m12b.pl, m14.pl, m08.pl, m05.pl, m04.pl, m11.pl, m03.pl, m02.pl, m07.pl, m06.pl, m01.pl, m09.pl, m10.pl, m13.pl, ustawienia.pl, m06b.pl, m07b.pl, m07c.pl, m03b.pl, m03c.pl, m06c.pl, m06d.pl, m06e.pl, m13b.pl]
