/**
 * Ekran 7, Moduł 4 "Magazyn energii / baterie" — "Obwód Pre-Charge" (dawne 3.7,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D. Formuła kanoniczna — Ekran A4
 * Modułu 11 (`montaz-baterii/podlaczenie-bms`) opisuje ten sam fakt fizyczny w kontekście
 * procedury montażu i re-używa stąd obliczenie (wzorzec "echo", docs/standards/01-architektura.md,
 * 1.3), zamiast duplikować wzór.
 */

export type ObwodPrechargeInput = {
  /** Pojemność wejściowa DC falownika [µF]. 0 = jeszcze nie wpisano. */
  pojemnoscFalownikaUf: number
  /** Rezystor wstępny użyty do pre-charge [Ω] — przykład ze źródła: 50Ω/50W. 0 = jeszcze nie wpisano. */
  rezystancjaPreChargeOhm: number
}
