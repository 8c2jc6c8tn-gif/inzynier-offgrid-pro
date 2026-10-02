/**
 * Planning grid of Screen 5 (M10). Not a physical constant — a resolution choice (✅🤖, `docs/lista-do-zrobienia.md`
 * ⚠️ 02.10.2026): the source example uses half hours („uruchomione o 11:30 … gotowe na 13:00”), so start times,
 * run times and deadlines are planned in 30-minute steps.
 */
export const KROK_PLANU_H = 0.5

/** Planning horizon: one day, the same 24 h as the forecast of Screen 1. */
export const HORYZONT_H = 24

/** "11:30" from 11.5 — the same text in engine messages and on the screen. */
export function godzinaTekst(h: number): string {
  const min = Math.round(h * 60)
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`
}
