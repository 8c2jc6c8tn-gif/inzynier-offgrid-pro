/**
 * Ekran 6, Moduł 4 "Magazyn energii / baterie" — "Starzenie i degradacja ogniw (bufor
 * projektowy)" (dawne 3.6, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D. Zasila
 * bufor starzeniowy Ekranu 1 (Dobór pojemności baterii) — świadomie pominięty tam, gdy Ekran 6
 * jeszcze nie istniał (`lib/core/modules/baterie/dobor-pojemnosci/`).
 */

export type HoryzontLata = 5 | 10 | 15

export type StarzenieDegradacjaInput = {
  /** Pojemność użyteczna potrzebna dziś [kWh] — docelowo z Ekranu 1. 0 = jeszcze nie wpisano. */
  pojemnoscUzytecznaDzisKwh: number
  /** Horyzont projektowy — suwak 5/10/15 lat wg źródła. */
  horyzontLata: HoryzontLata
  /** Roczny spadek pojemności [%] — źródło: "LiFePO4 traci ok. 2-3% rocznie". 0 = jeszcze nie wpisano. */
  degradacjaRocznaPct: number
}
