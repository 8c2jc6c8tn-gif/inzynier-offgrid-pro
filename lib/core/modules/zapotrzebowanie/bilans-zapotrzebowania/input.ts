/**
 * Moduł 2 — „Bilans zapotrzebowania” (decision D-3, owner 24.11.2026): one daily energy demand of the whole site from what the
 * other Module 2 screens already compute. The engine only sums; the screen reads the sources (`lib/zapotrzebowanie/zrodla-bilansu.ts`).
 */

export const ZRODLA_BILANSU = ["odbiorniki", "bojler", "wampiry", "falownik", "zmienne", "specjalne", "sezonowe"] as const
export type ZrodloBilansu = (typeof ZRODLA_BILANSU)[number]

export type PozycjaBilansu = {
  zrodlo: ZrodloBilansu
  /** Unticked by the user (e.g. counted already in the appliance list) — shown, not summed. */
  wlaczona: boolean
  /** `null` = the source screen is not filled in. */
  kwhDobaTypowa: number | null
  /** 12 months from January [kWh/day]; `null` together with `kwhDobaTypowa`. */
  kwhDobaMiesiace: number[] | null
}

export type BilansZapotrzebowaniaInput = {
  pozycje: PozycjaBilansu[]
  /** Expansion buffer from the „Bufor na rozbudowę” screen [%]; `null` = not chosen (no buffer applied). */
  buforPct: number | null
}
