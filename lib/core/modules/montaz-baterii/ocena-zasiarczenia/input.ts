/**
 * Ekran B10, Moduł 11 "Montaż baterii", Ścieżka B (kwasowo-ołowiowa) — "Ocena zużycia —
 * siarczanowanie" (dawne 10.16 — docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md).
 * Każda pozycja to obserwowalny objaw (nie krok procesu do wykonania) — w odróżnieniu od
 * checklisty A7/B1/B6/B8, "niezaznaczone" tu oznacza realnie "nieobserwowane", nie "jeszcze nie
 * sprawdzone", więc kalkulator może mieć pełną logikę werdyktu zamiast tylko liczyć postęp.
 */

export type OcenaZasiarczeniaInput = {
  obserwowaneObjawyIds: string[]
}
