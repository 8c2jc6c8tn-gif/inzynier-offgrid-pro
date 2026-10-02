/**
 * Moduł 10 "AI i prognozy", Ekran 12 — „Generalny audyt zimowy — RAPORT” (dawne 12.36, Wzorzec G,
 * docs/zrodla/Tresc_Modul_10_AI_Ekrany.md). Generated at the start of the winter season.
 */
import type { PozycjaAudytu } from "./constants"

/**
 * gotowe = done; zaplanowane = planned but not done (the source example: „test webasto zaplanowany, ale nie
 * wykonany” counts as a gap); brak = not done; nie-dotyczy = the installation has no such element (e.g. no webasto).
 */
export type StanPozycji = "gotowe" | "zaplanowane" | "brak" | "nie-dotyczy"

export type AudytZimowyInput = {
  /** Missing / null = not assessed yet. */
  pozycje: Partial<Record<PozycjaAudytu, StanPozycji | null>>
  /** Optional: fuel in stock [l]. With `wymaganyZapasL` the fuel item is judged from the numbers. */
  zapasPaliwaL: number | null
  /** Optional: fuel needed for the winter [l] — the user's figure (e.g. from Moduł 2 Ekran 17 or Moduł 7). */
  wymaganyZapasL: number | null
}
