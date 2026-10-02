/**
 * Moduł 10, Ekran 12 — „Generalny audyt zimowy — RAPORT” (dawne 12.36). The checklist, 1:1 from the source:
 * „test generatora, test webasto, przegląd instalacji grzewczej, sprawdzenie zapasów paliwa, weryfikacja grzałek BMS”.
 * Five items — the source's own example says „8/10 punktów”, which does not match its list (reported, not invented:
 * no further items are added).
 */
export const POZYCJE_AUDYTU = ["test-generatora", "test-webasto", "przeglad-grzewczej", "zapas-paliwa", "grzalki-bms"] as const

export type PozycjaAudytu = (typeof POZYCJE_AUDYTU)[number]

/** Engine message per item that is not ready — one fixed code each (no codes built at runtime). */
export const KOD_NIEGOTOWE: Record<PozycjaAudytu, string> = {
  "test-generatora": "AZIM-TEST-GENERATORA",
  "test-webasto": "AZIM-TEST-WEBASTO",
  "przeglad-grzewczej": "AZIM-PRZEGLAD-GRZEWCZEJ",
  "zapas-paliwa": "AZIM-ZAPAS-PALIWA",
  "grzalki-bms": "AZIM-GRZALKI-BMS",
}
