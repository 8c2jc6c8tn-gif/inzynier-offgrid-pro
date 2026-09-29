/**
 * Help content shapes — standard 8.4 (the „?” next to a field and the Migawka for the whole screen),
 * owner decisions D34 and D51 (`rejestr-decyzji.md`).
 *
 * The content lives outside the flat message dictionaries on purpose: every screen is one object,
 * every language file mirrors the Polish shape, and `Tlumaczenie<T>` turns a missing key in EN/RU
 * into a compile error (17.1 — no silent fallback).
 */

/** The „?” popover of a single field (8.4, last paragraph). */
export type PomocPolaTresc = {
  /** Full name of the parameter, without abbreviations. */
  nazwa: string
  /** What it is for — how the calculator uses it, in plain words. */
  cel: string
  /** Where to find the value (nameplate, datasheet, invoice, measurement...). */
  gdzie: string
  /**
   * Typical range — only from sources/standards in the repo; if the repo has none,
   * „range from the datasheet” (Directive #1, never guessed).
   */
  zakres: string
}

/** The „i” Migawka of a whole screen (8.4 Section D, D34 point 2 — rich, for a layperson). */
export type MigawkaTresc = {
  /** One or two sentences: what this is about. */
  oCoChodzi: string
  /** How the calculator works, step by step. */
  jakDziala: string
  /** Why it matters — what decision it helps to make, what goes wrong without it. */
  poCo: string
  /** Optional physics/standard background shown in the „Fizyka” tab next to the formula. */
  fizyka?: string
}

/** A screen: its „i” Migawka and the „?” of its fields. */
export type PomocEkranu = {
  migawka: MigawkaTresc
  pola: Record<string, PomocPolaTresc>
}

/** Fields of a component shared by several screens (e.g. Dom/Firma pairs) — no Migawka of its own. */
export type PomocGrupy = {
  pola: Record<string, PomocPolaTresc>
}

/** Same keys as the Polish original, every leaf a string — for the EN/RU files. */
export type Tlumaczenie<T> = { [K in keyof T]: T[K] extends string ? string : Tlumaczenie<T[K]> }
