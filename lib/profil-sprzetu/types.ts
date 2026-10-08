/**
 * Profil sprzętu (docs/zrodla/Zasady_UX_Doradca_v2_1.md, §10) — dane wspólne dla wielu ekranów,
 * zapamiętane raz i podstawiane wszędzie, zamiast wpisywania tej samej liczby od nowa na każdym
 * ekranie, który jej używa.
 *
 * Zakres tej pierwszej wersji świadomie wąski — tylko sekcja `bateria`, wystarczająca do spięcia
 * Ekranu 1 (dobor-pojemnosci) i Ekranu 6 (starzenie-degradacja), Moduł 4. Pełna wizja źródła
 * (panel/falownik/BMS/generator, wiele zapisanych profili/wariantów, ostrzeżenie o niezapisanych
 * zmianach) świadomie NIE zbudowana teraz — `docs/memory.md`, wpis 19.09.2026.
 *
 * Wersja danych 2 (08.10.2026, D81, spec 20.3): dodana sekcja `panel` — panel podstawowy wybrany w Porównywarce
 * paneli PV, wyłącznie za zgodą użytkownika (U14). Tylko ta jedna sekcja; reszta wizji nadal niezbudowana.
 */
import type { DanePanelu } from "@/lib/core/modules/pv/porownywarka-paneli/input"

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

/**
 * Panel podstawowy: MIGAWKA danych z chwili zgody użytkownika (spec 20.3 pkt 1) — panel ręczny albo z OCR nie istnieje
 * w katalogu, więc samo odwołanie do katalogu wskazywałoby w próżnię. Bez ceny: cena to fakt zakupu, nie dana z karty.
 */
export type ProfilSprzetuPanelu = {
  podstawowy: Omit<DanePanelu, "cenaBruttoZl">
  /** Wpis katalogu, z którego pochodzą liczby (żeby karta pozostała klikalnym źródłem); `null` = wpisane ręcznie. */
  katalogId: string | null
  zapisanoIso: string
}

export type ProfilSprzetu = {
  /** Brak pola = wersja 1 (zapisy sprzed 08.10.2026: tylko `bateria`). */
  schemaVersion?: number
  bateria?: ProfilSprzetuBaterii
  panel?: ProfilSprzetuPanelu
}

export const WERSJA_PROFILU_SPRZETU = 2

/** Migracja 1 → 2: czysto addytywna (nowa sekcja opcjonalna) — dane wersji 1 przechodzą bez zmian, dostają tylko numer wersji. */
export function migrujProfil(zapisany: ProfilSprzetu): ProfilSprzetu {
  return { ...zapisany, schemaVersion: WERSJA_PROFILU_SPRZETU }
}
