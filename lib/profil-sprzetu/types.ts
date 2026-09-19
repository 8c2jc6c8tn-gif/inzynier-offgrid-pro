/**
 * Profil sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) — dane wspólne dla wielu ekranów,
 * zapamiętane raz i podstawiane wszędzie, zamiast wpisywania tej samej liczby od nowa na każdym
 * ekranie, który jej używa.
 *
 * Zakres tej pierwszej wersji świadomie wąski — tylko sekcja `bateria`, wystarczająca do spięcia
 * Ekranu 1 (dobor-pojemnosci) i Ekranu 6 (starzenie-degradacja), Moduł 4. Pełna wizja źródła
 * (panel/falownik/BMS/generator, wiele zapisanych profili/wariantów, ostrzeżenie o niezapisanych
 * zmianach) świadomie NIE zbudowana teraz — `docs/memory.md`, wpis 19.09.2026.
 */

export type ProfilSprzetuBaterii = {
  /** Pojemność użyteczna potrzebna dziś [kWh] — wynik Ekranu 1 (dobor-pojemnosci). */
  pojemnoscUzytecznaDzisKwh?: number
  /** ISO 8601 — kiedy `pojemnoscUzytecznaDzisKwh` było ostatnio policzone. */
  pojemnoscUzytecznaDzisZaktualizowanoIso?: string
  /** Pojemność początkowa z uwzględnieniem bufora starzeniowego [kWh] — wynik Ekranu 6. */
  pojemnoscPoczatkowaZBuforemKwh?: number
  /** Horyzont projektowy [lata], dla którego policzono `pojemnoscPoczatkowaZBuforemKwh`. */
  buforHoryzontLata?: number
  /** ISO 8601 — kiedy `pojemnoscPoczatkowaZBuforemKwh` było ostatnio policzone. */
  pojemnoscZBuforemZaktualizowanoIso?: string
}

export type ProfilSprzetu = {
  bateria?: ProfilSprzetuBaterii
}
