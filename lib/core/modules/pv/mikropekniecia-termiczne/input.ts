/**
 * Ekran 7, Moduł 3 "Instalacja PV" — "Mikropęknięcia termiczne" (dawne 2.13, §3.13
 * `docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md` linie 1495–1510;
 * `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md` Ekran 7). Wzorzec C z elementem sprawdzenia:
 * Biblia — "system sprawdza, czy uwzględniono podkładki dylatacyjne i luz między panelami",
 * "ostrzeżenie, jeśli montaż jest sztywny".
 */

export type MikropeknieciaTermiczneInput = {
  /** Odstęp dylatacyjny między panelami [mm]. `null` = nie wpisano (0 mm to legalna wartość — montaż na styk, D15). */
  odstepDylatacyjnyMm: number | null
  /** Czy w mocowaniu zastosowano podkładki EPDM (elastyczne, gumowe). */
  podkladkiEpdm: boolean
}
